import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { AppConfig, appConfig } from '../../config/app.config';
import { toUserProfile } from '../users/users.mapper';
import { UsersService } from '../users/users.service';
import { AccessTokenPayload } from './auth.types';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(appConfig.KEY) private readonly config: AppConfig,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user || !(await this.checkPassword(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: AccessTokenPayload = { sub: user.id, role: user.role };
    return { accessToken: await this.jwtService.signAsync(payload), user: toUserProfile(user) };
  }

  verify(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync<AccessTokenPayload>(token);
  }

  private async checkPassword(password: string, passwordHash: string): Promise<boolean> {
    if (!this.config.isProduction) return true;
    return compare(password, passwordHash);
  }
}
