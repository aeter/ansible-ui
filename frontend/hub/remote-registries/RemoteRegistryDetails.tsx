import { DropdownPosition } from '@patternfly/react-core/deprecated';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  DateTimeCell,
  LoadingPage,
  PageActions,
  PageDetail,
  PageDetails,
  PageHeader,
  PageLayout,
  useGetPageUrl,
  usePageNavigate,
} from '../../../framework';
import { AwxError } from '../../awx/common/AwxError';
import { StatusCell } from '../../common/Status';
import { useGet } from '../../common/crud/useGet';
import { HubRoute } from '../HubRoutes';
import { hubAPI } from '../api/formatPath';
import { HubItemsResponse } from '../useHubView';
import { RemoteRegistry } from './RemoteRegistry';
import { useRemoteRegistryActions } from './hooks/useRemoteRegistryActions';

export function RemoteRegistryDetails() {
  const { t } = useTranslation();
  const pageNavigate = usePageNavigate();
  const getPageUrl = useGetPageUrl();
  const pageActions = useRemoteRegistryActions({
    onRemoteRegistryDeleted: () => pageNavigate(HubRoute.RemoteRegistries),
  });
  const params = useParams<{ id: string }>();
  const {
    data: remoteRegistryData,
    error: errorRemoteRegistry,
    refresh: refreshRemoteRegistry,
  } = useGet<HubItemsResponse<RemoteRegistry>>(
    hubAPI`/_ui/v1/execution-environments/registries/?name=${params.id || ''}`
  );

  if (errorRemoteRegistry) {
    return <AwxError error={errorRemoteRegistry} handleRefresh={refreshRemoteRegistry} />;
  }
  if (!remoteRegistryData) {
    return <LoadingPage breadcrumbs tabs />;
  }
  const remoteRegistry = remoteRegistryData?.data?.[0];
  return (
    <>
      <PageLayout>
        <PageHeader
          title={t('Remote registry details')}
          breadcrumbs={[
            { label: t('Remote registries'), to: getPageUrl(HubRoute.RemoteRegistries) },
            { label: t('Remote registry details') },
          ]}
          headerActions={
            <PageActions<RemoteRegistry>
              actions={pageActions}
              position={DropdownPosition.right}
              selectedItem={remoteRegistry}
            />
          }
        />
        <PageDetails>
          <PageDetail label={t('Name')}>{remoteRegistry?.name}</PageDetail>
          <PageDetail label={t('URL')}>{remoteRegistry?.url}</PageDetail>
          <PageDetail label={t('Sync status')}>
            {<StatusCell status={remoteRegistry?.last_sync_task?.state} />}
          </PageDetail>
          {remoteRegistry?.last_sync_task?.finished_at ? (
            <PageDetail label={t('Last sync')}>
              {<DateTimeCell format="since" value={remoteRegistry?.last_sync_task?.finished_at} />}
            </PageDetail>
          ) : null}
          <PageDetail label={t('Proxy URL')}>{remoteRegistry?.proxy_url}</PageDetail>
          <PageDetail label={t('TLS validation')}>
            {remoteRegistry?.tls_validation ? t('Enabled') : t('Disabled')}
          </PageDetail>
          <PageDetail label={t('Client certificate')}>
            {remoteRegistry?.client_cert ?? t('None')}
          </PageDetail>
          <PageDetail label={t('CA certificate')}>
            {remoteRegistry?.ca_cert ?? t('None')}
          </PageDetail>
          <PageDetail label={t('Download concurrency')}>
            {remoteRegistry?.download_concurrency?.toString() ?? t('None')}
          </PageDetail>
          <PageDetail label={t('Rate limit')}>{remoteRegistry?.rate_limit ?? t('None')}</PageDetail>
        </PageDetails>
      </PageLayout>
    </>
  );
}