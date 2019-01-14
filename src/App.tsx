import React from 'react';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import { Route, Redirect, Switch } from 'react-router-dom';
import { withNamespaces, WithNamespaces } from 'react-i18next';
import cx from 'classnames';
import assign from 'lodash/assign';
import { getDestinyManifest } from 'bungie-api-ts/destiny2/api'

import './Core.css';
import './App.css';

import './utils/i18n';
import { getCurrentLanguage } from './utils/i18n'
import { Globals, isProfileRoute } from './utils/globals';
import dexie from './utils/dexie';
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
import { HttpClient, HttpClientConfig } from 'bungie-api-ts/http';
import { DestinyManifest } from 'bungie-api-ts/destiny2/interfaces';
import { ServerResponse } from 'bungie-api-ts/common';

interface AppProps {
}

interface AppState {
  status: {
    code?: string
    detail?: string
  }
  manifest: {
    version?: string
    settings?: any
  }
  viewport?: {
    width: number
    height: number
  }
}

class App extends React.Component<AppProps & WithNamespaces, AppState> {

  currentLanguage: any
  availableLanguages: string[]

  constructor(props: AppProps & WithNamespaces) {
    super(props);

    this.state = {
      status: {
        code: undefined,
        detail: undefined
      },
      manifest: {
        version: undefined,
        settings: undefined
      }
    };

    this.currentLanguage = getCurrentLanguage();
    this.availableLanguages = [];
  }

  updateViewport = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.setState({
      viewport: {
        width,
        height
      }
    });
  };

  getVersionAndSettings = async () => {
    let state = this.state;
    state.status.code = 'checkManifest';
    this.setState(state);

    const fetcher: HttpClient = async (config: HttpClientConfig) => {
      const get = await fetch(config.url, {
        headers: {
          'X-API-Key': (Globals.key.bungie as string)
        }
      })
      return get.json()
    }

    const getManifest = getDestinyManifest(fetcher)
    const getSettings = fetcher({ url: 'https://www.bungie.net/Platform/Settings/', method: 'GET' })

    const [ manifestServerResponse, settingsServerResponse ]: [ServerResponse<DestinyManifest>, ServerResponse<any>] = await Promise.all([ getManifest, getSettings ]);

    const manifest = manifestServerResponse.Response;

    let availableLanguages = [];
    for (var i in manifest.jsonWorldContentPaths) {
      availableLanguages.push(i);
    }

    this.availableLanguages = availableLanguages;
    return {
      manifest,
      settings: settingsServerResponse.Response,
      version: manifest.jsonWorldContentPaths[this.currentLanguage]
    }
  };

  getManifest = async ({ settings, version }: { settings: any, version: string }) => {
    let state = this.state;

    state.status.code = 'fetchManifest';
    state.manifest.version = version;
    this.setState(state);

    const getManifestContent = async () => {
      const request = await fetch(`https://www.bungie.net${version}`);
      return request.json();
    };

    const manifestContent = await getManifestContent()

    state.status.code = 'setManifest';
    this.setState(state);

    await dexie.table('manifest').clear()

    await dexie.table('manifest').add({
      version: version,
      value: manifestContent
    });

    await dexie.table('manifest').toArray()

    const mergedManifestContent = {
      ...manifestContent,
      settings
    }

    state.status.code = 'ready';
    this.setState(state);
  };

  componentDidMount() {
    this.updateViewport();
    window.addEventListener('resize', this.updateViewport);

    dexie
      .table('manifest')
      .toArray()
      .then(manifest => {
        if (manifest.length > 0) {
          let state = this.state;
          state.manifest.version = manifest[0].version;
          this.setState(state);
        }
      })
      .then(() => {
        this.getVersionAndSettings()
          .then(version => {
            if (version !== this.state.manifest.version) {
              this.getManifest(version);
            } else {
              dexie
                .table('manifest')
                .toArray()
                .then(manifest => {
                  if (manifest.length > 0) {
                    this.manifest = manifest[0].value;
                    this.manifest.settings = this.bungieSettings;
                    let state = this.state;
                    state.status.code = 'ready';
                    this.setState(state);
                  } else {
                    let state = this.state;
                    state.status.code = 'error';
                    state.status.detail = 'Failure to access IndexedDB manifest';
                    this.setState(state);
                  }
                });
            }
          })
          .catch(error => {
            let state = this.state;
            state.status.code = 'error';
            state.status.detail = error;
            this.setState(state);
          });
      });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateViewport);
  }

  render() {
    if (!window.ga) {
      GoogleAnalytics.init();
    }

    let content = null;
    if (this.state.status.code !== 'ready') {
      content = <Loading state={this.state.status} theme={this.props.theme.selected} />;
    } else {
      if (this.props.profile.data && this.props.profile.characterId) {
        content = (
          <div className={cx('wrapper', this.props.theme.selected, { 'profile-route': isProfileRoute(this.props.router.location.pathname) })}>
            <NotificationApp updateAvailable={this.props.updateAvailable} />
            <NotificationProgress manifest={this.manifest} />
            <RefreshService {...this.props} />
            <GoogleAnalytics.RouteTracker />
            <div className='main'>
              <Header {...this.state} {...this.props} manifest={this.manifest} />
              <Switch>
                <Route path='/character-select' render={route => <CharacterSelect location={route.location} user={this.props.profile} viewport={this.state.viewport} manifest={this.manifest} />} />
                <Route
                  path='/account'
                  render={() => (
                    <>
                      <Account manifest={this.manifest} />
                      <Tooltip manifest={this.manifest} />
                    </>
                  )}
                />
                <Route path='/clan/:view?/:subView?' exact render={route => <Clan manifest={this.manifest} view={route.match.params.view} subView={route.match.params.subView} />} />
                <Route path='/character' exact render={() => <Character viewport={this.state.viewport} manifest={this.manifest} />} />
                <Route path='/checklists' exact render={() => <Checklists viewport={this.state.viewport} manifest={this.manifest} />} />
                <Route
                  path='/collections/:primary?/:secondary?/:tertiary?/:quaternary?'
                  render={route => (
                    <>
                      <Collections {...route} manifest={this.manifest} />
                      <Tooltip manifest={this.manifest} />
                    </>
                  )}
                />
                <Route path='/triumphs/:primary?/:secondary?/:tertiary?/:quaternary?' render={route => <Triumphs {...route} manifest={this.manifest} />} />
                <Route
                  path='/this-week'
                  exact
                  render={() => (
                    <>
                      <ThisWeek manifest={this.manifest} />
                      <Tooltip manifest={this.manifest} />
                    </>
                  )}
                />
                <Route path='/vendors/:hash?' exact render={route => <Vendors vendorHash={route.match.params.hash} manifest={this.manifest} />} />
                <Route path='/settings' exact render={() => <Settings manifest={this.manifest} availableLanguages={this.availableLanguages} />} />
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
          <div className={cx('wrapper', this.props.theme.selected, { 'profile-route': isProfileRoute(this.props.router.location.pathname) })}>
            <NotificationApp updateAvailable={this.props.updateAvailable} />
            <GoogleAnalytics.RouteTracker />
            <div className='main'>
              <Header {...this.state} {...this.props} manifest={this.manifest} />
              <Switch>
                <Route path='/character-select' render={route => <CharacterSelect location={route.location} user={this.props.profile} viewport={this.state.viewport} manifest={this.manifest} />} />
                <Route
                  path='/account'
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
                <Route path='/vendors/:hash?' exact render={route => <Vendors vendorHash={route.match.params.hash} manifest={this.manifest} />} />
                <Route path='/settings' exact render={() => <Settings manifest={this.manifest} availableLanguages={this.availableLanguages} />} />
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

function mapStateToProps(state: ApplicationState, ownProps) {
  return {
    profile: state.profile,
    theme: state.theme,
    refreshService: state.refreshService,
    router: state.router
  };
}

export default withNamespaces()(
  connect(
    mapStateToProps,
  )(App)
);
