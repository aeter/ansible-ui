import { CubesIcon, ExclamationTriangleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { PageTable } from '../../../../framework';
import { usePersistentFilters } from '../../../common/PersistentFilters';
import { useOptions } from '../../../common/crud/useOptions';
import { awxAPI } from '../../common/api/awx-utils';
import { useAwxView } from '../../common/useAwxView';
import { ActionsResponse, OptionsResponse } from '../../interfaces/OptionsResponse';
import { Schedule } from '../../interfaces/Schedule';
import { scheduleResourceTypeOptions, useGetSchedulCreateUrl } from './hooks/scheduleHelpers';
import { useSchedulesActions } from './hooks/useSchedulesActions';
import { useSchedulesColumns } from './hooks/useSchedulesColumns';
import { useSchedulesFilter } from './hooks/useSchedulesFilter';
import { useScheduleToolbarActions } from './hooks/useSchedulesToolbarActions';
import { missingResources } from '../../resources/templates/hooks/useTemplateColumns';
import { JobTemplate } from '../../interfaces/JobTemplate';

export function SchedulesList(props: { sublistEndpoint?: string; url?: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ inventory_type?: string; id?: string; source_id?: string }>();
  const resourceId = params.source_id ?? params.id;

  const compParams = useOutletContext<{ template: JobTemplate }>();
  const isMissingResource: boolean = compParams?.template
    ? missingResources(compParams?.template)
    : false;

  const apiEndPoint: string | undefined = props.sublistEndpoint
    ? `${props.sublistEndpoint}/${resourceId}/schedules/`
    : undefined;

  const toolbarFilters = useSchedulesFilter({
    url: props.url ? props.url : apiEndPoint,
  });
  const tableColumns = useSchedulesColumns();
  const view = useAwxView<Schedule>({
    url: apiEndPoint ?? awxAPI`/schedules/`,
    toolbarFilters,
    tableColumns,
  });

  const resource_type = scheduleResourceTypeOptions.find((route) =>
    location.pathname.split('/').includes(route)
  );
  usePersistentFilters(resource_type ? `${resource_type}-schedules` : 'schedules');

  const { data } = useOptions<OptionsResponse<ActionsResponse>>(apiEndPoint ?? awxAPI`/schedules/`);
  const canCreateSchedule = Boolean(data && data.actions && data.actions['POST']);
  const createUrl = useGetSchedulCreateUrl(apiEndPoint);
  const toolbarActions = useScheduleToolbarActions(
    view.unselectItemsAndRefresh,
    apiEndPoint,
    isMissingResource
  );
  const rowActions = useSchedulesActions({
    onScheduleDeleteCompleted: view.unselectItemsAndRefresh,
    onScheduleToggleCompleted: view.updateItem,
    sublistEndpoint: apiEndPoint,
  });
  return (
    <PageTable<Schedule>
      id="awx-schedules-table"
      toolbarFilters={toolbarFilters}
      toolbarActions={toolbarActions}
      tableColumns={tableColumns}
      rowActions={rowActions}
      errorStateTitle={t('Error loading schedules')}
      emptyStateTitle={
        canCreateSchedule
          ? isMissingResource
            ? t('Resources are missing from this template.')
            : t('No schedules yet')
          : t('You do not have permission to create a schedule')
      }
      emptyStateDescription={
        canCreateSchedule
          ? isMissingResource
            ? undefined
            : t('Please create a schedule by using the button below.')
          : t(
              'Please contact your organization administrator if there is an issue with your access.'
            )
      }
      emptyStateNoDataIcon={
        canCreateSchedule ? (isMissingResource ? ExclamationTriangleIcon : undefined) : CubesIcon
      }
      emptyStateButtonIcon={<PlusCircleIcon />}
      emptyStateButtonText={
        canCreateSchedule && !isMissingResource ? t('Create schedule') : undefined
      }
      emptyStateButtonClick={
        canCreateSchedule && !isMissingResource ? () => navigate(createUrl) : undefined
      }
      {...view}
    />
  );
}
