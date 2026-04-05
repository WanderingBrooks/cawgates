import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';
import Card from '@/components/Card/Card';
import { Button, CardTitle } from '@/components';
import Link from 'next/link';

const UsernameLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const currentUser = await getUser();

  // I think this is breaking a AGENTS.md rule and should
  // be moved to DAL.
  const owner = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!owner) {
    notFound();
  }

  return (
    <>
      {(!currentUser || currentUser.userId !== owner.id) && (
        <Card>
          <CardTitle verticalAlignment="center">
            You are viewing {username}'s profile.
            {currentUser ? (
              <Link href={`/${currentUser.username}`}>
                <Button variant="secondary">
                  Click here to go to your profile.
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="secondary">
                  Click here to login or register and start tracking your
                  matches.
                </Button>
              </Link>
            )}
          </CardTitle>
        </Card>
      )}
      {children}
    </>
  );
};

export default UsernameLayout;
