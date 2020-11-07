import { Schema, model } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { roles } from '../config/roles';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
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
      access: { token: { type: String }, expires: { type: String } },
      refresh: { token: { type: String }, expires: { type: String } },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

const User = model('User', UserSchema);

export default User;
