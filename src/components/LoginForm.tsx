import { githubLogin, login } from '@/lib/action';

export default function LoginForm() {
  return (
    <>
      <form action={login}>
        <input type="email" name="email" placeholder="이메일을 입력해주세요" />
        <input type="password" name="password" placeholder="비밀번호를 입력해주세요" />
        <button>로그인</button>
      </form>
      <form action={githubLogin}>
        <button>GitHub Login</button>
      </form>
    </>
  );
}
