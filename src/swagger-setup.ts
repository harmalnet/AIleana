import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('AIleana API')
    .setDescription(
      'AIleana Backend API - Payments & Calls Management System\n\n' +
        'Features:\n' +
        '- JWT Authentication\n' +
        '- User Wallet Management\n' +
        '- Monnify Payment Integration (Mocked)\n' +
        '- Call Session Tracking with REST-based Signaling\n' +
        '- Real-time call charging based on duration',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('wallets', 'Wallet operations')
    .addTag('payments', 'Payment processing')
    .addTag('calls', 'Call session management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'AIleana API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  });
}
