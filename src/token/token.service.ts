import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly Jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async saveToken(userId: string, refreshToken: string) {
    const existToken = await this.prisma.tokenModel.findFirst({
      where: { userId },
    });

    if (existToken) {
      const newData = await this.prisma.tokenModel.update({
        where: {
          id: existToken.id,
        },
        data: { refreshToken: refreshToken },
      });
      return newData;
    }
    const token = await this.prisma.tokenModel.create({
      data: { userId: userId, refreshToken },
    });
    return token;
  }

  async generateToken(payload: { id: string; role: string }) {
    const refreshToken = await this.Jwt.sign(payload);
    return refreshToken;
  }

  async validateRefreshToken(token: string) {
    try {
      return this.Jwt.verify(token);
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    return await this.prisma.tokenModel.findFirst({
      where: {
        refreshToken,
      },
    });
  }
}
