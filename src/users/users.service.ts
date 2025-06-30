import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user.toObject();
  }

  async create(
    user: CreateUserDto,
  ): Promise<{ response: string }> {
    try {
      const newUser = new this.userModel({
        username: user.username,
        password: user.password,
        city: user.city,
        status: user.status || 'active',
      });
      await newUser.save();
      return {
        response: 'user created successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Error creating user', error.message);
    }
    
  }
}

