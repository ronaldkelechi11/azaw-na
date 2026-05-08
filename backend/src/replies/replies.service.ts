import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reply, ReplyDocument } from './schemas/reply.schema';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UsersService } from '../users/users.service';
import { UploadsService } from '../uploads/uploads.service';
import * as crypto from 'crypto';

@Injectable()
export class RepliesService {
  constructor(
    @InjectModel(Reply.name) private replyModel: Model<ReplyDocument>,
    private usersService: UsersService,
    private uploadsService: UploadsService,
  ) {}

  private hashIp(ip: string): string {
    return crypto.createHash('sha256').update(ip).digest('hex');
  }

  async create(
    createReplyDto: CreateReplyDto,
    files: Express.Multer.File[],
    ip: string,
  ): Promise<ReplyDocument> {
    if (!createReplyDto.message && (!files || files.length === 0)) {
      throw new BadRequestException('Reply must contain either a message or images');
    }

    const recipient = await this.usersService.findOneBySlug(createReplyDto.recipientSlug);
    if (!recipient) {
      throw new NotFoundException('Recipient user not found');
    }

    const images: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await this.uploadsService.uploadImage(file, 'azawna_replies');
        images.push(uploadResult.secure_url);
      }
    }

    const senderIpHash = this.hashIp(ip);

    const newReply = new this.replyModel({
      recipientUser: recipient._id,
      message: createReplyDto.message,
      images,
      senderIpHash,
    });

    await newReply.save();

    // Increment user's reply count
    // Normally you'd want a transaction or just atomic update here
    await this.usersService.update(recipient.firebaseUid, {
      // @ts-ignore - dirty hack to update reply count directly since we didn't expose it in DTO
      $inc: { replyCount: 1 }
    } as any);

    return newReply;
  }

  async findAllForUser(firebaseUid: string, skip: number = 0, limit: number = 20): Promise<ReplyDocument[]> {
    const user = await this.usersService.findOneByFirebaseUid(firebaseUid);
    if (!user) throw new NotFoundException('User not found');

    return this.replyModel
      .find({ recipientUser: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async remove(firebaseUid: string, replyId: string): Promise<void> {
    const user = await this.usersService.findOneByFirebaseUid(firebaseUid);
    if (!user) throw new NotFoundException('User not found');

    const result = await this.replyModel.deleteOne({
      _id: new Types.ObjectId(replyId),
      recipientUser: user._id,
    }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Reply not found or you do not have permission to delete it');
    }

    // Decrement reply count safely, ignoring errors for this step
    try {
      await this.usersService.update(firebaseUid, { $inc: { replyCount: -1 } } as any);
    } catch (e) {}
  }
}
