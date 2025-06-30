import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

type User = {
  _id?: string;
  username: string;
  password: string;
  city?: string;
  status?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(username: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findOne(username);
      if (user && await bcrypt.compare(pass, user.password)) {
        const payload = { username: user.username, sub: user._id };
        const access_token = this.jwtService.sign(payload);
        const { password, ...result } = user;
        let res = {
          ...result,
          access_token,
        };
        return res;
      }
      throw new UnauthorizedException();
    } catch (error) {
      throw error;
    }
  }

  async register(user: User) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return this.usersService.create({ ...user, password: hashedPassword });
  }
}
