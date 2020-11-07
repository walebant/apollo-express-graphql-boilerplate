import { Schema, model, SchemaTypes } from 'mongoose';
import { tokenTypes } from '../config/tokens';

const TokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD],
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
  blacklisted: {
    type: Boolean,
    default: false,
  },
  tokens: {
    access: { token: { type: String }, expires: { type: String } },
    refresh: { token: { type: String }, expires: { type: String } },
  },
});
const Token = model('Token', TokenSchema);

export default Token;
