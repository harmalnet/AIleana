import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to AIleana API - Payments & Calls Management System';
  }
}
