import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  firebaseUid: string;

  @Prop({ unique: true, sparse: true })
  username?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  avatar?: string;

  @Prop()
  bio?: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({ default: 0 })
  replyCount: number;

  @Prop({ type: Object, default: {} })
  socialLinks: Record<string, string>;

  @Prop({ type: Object, default: { notifications: true, isPublic: true } })
  settings: Record<string, boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);
