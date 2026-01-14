import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Mocked Monnify Service
 * In production, this would integrate with actual Monnify API
 */
@Injectable()
export class MonnifyService {
  private readonly apiKey: string;
  private readonly contractCode: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('MONNIFY_API_KEY') || 'mock-api-key';
    this.contractCode = this.configService.get<string>('MONNIFY_CONTRACT_CODE') || 'mock-contract';
    this.baseUrl = this.configService.get<string>('MONNIFY_BASE_URL') || 'https://api.monnify.com';
  }

  /**
   * Mock: Initialize payment transaction
   * In production, this would call Monnify API to get payment URL
   */
  async initializeTransaction(
    amount: number,
    customerEmail: string,
    customerName: string,
    transactionReference: string,
  ): Promise<{
    paymentReference: string;
    checkoutUrl: string;
    transactionReference: string;
  }> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock response
    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const checkoutUrl = `${this.baseUrl}/checkout/${paymentReference}`;

    return {
      paymentReference,
      checkoutUrl,
      transactionReference,
    };
  }

  /**
   * Mock: Verify payment transaction
   * In production, this would verify the transaction with Monnify
   */
  async verifyTransaction(transactionReference: string): Promise<{
    status: string;
    amount: number;
    paidAt: Date;
  }> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock successful payment
    return {
      status: 'PAID',
      amount: 1000,
      paidAt: new Date(),
    };
  }

  /**
   * Validate webhook signature
   * In production, this would validate Monnify webhook signature
   */
  validateWebhookSignature(payload: any, signature: string): boolean {
    // Mock validation - in production, use actual Monnify signature validation
    return true;
  }
}
