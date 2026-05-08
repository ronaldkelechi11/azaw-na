import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReplyDocument = HydratedDocument<Reply>;

@Schema({ timestamps: true })
export class Reply {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  recipientUser: Types.ObjectId;

  @Prop()
  message?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true })
  senderIpHash: string; // Used for basic rate-limiting/spam protection, should be hashed

  @Prop({ type: Object, default: {} })
  reactions: Record<string, number>;

  @Prop({ default: false })
  isReported: boolean;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
