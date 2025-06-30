import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ username }).exec();
    if (user) return user.toObject();
    return undefined;
  }

  // async findOneAndUpdate(
  //   username: string,
  //   user: Partial<User>,
  // ): Promise<User | undefined> {
  //   const userUpdated = await this.userModel
  //     .findOneAndUpdate({ username }, user)
  //     .exec();
  //   if (userUpdated) return userUpdated.toObject();
  //   return undefined;
  // }

  // async findAll(query?: Record<string, any>): Promise<User[]> {
  //   return await this.userModel.find(query).sort({ createdAt: -1 }).exec();
  // }

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

