import { redirect } from 'next/navigation';

const UserRootPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  redirect(`/${username}/events`);
};

export default UserRootPage;
