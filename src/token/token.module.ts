import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        global: true,
        secret: await config.get('REFRESH_KEY'),
        signOptions: { expiresIn: '10d' },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
