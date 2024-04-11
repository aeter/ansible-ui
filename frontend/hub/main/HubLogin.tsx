import { Page } from '@patternfly/react-core';
import { LoadingState } from '../../../framework/components/LoadingState';
import { Login } from '../../common/Login';
import { useHubActiveUser } from '../../hub/common/useHubActiveUser';
import { hubAPI } from '../common/api/formatPath';
import { HubContextProvider } from '../common/useHubContext';

export function HubLogin(props: { children: React.ReactNode }) {
  const { activeHubUser, refreshActiveHubUser, activeHubUserIsLoading } = useHubActiveUser();

  if (activeHubUserIsLoading) {
    return (
      <Page>
        <LoadingState />
      </Page>
    );
  }

  if (!activeHubUser) {
    return (
      <Login apiUrl={hubAPI`/_ui/v1/auth/login/`} onSuccess={() => refreshActiveHubUser?.()} />
    );
  }

  return <HubContextProvider>{props.children}</HubContextProvider>;
}