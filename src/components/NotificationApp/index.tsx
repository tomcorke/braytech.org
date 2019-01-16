import React from 'react';
import { withNamespaces, WithNamespaces } from 'react-i18next';

import './styles.css';

interface NotificationAppProps {
  updateAvailable: boolean
}

const NotificationApp = ({ t, updateAvailable }: NotificationAppProps & WithNamespaces) => {

  if (!updateAvailable) return null

  return (
    <div id='notification-app'>
      <div>
        <strong>{t('Update available')}</strong>
        <div>{t('An update is available. You can activate it by closing all instances of Braytech.')}</div>
      </div>
    </div>
  );

}

export default withNamespaces()(NotificationApp);
