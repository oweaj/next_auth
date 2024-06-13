'use server';

import { redirect } from 'next/navigation';
import connectDB from './db';
import { User } from './schema';
import { hash } from 'bcryptjs';
import { signIn, signOut } from '@/auth';

// 회원가입
export const register = async (formData: FormData) => {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  if (!name || !email || !password) {
    console.log('입력한 부분을 다시 확인해주세요.');
  }

  connectDB();

  // 기존에 있는 회원인지 조회
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    console.log('이미 가입된 회원입니다.');
  }

  // 신규회원이면 DB에 넣기
  const hashedPassword = await hash(String(password), 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();
  redirect('/login');
};

// 로그인
export const login = async (formData: FormData) => {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    console.log('입련한 부분을 다시 확인해주세요.');
    return;
  }

  try {
    // auth.js 연동 => api/auth/signin
    console.log('try', email, password);
    await signIn('credentials', { redirect: false, callbackUrl: '/', email, password });
  } catch (error) {
    console.log(error);
  }
  redirect('/');
};

// github 로그인 방법
export const githubLogin = async () => {
  await signIn('github', { callbackUrl: '/' });
};

export const logout = async () => {
  await signOut();
};
