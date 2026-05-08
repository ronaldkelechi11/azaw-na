import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneByFirebaseUid(firebaseUid: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ firebaseUid }).exec();
  }

  async findOneBySlug(slug: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ slug }).exec();
  }

  async create(firebaseUid: string, email: string): Promise<UserDocument> {
    const existingUser = await this.findOneByFirebaseUid(firebaseUid);
    if (existingUser) {
      return existingUser;
    }

    const slug = randomBytes(4).toString('hex');
    const newUser = new this.userModel({
      firebaseUid,
      email,
      slug,
      username: `user_${slug}`,
    });

    return newUser.save();
  }

  async update(firebaseUid: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    if (updateUserDto.username) {
      const existingUsername = await this.userModel.findOne({ username: updateUserDto.username, firebaseUid: { $ne: firebaseUid } });
      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    const updatedUser = await this.userModel.findOneAndUpdate(
      { firebaseUid },
      { $set: updateUserDto },
      { new: true },
    ).exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }
}
