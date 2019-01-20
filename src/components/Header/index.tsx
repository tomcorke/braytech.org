import React from 'react';
import { withNamespaces, WithNamespaces } from 'react-i18next';
import { connect } from 'react-redux'

import { isProfileRoute } from '../../utils/globals';

import './styles.css';

import HeaderStandard from '../HeaderStandard';
import HeaderProfile from '../HeaderProfile';
import { getAccountUrl } from '../../utils/urls';
import { ApplicationState } from '../../utils/reduxStore';
import { UserInfoCard } from 'bungie-api-ts/user/interfaces';
import { Location } from 'history';
import { ViewportDimensions } from '../../App';

interface HeaderProps {
  userInfo?: UserInfoCard
  characterId?: string
  location: Location
  viewport: ViewportDimensions
}

export interface ViewDefinition {
  name: string
  desc: string
  slug: string
  exact: boolean
  dev?: true
}

const Header = ({ t, userInfo, characterId, location, viewport }: HeaderProps & WithNamespaces) => {

  const accountUrl = getAccountUrl(userInfo, characterId);

  let views: ViewDefinition[] = [
    {
      name: t('Clan'),
      desc: t('Activity and statistics'),
      slug: '/clan',
      exact: false
    },
    {
      name: t('Collections'),
      desc: t('Items your Guardian has acquired'),
      slug: '/collections',
      exact: false
    },
    {
      name: t('Triumphs'),
      desc: t("Records of your Guardian's achievements"),
      slug: '/triumphs',
      exact: false
    },
    // {
    //   name: t('Character'),
    //   desc: t('Character (dev only)'),
    //   slug: '/character',
    //   exact: true,
    //   dev: true
    // },
    {
      name: t('Account'),
      desc: t("Bird's eye view of your overall progress"),
      slug: accountUrl,
      exact: true
    },
    {
      name: t('Checklists'),
      desc: t('Made a list, check it twice'),
      slug: '/checklists',
      exact: true
    },
    {
      name: t('This Week'),
      desc: t('Prestigious records and valued items up for grabs this week'),
      slug: '/this-week',
      exact: true
    },
    // {
    //   name: t('Vendors'),
    //   desc: t("Tracking what's in stock across the Jovians"),
    //   slug: '/vendors',
    //   exact: false
    // },
    {
      name: t('Tools'),
      desc: t('Assorted Destiny-related tools'),
      slug: '/tools',
      exact: true
    },
    {
      name: <span className='destiny-settings' />,
      desc: 'Theme, language, collectible display state',
      slug: '/settings',
      exact: true
    }
  ];

  views = process.env.NODE_ENV !== 'development' ? views.filter(view => !view.dev) : views;

  if (userInfo && characterId && isProfileRoute(location.pathname)) {
    return (
      <HeaderProfile
        viewport={viewport}
        views={views}
      />
    );
  } else {
    return (
      <HeaderStandard
        viewport={viewport}
        views={views}
        isIndex={location.pathname === '/' ? true : false}
      />
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  userInfo: state.profile.data && state.profile.data.profile.profile.data.userInfo,
  characterId: state.profile.characterId,
  location: state.router.location,
})

export default withNamespaces()(
  connect(
    mapStateToProps
  )(Header)
);
