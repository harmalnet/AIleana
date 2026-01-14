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
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { MonnifyWebhookDto } from './dto/monnify-webhook.dto';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Initiate payment for wallet funding' })
  initiatePayment(
    @Req() req: any,
    @Body() initiatePaymentDto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiatePayment(
      req.user.id,
      initiatePaymentDto.amount,
      initiatePaymentDto.description,
    );
  }

  @Post('webhook/monnify')
  @ApiOperation({
    summary: 'Monnify payment webhook (simulates Monnify callback)',
  })
  handleWebhook(@Body() webhookData: MonnifyWebhookDto) {
    return this.paymentsService.handleWebhook(webhookData);
  }

  @Get('verify/:transactionReference')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verify payment status' })
  verifyPayment(@Param('transactionReference') transactionReference: string) {
    return this.paymentsService.verifyPayment(transactionReference);
  }

  @Get('history')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get payment history' })
  getPaymentHistory(@Req() req: any) {
    return this.paymentsService.getPaymentHistory(req.user.id);
  }
}
