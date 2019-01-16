import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { withNamespaces, WithNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { Location } from 'history';

import './styles.css';
import { ApplicationState } from '../../utils/reduxStore';

interface FooterProps {
  location: Location
}

const Footer = ({ t }: FooterProps & WithNamespaces) => {
  const darkPaths = ['/character-select'];
  if (location.pathname !== '/') {
    return (
      <div id='footer' className={cx({ dark: darkPaths.includes(location.pathname) })}>
        <div>
          <Link to='/pride' className='pride'>
            {t('Pride')}
          </Link>
          © 2018 Tom Chapman
        </div>
        <ul>
          <li>
            <Link to='/credits'>
              {t('Credits')}
            </Link>
          </li>
          <li>
            <a href='https://twitter.com/justrealmilk' target='_blank' rel='noopener noreferrer'>
              Twitter
            </a>
          </li>
          <li>
            <a href='https://discordapp.com/invite/Y68xDsG' target='_blank' rel='noopener noreferrer'>
              Discord
            </a>
          </li>
          <li>
            {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
            <a href='https://www.ko-fi.com/justrealmilk' target='_blank' rel='noopener noreferrer'>
              {t('Buy me a Ko-fi')} ❤️
            </a>
          </li>
        </ul>
      </div>
    );
  } else {
    return null;
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  location: state.router.location
})

export default withNamespaces()(
  connect(
    mapStateToProps
  )(Footer)
);
