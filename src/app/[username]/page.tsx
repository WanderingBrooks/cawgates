import { redirect } from 'next/navigation';

const UsernamePage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;

  redirect(`/${username}/events`);
};

export default UsernamePage;
