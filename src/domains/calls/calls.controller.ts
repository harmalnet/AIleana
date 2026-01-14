import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CallsService } from './calls.service';
import { InitiateCallDto } from './dto/initiate-call.dto';
import { SignalDto } from './dto/signal.dto';

@ApiTags('calls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate a call to another user' })
  initiateCall(@Req() req: any, @Body() initiateCallDto: InitiateCallDto) {
    return this.callsService.initiateCall(req.user.id, initiateCallDto);
  }

  @Post(':sessionId/signal')
  @ApiOperation({ summary: 'Send WebRTC signaling data (mocked)' })
  sendSignal(
    @Param('sessionId') sessionId: string,
    @Req() req: any,
    @Body() signalDto: SignalDto,
  ) {
    return this.callsService.sendSignal(sessionId, req.user.id, signalDto);
  }

  @Post(':sessionId/answer')
  @ApiOperation({ summary: 'Answer an incoming call' })
  answerCall(@Param('sessionId') sessionId: string, @Req() req: any) {
    return this.callsService.answerCall(sessionId, req.user.id);
  }

  @Post(':sessionId/reject')
  @ApiOperation({ summary: 'Reject an incoming call' })
  rejectCall(@Param('sessionId') sessionId: string, @Req() req: any) {
    return this.callsService.rejectCall(sessionId, req.user.id);
  }

  @Post(':sessionId/end')
  @ApiOperation({ summary: 'End an active call' })
  endCall(@Param('sessionId') sessionId: string, @Req() req: any) {
    return this.callsService.endCall(sessionId, req.user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get call history for the authenticated user' })
  getCallHistory(@Req() req: any) {
    return this.callsService.getCallHistory(req.user.id);
  }

  @Get(':sessionId')
  @ApiOperation({ summary: 'Get call session details' })
  getCallDetails(@Param('sessionId') sessionId: string, @Req() req: any) {
    return this.callsService.getCallDetails(sessionId, req.user.id);
  }
}
