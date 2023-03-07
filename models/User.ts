import mongoose, {Model, Schema} from 'mongoose';
import {TodoDocument} from "./Todo";

type UserType = UserDocument & mongoose.Document;

export interface UserDocument extends mongoose.Document {
    params: any; //?? not sure its ok
  _doc: any;
  name: string;
  email: string;
  password: string;
  age: number;
  user: UserDocument
}

export const schema: Schema<UserDocument> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const User: Model<UserType> = mongoose.model<UserDocument>('User', schema);
