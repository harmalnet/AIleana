import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { paymentStatus, paymentType } from '@/constants';
import { PaymentStatus, PaymentType } from '@/types';
import { WalletsService } from '../wallets/wallets.service';
import { MonnifyWebhookDto } from './dto/monnify-webhook.dto';
import { Payment } from './entities/payment.entity';
import { MonnifyService } from './monnify.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    private readonly walletsService: WalletsService,
    private readonly monnifyService: MonnifyService,
  ) {}

  async initiatePayment(
    userId: string,
    amount: number,
    description?: string,
  ) {
    const wallet = await this.walletsService.getWalletByUserId(userId);

    // Generate unique transaction reference
    const transactionReference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create payment record
    const payment = this.paymentsRepository.create({
      walletId: wallet.id,
      transactionReference,
      amount,
      currency: 'NGN',
      status: paymentStatus.Pending,
      type: paymentType.WalletFunding,
      description: description || 'Wallet funding',
    });

    await this.paymentsRepository.save(payment);

    // Initialize Monnify transaction (mocked)
    const monnifyResponse = await this.monnifyService.initializeTransaction(
      amount,
      wallet.user.email,
      wallet.user.fullName,
      transactionReference,
    );

    // Update payment with Monnify reference
    payment.paymentReference = monnifyResponse.paymentReference;
    await this.paymentsRepository.save(payment);

    return {
      message: 'Payment initiated successfully',
      transactionReference: payment.transactionReference,
      paymentReference: payment.paymentReference,
      checkoutUrl: monnifyResponse.checkoutUrl,
      amount: Number(payment.amount),
      currency: payment.currency,
    };
  }

  async handleWebhook(webhookData: MonnifyWebhookDto) {
    const payment = await this.paymentsRepository.findOne({
      where: { transactionReference: webhookData.transactionReference },
      relations: ['wallet'],
    });

    if (!payment) {
      throw new NotFoundException('Payment transaction not found');
    }

    if (payment.status === paymentStatus.Success) {
      return { message: 'Payment already processed' };
    }

    // Update payment status
    if (webhookData.paymentStatus === 'PAID') {
      payment.status = paymentStatus.Success;
      payment.paidAt = webhookData.paidOn ? new Date(webhookData.paidOn) : new Date();
      payment.metadata = webhookData;

      await this.paymentsRepository.save(payment);

      // Credit user wallet
      await this.walletsService.creditWallet(
        payment.wallet.userId,
        webhookData.amountPaid,
        payment.transactionReference,
      );

      return {
        message: 'Payment processed successfully',
        transactionReference: payment.transactionReference,
      };
    } else {
      payment.status = paymentStatus.Failed;
      payment.metadata = webhookData;
      await this.paymentsRepository.save(payment);

      return { message: 'Payment failed' };
    }
  }

  async verifyPayment(transactionReference: string) {
    const payment = await this.paymentsRepository.findOne({
      where: { transactionReference },
      relations: ['wallet'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === paymentStatus.Success) {
      return {
        status: payment.status,
        amount: Number(payment.amount),
        paidAt: payment.paidAt,
      };
    }

    // Verify with Monnify (mocked)
    const verification = await this.monnifyService.verifyTransaction(
      transactionReference,
    );

    if (verification.status === 'PAID') {
      payment.status = paymentStatus.Success;
      payment.paidAt = verification.paidAt;
      await this.paymentsRepository.save(payment);

      // Credit wallet
      await this.walletsService.creditWallet(
        payment.wallet.userId,
        verification.amount,
        transactionReference,
      );
    }

    return {
      status: payment.status,
      amount: Number(payment.amount),
      paidAt: payment.paidAt,
    };
  }

  async getPaymentHistory(userId: string) {
    const wallet = await this.walletsService.getWalletByUserId(userId);

    const payments = await this.paymentsRepository.find({
      where: { walletId: wallet.id },
      order: { createdAt: 'DESC' },
    });

    return payments.map((payment) => ({
      id: payment.id,
      transactionReference: payment.transactionReference,
      amount: Number(payment.amount),
      currency: payment.currency,
      status: payment.status,
      type: payment.type,
      description: payment.description,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
    }));
  }

  async chargeForCall(userId: string, amount: number, description: string) {
    const wallet = await this.walletsService.getWalletByUserId(userId);

    const hasBalance = await this.walletsService.hasEnoughBalance(
      userId,
      amount,
    );
    if (!hasBalance) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    const transactionReference = `CALL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const payment = this.paymentsRepository.create({
      walletId: wallet.id,
      transactionReference,
      amount,
      currency: 'NGN',
      status: paymentStatus.Success,
      type: paymentType.CallCharge,
      description,
      paidAt: new Date(),
    });

    await this.paymentsRepository.save(payment);

    await this.walletsService.debitWallet(userId, amount);

    return payment;
  }
}
