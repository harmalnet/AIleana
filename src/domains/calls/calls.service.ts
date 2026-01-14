import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { callStatus, callType } from '@/constants';

import { PaymentsService } from '../payments/payments.service';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import { InitiateCallDto } from './dto/initiate-call.dto';
import { SignalDto } from './dto/signal.dto';
import { CallSession } from './entities/call-session.entity';

@Injectable()
export class CallsService {
  private readonly RATE_PER_MINUTE = 50; // NGN 50 per minute

  constructor(
    @InjectRepository(CallSession)
    private readonly callSessionRepository: Repository<CallSession>,
    private readonly usersService: UsersService,
    private readonly walletsService: WalletsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async initiateCall(callerId: string, initiateCallDto: InitiateCallDto) {
    // Validate receiver exists
    const receiver = await this.usersService.findOne(
      initiateCallDto.receiverId,
    );

    if (callerId === initiateCallDto.receiverId) {
      throw new BadRequestException('Cannot call yourself');
    }

    // Check caller wallet balance
    const hasBalance = await this.walletsService.hasEnoughBalance(
      callerId,
      this.RATE_PER_MINUTE,
    );

    if (!hasBalance) {
      throw new BadRequestException(
        'Insufficient wallet balance. Please fund your wallet.',
      );
    }

    // Generate session ID
    const sessionId = `CALL-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create call session
    const callSession = this.callSessionRepository.create({
      callerId,
      receiverId: initiateCallDto.receiverId,
      callType: initiateCallDto.callType || callType.Voice,
      sessionId,
      status: callStatus.Initiated,
      ratePerMinute: this.RATE_PER_MINUTE,
    });

    await this.callSessionRepository.save(callSession);

    return {
      message: 'Call initiated successfully',
      sessionId: callSession.sessionId,
      callId: callSession.id,
      callType: callSession.callType,
      status: callSession.status,
      receiver: {
        id: receiver.id,
        fullName: receiver.fullName,
      },
      ratePerMinute: this.RATE_PER_MINUTE,
    };
  }

  async sendSignal(sessionId: string, userId: string, signalDto: SignalDto) {
    const callSession = await this.callSessionRepository.findOne({
      where: { sessionId },
    });

    if (!callSession) {
      throw new NotFoundException('Call session not found');
    }

    // Verify user is part of the call
    if (callSession.callerId !== userId && callSession.receiverId !== userId) {
      throw new BadRequestException('Unauthorized to send signal');
    }

    // Store signaling data (mocked - in real WebRTC, this would be sent via WebSocket)
    callSession.signalingData = JSON.stringify({
      type: signalDto.type,
      data: signalDto.data,
      from: userId,
      timestamp: new Date(),
    });

    await this.callSessionRepository.save(callSession);

    return {
      message: 'Signal sent successfully',
      sessionId: callSession.sessionId,
    };
  }

  async answerCall(sessionId: string, receiverId: string) {
    const callSession = await this.callSessionRepository.findOne({
      where: { sessionId },
    });

    if (!callSession) {
      throw new NotFoundException('Call session not found');
    }

    if (callSession.receiverId !== receiverId) {
      throw new BadRequestException('Unauthorized to answer this call');
    }

    if (
      callSession.status !== callStatus.Initiated &&
      callSession.status !== callStatus.Ringing
    ) {
      throw new BadRequestException('Call cannot be answered in current state');
    }

    callSession.status = callStatus.Ongoing;
    callSession.startedAt = new Date();

    await this.callSessionRepository.save(callSession);

    return {
      message: 'Call answered',
      sessionId: callSession.sessionId,
      status: callSession.status,
    };
  }

  async rejectCall(sessionId: string, receiverId: string) {
    const callSession = await this.callSessionRepository.findOne({
      where: { sessionId },
    });

    if (!callSession) {
      throw new NotFoundException('Call session not found');
    }

    if (callSession.receiverId !== receiverId) {
      throw new BadRequestException('Unauthorized to reject this call');
    }

    callSession.status = callStatus.Rejected;
    callSession.endedAt = new Date();

    await this.callSessionRepository.save(callSession);

    return {
      message: 'Call rejected',
      sessionId: callSession.sessionId,
      status: callSession.status,
    };
  }

  async endCall(sessionId: string, userId: string) {
    const callSession = await this.callSessionRepository.findOne({
      where: { sessionId },
    });

    if (!callSession) {
      throw new NotFoundException('Call session not found');
    }

    if (callSession.callerId !== userId && callSession.receiverId !== userId) {
      throw new BadRequestException('Unauthorized to end this call');
    }

    if (callSession.status === callStatus.Ended) {
      return {
        message: 'Call already ended',
        sessionId: callSession.sessionId,
      };
    }

    callSession.status = callStatus.Ended;
    callSession.endedAt = new Date();

    // Calculate duration and cost if call was ongoing
    if (callSession.startedAt) {
      const durationMs =
        callSession.endedAt.getTime() - callSession.startedAt.getTime();
      callSession.duration = Math.ceil(durationMs / 1000); // seconds

      const minutes = Math.ceil(callSession.duration / 60);
      callSession.totalCost = minutes * this.RATE_PER_MINUTE;

      // Charge caller
      if (callSession.totalCost > 0) {
        try {
          await this.paymentsService.chargeForCall(
            callSession.callerId,
            callSession.totalCost,
            `Call charge - ${minutes} minute(s) @ NGN ${this.RATE_PER_MINUTE}/min`,
          );
        } catch (error) {
          callSession.metadata = {
            ...callSession.metadata,
            paymentError: error.message,
          };
        }
      }
    }

    await this.callSessionRepository.save(callSession);

    return {
      message: 'Call ended successfully',
      sessionId: callSession.sessionId,
      duration: callSession.duration,
      totalCost: Number(callSession.totalCost),
      status: callSession.status,
    };
  }

  async getCallHistory(userId: string) {
    const calls = await this.callSessionRepository.find({
      where: [{ callerId: userId }, { receiverId: userId }],
      relations: ['caller', 'receiver'],
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return calls.map((call) => ({
      id: call.id,
      sessionId: call.sessionId,
      callType: call.callType,
      status: call.status,
      duration: call.duration,
      totalCost: Number(call.totalCost),
      isIncoming: call.receiverId === userId,
      otherParty:
        call.callerId === userId
          ? {
              id: call.receiver.id,
              fullName: call.receiver.fullName,
            }
          : {
              id: call.caller.id,
              fullName: call.caller.fullName,
            },
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      createdAt: call.createdAt,
    }));
  }

  async getCallDetails(sessionId: string, userId: string) {
    const call = await this.callSessionRepository.findOne({
      where: { sessionId },
      relations: ['caller', 'receiver'],
    });

    if (!call) {
      throw new NotFoundException('Call session not found');
    }

    if (call.callerId !== userId && call.receiverId !== userId) {
      throw new BadRequestException('Unauthorized to view this call');
    }

    return {
      id: call.id,
      sessionId: call.sessionId,
      callType: call.callType,
      status: call.status,
      duration: call.duration,
      totalCost: Number(call.totalCost),
      ratePerMinute: Number(call.ratePerMinute),
      caller: {
        id: call.caller.id,
        fullName: call.caller.fullName,
      },
      receiver: {
        id: call.receiver.id,
        fullName: call.receiver.fullName,
      },
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      createdAt: call.createdAt,
    };
  }
}
