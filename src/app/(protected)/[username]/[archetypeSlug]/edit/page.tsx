import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { PageTitle, SectionHeader } from '@/components';
import { getArchetype } from '@/lib/dal';
import ArchetypeForm from '../../ArchetypeForm';
import PublicToggle from '../../PublicToggle';

const EditArchetypePage = async ({
  params,
}: {
  params: Promise<{ username: string; archetypeSlug: string }>;
}) => {
  const t = await getTranslations('editArchetype');
  const { username, archetypeSlug } = await params;

  const { archetype, isOwner } = await getArchetype({ ownerUsername: username, archetypeSlug });

  if (!isOwner) {
    notFound();
  }

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <ArchetypeForm
        mode="edit"
        username={username}
        archetypeId={archetype.id}
        archetypeSlug={archetype.slug}
        initialName={archetype.name}
        initialSlug={archetype.slug}
      />
      <SectionHeader>{t('visibility')}</SectionHeader>
      <PublicToggle archetypeId={archetype.id} initialIsPublic={archetype.isPublic} />
    </>
  );
};

export default EditArchetypePage;
