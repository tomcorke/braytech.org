/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { withNamespaces } from 'react-i18next';

import getProfile from '../../utils/actions/getProfile';
import setProfile from '../../utils/actions/setProfile';
import Characters from '../../components/Characters';
import Globals from '../../utils/globals';
import * as destinyEnums from '../../utils/destinyEnums';
import * as ls from '../../utils/localStorage';
import errorHandler from '../../utils/errorHandler';
import Spinner from '../../components/Spinner';

import './styles.css';

class CharacterSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: {
        results: false
      },
      profile: {
        data: false
      },
      error: false,
      loading: true
    };
  }

  searchDestinyPlayer = e => {
    let membershipType = '-1';
    let displayName = e.target.value;

    clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(() => {
      fetch(`https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${membershipType}/${encodeURIComponent(displayName)}/`, {
        headers: {
          'X-API-Key': Globals.key.bungie
        }
      })
        .then(response => {
          return response.json();
        })
        .then(SearchResponse => {
          if (SearchResponse.ErrorCode !== 1) {
            console.log(SearchResponse);
            this.setState({ error: SearchResponse.ErrorCode });
            return;
          }
          this.setState({
            search: {
              results: SearchResponse.Response
            },
            error: false
          });
        })
        .catch(error => {
          console.log(error);
        });
    }, 1000);
  };

  characterClick = characterId => {

    let membershipType = this.state.profile.data.profile.profile.data.userInfo.membershipType;
    let membershipId = this.state.profile.data.profile.profile.data.userInfo.membershipId;
    let data = this.state.profile.data;
    let setAsDefaultProfile = true;

    this.props.setProfile(membershipType, membershipId, characterId, data, setAsDefaultProfile);
  };

  getProfileCallback = state => {
    this.setState(prev => ({
      search: { ...prev.search },
      profile: {
        data: state.data
      },
      error: state.error,
      loading: state.loading
    }));
  };

  resultClick = (membershipType, membershipId, displayName) => {
    window.scrollTo(0, 0);
    this.props.getProfile(membershipType, membershipId, false, this.getProfileCallback);

    if (displayName) {
      ls.update('history.profiles', { membershipType: membershipType, membershipId: membershipId, displayName: displayName }, true, 6);
    }
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    if (this.props.user.data) {
      this.setState({ profile: { data: this.props.user.data }, loading: false });
    } else if (this.props.user.membershipId && !this.state.profile.data) {
      this.props.getProfile(this.props.user.membershipType, this.props.user.membershipId, this.props.user.characterId, this.getProfileCallback);
    } else {
      this.setState({ loading: false });
    }

  }

  render() {
    const { t } = this.props;
    let profileHistory = ls.get('history.profiles') ? ls.get('history.profiles') : [];
    let resultsElement = null;
    let profileElement = null;

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
                    <span className={`destiny-platform_${destinyEnums.PLATFORMS[result.membershipType].toLowerCase()}`} />
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

      let timePlayed = (
        <div className='timePlayed'>
          {Math.floor(
            Object.keys(this.state.profile.data.profile.characters.data).reduce((sum, key) => {
              return sum + parseInt(this.state.profile.data.profile.characters.data[key].minutesPlayedTotal);
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
            <Characters data={this.state.profile.data} manifest={this.props.manifest} location={{ ...from }} characterClick={this.characterClick} />
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
              <input onInput={this.searchDestinyPlayer} type='text' placeholder={t('insert gamertag')} spellCheck='false' />
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
                        <span className={`destiny-platform_${destinyEnums.PLATFORMS[result.membershipType].toLowerCase()}`} />
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

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    theme: state.theme,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getProfile: (membershipType, membershipId, characterId, callback) => dispatch(
      getProfile(membershipType, membershipId, characterId, callback)
    ),
    setProfile: (membershipType, membershipId, characterId, data, setAsDefaultProfile) => dispatch(
      setProfile(membershipType, membershipId, characterId, data, setAsDefaultProfile)
    ),
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withNamespaces()
)(CharacterSelect);
