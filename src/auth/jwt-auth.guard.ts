import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization }: any = request.headers;
    if (!authorization) {
      throw new UnauthorizedException('Please provide token');
    }
    try {
      const authToken = authorization.replace(/bearer/gim, '').trim();
      const payload = this.jwtService.verify(authToken, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.usersService.findOne(payload.username);
      if (!user) {
        throw new UnauthorizedException('Invalid token: user not found');
      }
      request.user = user._id;
      return true;
    } catch (error) {
      throw new ForbiddenException(error.message || 'Please sign In');
    }
  }
}