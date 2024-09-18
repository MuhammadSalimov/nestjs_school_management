import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly Jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token =
        req.cookies?.refreshToken || req.headers.authorization?.split(' ')[1];
      if (!token)
        throw new HttpException(' Unauthorized ', HttpStatus.BAD_REQUEST);
      const secret = this.config.get<string>('REFRESH_KEY');
      const verify = await this.Jwt.verifyAsync(token, {
        secret: secret,
      });

      if (!verify) return false;
      const id = verify.id;
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) throw new UnauthorizedException();
      req.user = {
        id: user.id,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
