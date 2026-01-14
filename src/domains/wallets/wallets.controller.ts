import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { WalletsService } from './wallets.service';
import { PaymentsService } from '../payments/payments.service';

@ApiTags('wallets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/wallets')
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  getBalance(@Req() req: any) {
    return this.walletsService.getBalance(req.user.id);
  }

  @Post('fund')
  @ApiOperation({ summary: 'Fund wallet (Demo - Direct Credit)' })
  async fundWallet(@Req() req: any, @Body() fundWalletDto: FundWalletDto) {
    return this.walletsService.fundWalletDemo(
      req.user.id,
      fundWalletDto.amount,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get wallet details' })
  getWallet(@Req() req: any) {
    return this.walletsService.getWalletByUserId(req.user.id);
  }
}
