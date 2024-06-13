import { register } from '@/lib/action';

export default function RegisterForm() {
  return (
    <>
      <form action={register}>
        <input type="text" name="name" placeholder="이름을 입력해주세요" />
        <input type="email" name="email" placeholder="이메일을 입력해주세요" />
        <input type="password" name="password" placeholder="비밀번호를 입력해주세요" />
        <button>회원가입</button>
      </form>
    </>
  );
}
