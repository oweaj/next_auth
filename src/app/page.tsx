import { getSesstion } from '@/lib/getSession';

export default async function Home() {
  // 로그인한 사용자의 정보
  const session = await getSesstion();

  return (
    <>
      <h1>Home Component</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  );
}
