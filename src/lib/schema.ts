import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: false },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    authProviderId: { type: String }, // 소셜 로그인 할 때 사용. 이유는 소셜 로그인은 비번이 없기때문임
  },
  { timestamps: true }
);

export const User = mongoose.models?.User || mongoose.model('User', userSchema);
