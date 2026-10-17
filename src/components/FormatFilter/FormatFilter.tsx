'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Select from '../Select';
import classes from './formatFilter.module.css';

type FormatFilterProps = {
  username: string;
  formats: { id: string; name: string }[];
  selectedFormatId: string;
};

// Switches to another format's page. The deck filter is dropped, since
// every deck belongs to a single format.
const FormatFilter = ({
  username,
  formats,
  selectedFormatId,
}: FormatFilterProps) => {
  const t = useTranslations('formatFilter');
  const router = useRouter();

  const options = formats.map(format => ({
    value: format.id,
    label: format.name,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/${username}/matchups/${e.target.value}`);
  };

  return (
    <div className={classes.formatFilter}>
      <Select
        id="formatFilter"
        label={t('label')}
        options={options}
        value={selectedFormatId}
        onChange={handleChange}
      />
    </div>
  );
};

export default FormatFilter;
