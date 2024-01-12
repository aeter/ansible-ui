import { ButtonVariant } from '@patternfly/react-core';
import { PencilAltIcon, TrashIcon } from '@patternfly/react-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IPageAction, PageActionSelection, PageActionType } from '../../../../../framework';
import { CollectionVersionSearch } from '../../../collections/Collection';
import { PROTECTED_REPOSITORIES } from '../../../common/constants';
import { Repository, RepositoryVersion } from '../Repository';

export function useRepositoryActions() {
  const { t } = useTranslation();
  const actions = useMemo<IPageAction<Repository>[]>(
    () => [
      {
        icon: PencilAltIcon,
        isPinned: true,
        label: t('Edit repository'),
        onClick: () => {},
        selection: PageActionSelection.Single,
        type: PageActionType.Button,
        variant: ButtonVariant.primary,
      },
      {
        type: PageActionType.Seperator,
      },
      {
        label: t('Sync repository'),
        onClick: () => {},
        selection: PageActionSelection.Single,
        type: PageActionType.Button,
        isDisabled: (repo) => {
          return repo.remote
            ? undefined
            : t('There are no remotes associated with this repository');
        },
      },
      {
        label: t('Copy CLI configuration'),
        onClick: () => {},
        selection: PageActionSelection.Single,
        type: PageActionType.Button,
      },
      {
        icon: TrashIcon,
        label: t('Delete repository'),
        onClick: () => {},
        selection: PageActionSelection.Single,
        type: PageActionType.Button,
        isDanger: true,
        isDisabled: (repo) => {
          return PROTECTED_REPOSITORIES.includes(repo.name)
            ? t('Protected repository cannot be deleted')
            : undefined;
        },
      },
    ],
    [t]
  );

  return actions;
}

export function useCollectionVersionsActions() {
  const { t } = useTranslation();
  const actions = useMemo<IPageAction<CollectionVersionSearch>[]>(
    () => [
      {
        icon: TrashIcon,
        label: t('Delete'),
        onClick: () => {},
        selection: PageActionSelection.Single,
        type: PageActionType.Button,
        isDanger: true,
        isDisabled: (repo) => {
          return PROTECTED_REPOSITORIES.includes(repo.repository_version)
            ? t('Protected repository cannot be deleted')
            : undefined;
        },
      },
    ],
    [t]
  );

  return actions;
}

export function useVersionsActions() {
  const { t } = useTranslation();
  const actions = useMemo<IPageAction<RepositoryVersion>[]>(
    () => [
      {
        label: t('Revert to this version'),
        onClick: () => {},
        selection: PageActionSelection.Single,
        type: PageActionType.Button,
        isDisabled: (repo) => {
          // TODO current version
          return PROTECTED_REPOSITORIES.includes(repo?.number?.toString())
            ? t('Already the current version')
            : undefined;
        },
      },
    ],
    [t]
  );

  return actions;
}