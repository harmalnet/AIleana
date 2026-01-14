import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface AppleIdTokenPayload {
  iss: string; // https://appleid.apple.com
  aud: string; // Your app's bundle ID
  exp: number; // Expiration time
  iat: number; // Issued at
  sub: string; // User's unique Apple ID
  email?: string;
  email_verified?: boolean | string;
}

@Injectable()
export class AppleHelperService {
  private readonly clientId: string; // Your app's bundle ID (e.g., com.favvii.app)

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('APPLE_CLIENT_ID') || '';
  }

  /**
   * Decode Apple ID token received from mobile app
   * For mobile apps, the Apple SDK on iOS/Android has already validated the token
   * We just need to decode and extract the user information
   * This follows the same pattern as Google OAuth for mobile
   * 
   * @param idToken - The identity token from Apple Sign-In (pre-validated by Apple SDK)
   * @returns Decoded token payload with user information
   */
  decodeToken(idToken: string): AppleIdTokenPayload {
    try {
      // JWT tokens have 3 parts: header.payload.signature
      // We only need the payload (middle part) which contains user info
      const parts = idToken.split('.');

      if (parts.length !== 3) {
        throw new UnprocessableEntityException('Invalid Apple token format');
      }

      // Decode the base64-encoded payload
      const payload = parts[1];
      
      // Handle URL-safe base64 encoding
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = Buffer.from(base64, 'base64').toString('utf-8');
      const parsed = JSON.parse(decodedPayload) as AppleIdTokenPayload;

      // Basic validation
      if (!parsed.sub) {
        throw new UnprocessableEntityException(
          'Invalid Apple token: missing user identifier',
        );
      }

      if (parsed.iss !== 'https://appleid.apple.com') {
        throw new UnprocessableEntityException(
          'Invalid Apple token: incorrect issuer',
        );
      }

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (parsed.exp && parsed.exp < now) {
        throw new UnprocessableEntityException('Apple token has expired');
      }

      // Verify audience matches your app (optional but recommended)
      if (this.clientId && parsed.aud !== this.clientId) {
        throw new UnprocessableEntityException(
          'Invalid Apple token: audience mismatch',
        );
      }

      return parsed;
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw error;
      }

      throw new UnprocessableEntityException(
        `Failed to decode Apple identity token: ${error.message}`,
      );
    }
  }

  /**
   * Validate user object from Apple Sign-In
   * On first sign-in, Apple provides full user details
   * On subsequent sign-ins, only identityToken is provided
   */
  validateAppleUser(user?: {
    email?: string;
    name?: { firstName?: string; lastName?: string };
  }): {
    email?: string;
    firstName?: string;
    lastName?: string;
  } {
    return {
      email: user?.email,
      firstName: user?.name?.firstName,
      lastName: user?.name?.lastName,
    };
  }
}

export type { AppleIdTokenPayload };