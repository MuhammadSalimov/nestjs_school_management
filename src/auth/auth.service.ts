import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/Login.dto';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { RegisterDto } from './dto/Register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly Jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        login: payload.login,
      },
    });
    if (!user) throw new UnauthorizedException();
    const isMatch = await compare(payload.password, user.password);
    if (!isMatch)
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    const refreshToken = await this.tokenService.generateToken({
      id: user.id,
      role: user.role,
    });
    const accessToken = this.Jwt.sign({ id: user.id, role: user.role });
    await this.tokenService.saveToken(user.id, refreshToken);
    return { user: user, refreshToken, accessToken };
  }

  async register(payload: RegisterDto) {
    const { login, password, picture, role } = payload;
    const findUser = await this.prisma.user.findUnique({
      where: {
        login: login,
      },
    });
    if (findUser) return { error: 'Addmission Number already  exist' };
    const hashPass = await hash(password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        login: payload.login,
        password: hashPass,
        picture: picture,
        role: role,
      },
    });
    return { user: newUser };
  }

  async logout(refreshToken: string) {
    const findToken = await this.prisma.tokenModel.findFirst({
      where: { refreshToken },
    });
    return await this.prisma.tokenModel.delete({
      where: {
        id: findToken.id,
      },
    });
  }

  async refresh(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }
    const userPayload = await this.tokenService.validateRefreshToken(token);
    const tokenDb = await this.tokenService.findToken(token);
    if (!userPayload || !tokenDb) {
      throw new UnauthorizedException();
    }
    const user = await this.prisma.user.findFirst({
      where: { id: userPayload.id },
    });
    const refreshToken = await this.tokenService.generateToken({
      id: user.id,
      role: user.role,
    });
    await this.tokenService.saveToken(user.id, refreshToken);
    const accessToken = await this.Jwt.sign({ id: user.id, role: user.role });
    return { user, accessToken, refreshToken };
  }
}
