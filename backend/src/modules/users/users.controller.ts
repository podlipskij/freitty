import { Controller, Get } from '@nestjs/common';
import { AuthUser, SessionUser } from '../../common/decorators/session-user.decorator';
import { toUserProfile } from './users.mapper';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@SessionUser() authUser: AuthUser) {
    return toUserProfile(await this.usersService.findById(authUser.id));
  }
}
