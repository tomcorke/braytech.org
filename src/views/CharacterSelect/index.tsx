/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { withNamespaces, WithNamespaces } from 'react-i18next';
import { DestinyManifest } from 'bungie-api-ts/destiny2/interfaces';
import { searchDestinyPlayer as apiSearchDestinyPlayer } from 'bungie-api-ts/destiny2/api';
import { UserInfoCard } from 'bungie-api-ts/user/interfaces';
import { PlatformErrorCodes } from 'bungie-api-ts/common';
import { Location } from 'history';
import objectValues from 'lodash';

import { ProfileData, ProfileState } from '../../utils/reducers/profile';
import { ApplicationState, Dispatch } from '../../utils/reduxStore';
import { ThemeState } from '../../utils/reducers/theme';
import fetcher from '../../utils/fetcher';
import getProfile, { GetProfileResponse } from '../../utils/actions/getProfile';
import setProfile, { SetProfileActions } from '../../utils/actions/setProfile';
import Characters from '../../components/Characters';
import * as destinyEnums from '../../utils/destinyEnums';
import * as ls from '../../utils/localStorage';
import errorHandler from '../../utils/errorHandler';
import Spinner from '../../components/Spinner';
import { ViewportDimensions } from '../../App';

import './styles.css';

interface CharacterSelectProps {
  user: ProfileState
  theme: ThemeState
  location: Location
  viewport: ViewportDimensions

  getProfile: (membershipType: number, membershipId: string, characterId: string | undefined, callback: (response: GetProfileResponse) => any) => any
  setProfile: (membershipType: number, membershipId: string, characterId: string, data: ProfileData, setAsDefaultProfile: boolean) => any
}

interface CharacterSelectState {
  search: {
    results?: UserInfoCard[]
  }
  profile: {
    data?: ProfileData
  }
  error?: PlatformErrorCodes
  loading: boolean
}

interface ProfileHistoryItem {
  membershipType: number,
  membershipId: string,
  displayName: string
}

class CharacterSelect extends React.Component<CharacterSelectProps & WithNamespaces, CharacterSelectState> {

  inputTimeout?: number
  mounted: boolean

  constructor(props: CharacterSelectProps & WithNamespaces) {
    super(props);

    this.mounted = false;

    this.state = {
      search: {
        results: undefined
      },
      profile: {
        data: undefined
      },
      error: undefined,
      loading: true
    };
  }

  searchDestinyPlayer = (e: React.ChangeEvent<HTMLInputElement>) => {
    let membershipType = -1;
    let displayName = e.target.value;

    clearTimeout(this.inputTimeout);
    this.inputTimeout = window.setTimeout(async () => {

      try {
        const searchResponse = await apiSearchDestinyPlayer(fetcher, { membershipType, displayName })

        if (!this.mounted) return

        if (searchResponse.ErrorCode !== 1) {
          console.log(searchResponse);
          this.setState({
            error: searchResponse.ErrorCode
          });
          return;
        }
        this.setState({
          search: {
            results: searchResponse.Response
          },
          error: undefined
        });
      } catch (error) {
        console.error(error);
      }

    }, 1000);
  };

  characterClick = (characterId: string) => {
    if (!this.state.profile.data) return

    let membershipType = this.state.profile.data.profile.profile.data.userInfo.membershipType;
    let membershipId = this.state.profile.data.profile.profile.data.userInfo.membershipId;
    let data = this.state.profile.data;
    let setAsDefaultProfile = true;

    this.props.setProfile(membershipType, membershipId, characterId, data, setAsDefaultProfile);
  };

  getProfileCallback = (state: GetProfileResponse) => {
    if (!this.mounted) return
    this.setState(prev => ({
      search: { ...prev.search },
      profile: {
        data: state.data
      },
      error: state.error,
      loading: state.loading
    }));
  };

  resultClick = (membershipType: number, membershipId: string, displayName: string) => {
    window.scrollTo(0, 0);
    this.props.getProfile(membershipType, membershipId, undefined, this.getProfileCallback);

    if (displayName) {
      ls.update('history.profiles', { membershipType, membershipId, displayName }, true, 6);
    }
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    this.mounted = true;

    if (this.props.user.data) {
      this.setState({ profile: { data: this.props.user.data }, loading: false });
    } else if (this.props.user.membershipType && this.props.user.membershipId && !this.state.profile.data) {
      this.props.getProfile(this.props.user.membershipType, this.props.user.membershipId, this.props.user.characterId, this.getProfileCallback);
    } else {
      this.setState({ loading: false });
    }

  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t } = this.props;
    const profileHistory: ProfileHistoryItem[] = ls.get('history.profiles') ? ls.get('history.profiles') : [];
    let resultsElement = null;
    let profileElement = null;

    type StringMap = { [key: string]: string }

    if (this.state.search.results) {
      resultsElement = (
        <div className='results'>
          <ul className='list'>
            {this.state.search.results.length > 0 ? (
              this.state.search.results.map(result => (
                <li className='linked' key={result.membershipId}>
                  <a
                    onClick={e => {
                      this.resultClick(result.membershipType, result.membershipId, result.displayName);
                    }}
                  >
                    <span className={`destiny-platform_${(destinyEnums.PLATFORMS as StringMap)[result.membershipType].toLowerCase()}`} />
                    {result.displayName}
                  </a>
                </li>
              ))
            ) : (
              <li className='no-profiles'>{t('No profiles found')}</li>
            )}
          </ul>
        </div>
      );
    } else {
      resultsElement = <div className='results' />;
    }

    const { from } = this.props.location.state || { from: { pathname: '/' } };

    if (this.state.profile.data) {
      let clan = null;
      if (this.state.profile.data.groups.results.length === 1) {
        clan = <div className='clan'>{this.state.profile.data.groups.results[0].group.name}</div>;
      }

      const timePlayed = this.state.profile.data
        && (
          <div className='timePlayed'>
            {Math.floor(
              objectValues(this.state.profile.data.profile.characters.data).reduce((sum, characterData) => {
                return sum + parseInt(characterData.minutesPlayedTotal);
              }, 0) / 1440
            )}{' '}
            {t('days on the grind')}
          </div>
        );

      profileElement = (
        <>
          <div className='user'>
            <div className='info'>
              <div className='displayName'>{this.state.profile.data.profile.profile.data.userInfo.displayName}</div>
              {clan}
              {timePlayed}
            </div>
            <Characters from={from} characterClick={this.characterClick} />
          </div>
        </>
      );
    }

    let reverse = false;
    if (this.props.viewport.width <= 500) {
      reverse = true;
    }

    let errorNotices = null;
    if (this.state.error) {
      errorNotices = errorHandler(this.state.error);
    }

    return (
      <div className={cx('view', this.props.theme.selected, { loading: this.state.loading })} id='get-profile'>
        {reverse ? (
          <div className='profile'>
            {this.state.loading ? <Spinner dark /> : null}
            {profileElement}
          </div>
        ) : null}
        <div className='search'>
          {errorNotices}
          <div className='sub-header sub'>
            <div>{t('Search for player')}</div>
          </div>
          <div className='form'>
            <div className='field'>
              <input onChange={this.searchDestinyPlayer} type='text' placeholder={t('insert gamertag')} spellCheck={false} />
            </div>
          </div>
          <div className='results'>{resultsElement}</div>
          {profileHistory.length > 0 ? (
            <>
              <div className='sub-header sub'>
                <div>{t('Previous')}</div>
              </div>
              <div className='results'>
                <ul className='list'>
                  {profileHistory.map(result => (
                    <li className='linked' key={result.membershipId}>
                      <a
                        onClick={e => {
                          this.resultClick(result.membershipType, result.membershipId, result.displayName);
                        }}
                      >
                        <span className={`destiny-platform_${(destinyEnums.PLATFORMS as StringMap)[result.membershipType].toLowerCase()}`} />
                        {result.displayName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </div>
        {!reverse ? (
          <div className='profile'>
            {this.state.loading ? <Spinner dark /> : null}
            {profileElement}
          </div>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    user: state.profile,
    theme: state.theme,
    location: state.router.location
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    getProfile: (membershipType: number, membershipId: string, characterId: string | undefined, callback: (state: GetProfileResponse) => any) => dispatch(
      getProfile(membershipType, membershipId, characterId, callback)
    ),
    setProfile: (membershipType: number, membershipId: string, characterId: string, data: ProfileData, setAsDefaultProfile: boolean) => dispatch(
      setProfile(membershipType, membershipId, characterId, data, setAsDefaultProfile)
    ),
  }
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CharacterSelect)
);
