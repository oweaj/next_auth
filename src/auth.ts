import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import connectDB from './lib/db';
import { User } from './lib/schema';
import { compare } from 'bcryptjs';
import { userAgent } from 'next/server';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('auth.ts', credentials);
        const { email, password } = credentials;

        if (!email || !password) {
          throw new CredentialsSignin('입력한 부분을 다시 확인해주세요.');
        }

        connectDB();
        const user = await User.findOne({ email }).select('+password +role');
        if (!user) {
          throw new CredentialsSignin('가입되지 않은 회원입니다.');
        }

        // 사용자가 입력한 비번과 db 비번이 일치하는지 확인
        const isMatched = await compare(String(password), user.password);
        if (!isMatched) {
          throw new CredentialsSignin('비밀번호가 일치하지 않습니다.');
        }

        // 유효한 사용자이면
        return {
          name: user.name,
          email: user.email,
          role: user.role,
          id: user._id, // Mongodb에서 설정된 _id
        };
      },
    }),

    // github 소셜 로그인
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    signIn: async ({ user, account }) => {
      console.log('확인확인', user, account);
      if (account?.provider === 'github') {
        // 로직을 구현해야하니까 잠깐 멈추는 식으로 false
        const { name, email } = user;
        await connectDB();
        const existingUser = await User.findOne({ authProviderId: user.id });

        // 위에 id가 없다면 소셜 가입 ㄱ
        if (!existingUser) {
          await new User({
            name,
            email,
            authProviderId: user.id,
            role: 'user',
          }).save();
        }
        // 있다면 한번 user.id값을 조회해서 확인
        const socialUser = await User.findOne({ authProviderId: user.id });

        // user.role = socialUser?.role || 'user';
        user.id = socialUser?._id || null;

        return true;
      } else {
        // 크레덴셜 통과
        return true;
      }
    },

    async jwt({ token, user }: { token: any; user: any }) {
      console.log('jwt', token, user);

      if (user) {
        token.role = user.role; // jwt 토큰 사용자 권한추가
        token.id = user.id; // jwt 토큰 사용자 id추가
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (token?.role) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
});
