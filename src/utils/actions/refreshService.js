import getProfile from './getProfile';
import setProfile from './setProfile';

const refreshService = (frequency, membershipType, membershipId) => {

  return (dispatch, getState) => {

    window.refreshActive = true;
    window.refreshTimer = setTimeout(() => {

      // just for the console.warn
      const state = getState();
      let time = new Date();
      console.warn("Refreshing profile data", time, state);

      dispatch(getProfile(state.profile.membershipType, state.profile.membershipId, state.profile.characterId, (callback) => {
        // console.log(callback);

        // get absolute most recent profile data, specifically characterId, in case user changes character during getProfile
        const state = getState();

        if (!callback.loading && callback.error) {
          if (callback.error === 'fetch') {
            // TO DO: error count - fail after 3
            // console.log(membershipType, membershipId, state.profile.characterId, callback.data);
            window.refreshActive = false;
            // setProfile with previous data - triggers componentDidUpdate in App.js to fire this service again
            setProfile(membershipType, membershipId, state.profile.characterId, callback.data);
          }
          return;
        }

        if (!callback.loading && state.profile.membershipId === membershipId) {
          window.refreshActive = false;
          // setProfile with new data - triggers componentDidUpdate in App.js to fire this service again
          dispatch(setProfile(membershipType, membershipId, state.profile.characterId, callback.data));
        } else {
          window.refreshTimer = false;
        }
      }));

    }, frequency);

  }
}

export const startRefreshService = (membershipType, membershipId) => {

  return (dispatch, getState) => {

    const state = getState();
    let frequency = state.refreshService.config.frequency * 1000;

    if (!window.refreshActive) {
      dispatch(refreshService(frequency, membershipType, membershipId));
    }

  }

}