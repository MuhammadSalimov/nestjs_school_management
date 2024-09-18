import {
  Controller,
  Post,
  Body,
  Request,
  Response,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/Register.dto';
import { ILogout } from '../interfaces';
import { Response as Res } from 'express';
import { AuthGuard } from './auth.guard';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginDto, @Response() res: Res) {
    const { login, password } = payload;
    const data = await this.authService.login({ login, password });
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.json(data);
  }

  async register(payload: RegisterDto) {
    const data = await this.authService.register(payload);
    return data;
  }

  @Post('logout')
  async logout(@Request() req: ILogout, @Response() res: Res) {
    const { refreshToken } = req.cookies;
    const token = await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.json(token);
  }

  @UseGuards(AuthGuard)
  @Get('refresh')
  async refresh(@Request() req: ILogout, @Response() res: Res) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const data = await this.authService.refresh(refreshToken);
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json(data);
  }
}
