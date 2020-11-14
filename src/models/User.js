import { Schema, model } from 'mongoose';
import { roles } from '../config/roles';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      // required: true,
      trim: true,
    },
    username: {
      type: String,
      // required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      private: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    tokens: {
      access: { type: String },
      refresh: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const User = model('User', UserSchema);

export default User;
