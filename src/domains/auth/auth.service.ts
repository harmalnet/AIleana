import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly walletsService: WalletsService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.usersService.create(registerDto);

    // Create wallet for the new user
    await this.walletsService.createWallet(user.id);

    const token = this.generateToken(user.id, user.email);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userWithWallet = await this.usersService.findByEmailWithWallet(
      user.email,
    );

    if (!userWithWallet) {
      throw new UnauthorizedException('User not found');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      message: 'Login successful',
      user: {
        id: userWithWallet.id,
        email: userWithWallet.email,
        fullName: userWithWallet.fullName,
        phoneNumber: userWithWallet.phoneNumber,
        wallet: userWithWallet.wallet,
      },
      token,
    };
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
