import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';

interface IFileParam {
  fileName: string;
  fileType: string;
  body: Buffer;
}

@Injectable()
export class UploadService {
  client: S3Client;
  constructor(private readonly config: ConfigService) {
    this.client = new S3Client({
      endpoint: config.get('R2_ENDPOINT'),
      region: 'auto',
      credentials: {
        accessKeyId: config.get('R2_ACCESS_KEY'),
        secretAccessKey: config.get('R2_SECRET_KEY'),
      },
    });
  }
  async create(file: IFileParam) {
    const name = `${randomUUID()}${extname(file.fileName)}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.get('R2_BUCKET'),
        Key: name,
        ContentType: file.fileType,
        Body: file.body,
      }),
    );
    const link = `https://pub-ecf47731b4f94651afdc4f0d5e681642.r2.dev/${name}`;
    return { name, link };
  }
}
