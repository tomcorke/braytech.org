import React from 'react';
import { connect } from 'react-redux';

import getProfile from '../../utils/actions/getProfile';
import setProfile from '../../utils/actions/setProfile';
import { ApplicationState } from '../../utils/reduxStore';
import { RefreshServiceState } from '../../utils/reducers/refreshService';
import { ProfileState } from '../../utils/reducers/profile';

const AUTO_REFRESH_INTERVAL = 20 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

interface RefreshServiceProps {
  refreshService: RefreshServiceState
  profile: ProfileState
}

class RefreshService extends React.Component<RefreshServiceProps> {

  running: boolean = false;
  lastActivityTimestamp: number = 0
  refreshAccountDataInterval: number = -1

  componentDidMount() {
    if (this.props.refreshService.config.enabled) {
      this.track();
      document.addEventListener('click', this.clickHandler);
      document.addEventListener('visibilitychange', this.visibilityHandler);

      this.startTimer();
    }
  }

  componentDidUpdate(prevProps: RefreshServiceProps) {
    if (prevProps.profile.data !== this.props.profile.data) {
      this.clearTimer();
      this.startTimer();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.clickHandler);
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.clearTimer();
  }

  render() {
    return null;
  }

  track() {
    this.lastActivityTimestamp = Date.now();
  }

  activeWithinTimespan(timespan: number) {
    return Date.now() - this.lastActivityTimestamp <= timespan;
  }

  startTimer() {
    // console.log('starting a timer');
    this.refreshAccountDataInterval = window.setTimeout(
      this.service,
      AUTO_REFRESH_INTERVAL
    );
  }

  clearTimer() {
    window.clearTimeout(this.refreshAccountDataInterval);
  }

  clickHandler = () => {
    this.track();
  };

  visibilityHandler = () => {
    if (document.hidden === false) {
      this.track();
      this.service();
    }
  };

  service = (membershipType = this.props.profile.membershipType, membershipId = this.props.profile.membershipId) => {

    if (!this.activeWithinTimespan(ONE_HOUR)) {
      return;
    }

    if (this.running) {
      console.warn('service was called though it was already running!');
      return;
    } else {
      this.running = true;
    }

    // just for the console.warn
    // let time = new Date();
    // console.log("refreshing profile data", time, this.props);

    if (!membershipType || !membershipId) return

    getProfile(membershipType, membershipId, this.props.profile.characterId, (callback) => {

      if (!callback.loading && callback.error) {
        if (callback.error === 'fetch') {
          // TO DO: error count - fail after 3
          // console.log(membershipType, membershipId, state.profile.characterId, callback.data);
          this.running = false;
          // setProfile with previous data - triggers componentDidUpdate in App.js to fire this service again
          setProfile(membershipType, membershipId, this.props.profile.characterId, callback.data);
        }
        return;
      }

      if (!callback.loading && this.props.profile.membershipId === membershipId) {
        this.running = false;
        // setProfile with new data - triggers componentDidUpdate in App.js to fire this service again
        setProfile(membershipType, membershipId, this.props.profile.characterId, callback.data);
      }
    });
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    profile: state.profile,
    refreshService: state.refreshService
  };
}

export default connect(mapStateToProps)(RefreshService);