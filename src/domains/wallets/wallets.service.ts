import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletsRepository: Repository<Wallet>,
  ) {}

  async createWallet(userId: string): Promise<Wallet> {
    const existingWallet = await this.walletsRepository.findOne({
      where: { userId },
    });

    if (existingWallet) {
      return existingWallet;
    }

    const wallet = this.walletsRepository.create({
      userId,
      balance: 0,
      currency: 'NGN',
    });

    return await this.walletsRepository.save(wallet);
  }

  async getWalletByUserId(userId: string): Promise<Wallet> {
    const wallet = await this.walletsRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async getBalance(userId: string): Promise<{ balance: number; currency: string }> {
    const wallet = await this.getWalletByUserId(userId);
    return {
      balance: Number(wallet.balance),
      currency: wallet.currency,
    };
  }

  async creditWallet(
    userId: string,
    amount: number,
    transactionRef?: string,
  ): Promise<Wallet> {
    const wallet = await this.getWalletByUserId(userId);

    wallet.balance = Number(wallet.balance) + amount;

    return await this.walletsRepository.save(wallet);
  }

  async debitWallet(userId: string, amount: number): Promise<Wallet> {
    const wallet = await this.getWalletByUserId(userId);

    if (Number(wallet.balance) < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    wallet.balance = Number(wallet.balance) - amount;

    return await this.walletsRepository.save(wallet);
  }

  async hasEnoughBalance(userId: string, amount: number): Promise<boolean> {
    const wallet = await this.getWalletByUserId(userId);
    return Number(wallet.balance) >= amount;
  }

  async fundWalletDemo(
    userId: string,
    amount: number,
  ): Promise<{ message: string; balance: number; credited: number }> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const wallet = await this.creditWallet(userId, amount);

    return {
      message: 'Wallet funded successfully (Demo)',
      balance: Number(wallet.balance),
      credited: amount,
    };
  }
}
