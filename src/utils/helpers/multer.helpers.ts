import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as os from 'os';

export const fileUploadMiddleware = () =>
  UseInterceptors(
    FileInterceptor('file', {
      dest: os.tmpdir(), // Temporary directory for file uploads
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (can be adjusted as needed)
    }),
  );
