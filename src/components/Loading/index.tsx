import React from 'react';
import { withNamespaces, WithNamespaces } from 'react-i18next';
import cx from 'classnames';
import { connect } from 'react-redux';

import { ApplicationState } from '../../utils/reduxStore'
import { AppStatusState } from '../../utils/reducers/appStatus'
import { ThemeState } from '../../utils/reducers/theme'

import packageJSON from '../../../package.json';

import './styles.css';

const LOADING_STATE: { [key: string]: string } = {
  error: 'Error. Please tweet justrealmilk!',
  checkManifest: 'Checking manifest',
  fetchManifest: 'Downloading manifest',
  setManifest: 'Storing manifest',
  else: 'Booting up'
};

interface LoadingProps {
  status: AppStatusState
  theme: ThemeState
}

const Loading = ({ t, status, theme }: LoadingProps & WithNamespaces) => {
  const message = status.code && LOADING_STATE[status.code] || LOADING_STATE.else;

  return (
    <div className={cx('view', theme)} id='loading'>
      <div className='logo-feature'>
        <div className='device'>
          <span className='destiny-clovis_bray_device' />
        </div>
      </div>
      <h4>Braytech {packageJSON.version}</h4>
      <div className='download'>{t(message)}</div>
    </div>
  );
}

const mapStateToProps = (state: ApplicationState) => ({
  status: state.appStatus,
  theme: state.theme,
});

export default withNamespaces()(
  connect(
    mapStateToProps
  )(Loading)
);