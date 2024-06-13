import { auth } from '@/auth';

export const getSesstion = async () => {
  const session = await auth();

  return session;
};
