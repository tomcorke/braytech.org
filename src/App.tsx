import React from 'react';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import { Route, Redirect, Switch } from 'react-router-dom';
import { withNamespaces, WithNamespaces } from 'react-i18next';
import cx from 'classnames';

import './Core.css';
import './App.css';

import './utils/i18n';
import { getCurrentLanguage } from './utils/i18n'
import { isProfileRoute } from './utils/globals';
import GoogleAnalytics from './components/GoogleAnalytics';
import history from './history';

import Loading from './components/Loading';
import Header from './components/Header';
import Tooltip from './components/Tooltip';
import Footer from './components/Footer';
import NotificationApp from './components/NotificationApp';
import NotificationProgress from './components/NotificationProgress';
import RefreshService from './components/RefreshService';

import Index from './views/Index';
import CharacterSelect from './views/CharacterSelect';
import Clan from './views/Clan';
import Collections from './views/Collections';
import Triumphs from './views/Triumphs';
import Checklists from './views/Checklists';
import Account from './views/Account';
import Character from './views/Character';
import ThisWeek from './views/ThisWeek';
import Vendors from './views/Vendors';
import Settings from './views/Settings';
import Pride from './views/Pride';
import Credits from './views/Credits';
import Tools from './views/Tools';
import ClanBannerBuilder from './views/Tools/ClanBannerBuilder';

import { ApplicationState, Dispatch } from './utils/reduxStore';
import { getManifestContent } from './utils/actions/manifest';
import { ThemeState } from './utils/reducers/theme';
import { ProfileState } from './utils/reducers/profile';
import { Location } from 'history';

interface AppProps {
  theme: ThemeState
  profile: ProfileState
  location: Location
  statusCode?: string

  updateAvailable: boolean

  getManifestContent: (language: string) => any
}

export interface ViewportDimensions {
  width: number
  height: number
}

interface AppState {
  viewport: ViewportDimensions
}

class App extends React.Component<AppProps & WithNamespaces, AppState> {

  currentLanguage: string

  constructor(props: AppProps & WithNamespaces) {
    super(props);

    this.state = {
      viewport: this.getViewport()
    }

    this.currentLanguage = getCurrentLanguage();
  }

  getViewport(): ViewportDimensions {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  updateViewport() {
    this.setState({
      viewport: this.getViewport()
    });
  };


  componentDidMount() {
    this.updateViewport();
    window.addEventListener('resize', this.updateViewport);
    this.props.getManifestContent(this.currentLanguage);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateViewport);
  }

  render() {

    if (!(window as any).ga) {
      GoogleAnalytics.init();
    }

    let content = null;
    if (this.props.statusCode !== 'ready') {
      content = <Loading />;
    } else {
      if (this.props.profile.data && this.props.profile.characterId) {
        content = (
          <div className={cx('wrapper', this.props.theme.selected, { 'profile-route': isProfileRoute(this.props.location.pathname) })}>
            <NotificationApp updateAvailable={this.props.updateAvailable} />
            <NotificationProgress />
            <RefreshService />
            <GoogleAnalytics.RouteTracker />
            <div className='main'>
              <Header viewport={this.state.viewport} />
              <Switch>
                <Route path='/character-select' render={route => <CharacterSelect viewport={this.state.viewport} />} />
                <Route
                  path='/account'
                  render={() => (
                    <>
                      <Account />
                      <Tooltip />
                    </>
                  )}
                />
                <Route path='/clan/:view?/:subView?' exact render={route => <Clan view={route.match.params.view} subView={route.match.params.subView} />} />
                <Route path='/character' exact render={() => <Character viewport={this.state.viewport} />} />
                <Route path='/checklists' exact render={() => <Checklists viewport={this.state.viewport} />} />
                <Route
                  path='/collections/:primary?/:secondary?/:tertiary?/:quaternary?'
                  render={route => (
                    <>
                      <Collections {...route} />
                      <Tooltip />
                    </>
                  )}
                />
                <Route path='/triumphs/:primary?/:secondary?/:tertiary?/:quaternary?' render={route => <Triumphs {...route} />} />
                <Route
                  path='/this-week'
                  exact
                  render={() => (
                    <>
                      <ThisWeek />
                      <Tooltip />
                    </>
                  )}
                />
                <Route path='/vendors/:hash?' exact render={route => <Vendors vendorHash={route.match.params.hash} />} />
                <Route path='/settings' exact render={() => <Settings />} />
                <Route path='/pride' exact render={() => <Pride />} />
                <Route path='/credits' exact render={() => <Credits />} />
                <Route path='/tools' exact render={() => <Tools />} />
                <Route path='/tools/clan-banner-builder/:decalBackgroundColorId?/:decalColorId?/:decalId?/:gonfalonColorId?/:gonfalonDetailColorId?/:gonfalonDetailId?/:gonfalonId?/' exact render={route => <ClanBannerBuilder {...route} />} />
                <Route path='/' exact render={() => <Index />} />
              </Switch>
            </div>
            <Footer />
          </div>
        );
      } else {
        content = (
          <div className={cx('wrapper', this.props.theme.selected, { 'profile-route': isProfileRoute(location.pathname) })}>
            <NotificationApp updateAvailable={this.props.updateAvailable} />
            <GoogleAnalytics.RouteTracker />
            <div className='main'>
              <Header viewport={this.state.viewport} />
              <Switch>
                <Route path='/character-select' render={route => <CharacterSelect viewport={this.state.viewport} />} />
                <Route
                  path='/account'
                  render={route => (
                    <Redirect
                      to={{
                        pathname: '/character-select',
                        state: { from: route.location }
                      }}
                    />
                  )}
                />
                <Route
                  path='/clan/:view?/:subView?'
                  exact
                  render={route => (
                    <Redirect
                      to={{
                        pathname: '/character-select',
                        state: { from: route.location }
                      }}
                    />
                  )}
                />
                <Route
                  path='/character'
                  exact
                  render={route => (
                    <Redirect
                      to={{
                        pathname: '/character-select',
                        state: { from: route.location }
                      }}
                    />
                  )}
                />
                <Route
                  path='/checklists'
                  exact
                  render={route => (
                    <Redirect
                      to={{
                        pathname: '/character-select',
                        state: { from: route.location }
                      }}
                    />
                  )}
                />
                <Route
                  path='/collections/:primary?/:secondary?/:tertiary?/:quaternary?'
                  render={route => (
                    <Redirect
                      to={{
                        pathname: '/character-select',
                        state: { from: route.location }
                      }}
                    />
                  )}
                />
                <Route
                  path='/triumphs/:primary?/:secondary?/:tertiary?/:quaternary?'
                  render={route => (
                    <Redirect
                      to={{
                        pathname: '/character-select',
                        state: { from: route.location }
                      }}
                    />
                  )}
                />
                <Route
                  path='/this-week'
                  exact
                  render={route => (
                    <Redirect
                      to={{
                        pathname: '/character-select',
                        state: { from: route.location }
                      }}
                    />
                  )}
                />
                <Route path='/vendors/:hash?' exact render={route => <Vendors vendorHash={route.match.params.hash} />} />
                <Route path='/settings' exact render={() => <Settings />} />
                <Route path='/pride' exact render={() => <Pride />} />
                <Route path='/credits' exact render={() => <Credits />} />
                <Route path='/tools' exact render={() => <Tools />} />
                <Route path='/tools/clan-banner-builder/:decalBackgroundColorId?/:decalColorId?/:decalId?/:gonfalonColorId?/:gonfalonDetailColorId?/:gonfalonDetailId?/:gonfalonId?/' exact render={route => <ClanBannerBuilder {...route} />} />
                <Route path='/' render={() => <Index />} />
              </Switch>
            </div>
            <Footer />
          </div>
        );
      }
    }


    return (
      <ConnectedRouter history={history}>
        {content}
      </ConnectedRouter>
    )
  }

}

function mapStateToProps(state: ApplicationState) {
  return {
    profile: state.profile,
    theme: state.theme,
    refreshService: state.refreshService,
    location: state.router.location,
    statusCode: state.appStatus.code,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    getManifestContent: (language: string) => dispatch(getManifestContent(language))
  }
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App)
);
