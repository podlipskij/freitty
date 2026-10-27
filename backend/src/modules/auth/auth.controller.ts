import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Res } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { AuthConfig, authConfig } from '../../config/auth.config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(authConfig.KEY) private readonly config: AuthConfig,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { accessToken, user } = await this.authService.login(dto);
    response.cookie(this.config.cookieName, accessToken, {
      ...this.cookieOptions(),
      maxAge: this.config.tokenTtlSeconds * 1000,
    });
    return user;
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(this.config.cookieName, this.cookieOptions());
  }

  private cookieOptions(): CookieOptions {
    return { httpOnly: true, sameSite: 'lax', secure: this.config.cookieSecure, path: '/' };
  }
}
