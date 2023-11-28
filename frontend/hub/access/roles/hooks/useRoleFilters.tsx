import { useMemo } from 'react';
import { IToolbarFilter, ToolbarFilterType } from '../../../../../framework';
import { useTranslation } from 'react-i18next';

export function useRoleFilters() {
  const { t } = useTranslation();

  const toolbarFilters = useMemo<IToolbarFilter[]>(
    () => [
      {
        key: 'name',
        label: t('Name'),
        type: ToolbarFilterType.Text,
        query: 'name__icontains',
        comparison: 'contains',
      },
    ],
    [t]
  );
  return toolbarFilters;
}