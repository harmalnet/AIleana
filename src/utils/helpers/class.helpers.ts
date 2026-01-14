import { IsNotEmpty, IsString } from 'class-validator';

// import type { ISocialMediaLink } from '@/domains/events/entities/event.entity';

export class SocialMediaLinkDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
