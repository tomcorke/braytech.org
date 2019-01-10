
import store from './reduxStore';
import getProfile from './getProfile';
import setProfile from './setProfile';

const refreshService = (frequency, membershipType, membershipId) => {

  window.refreshActive = true;
  window.refreshTimer = setTimeout(() => {

    const state = store.getState();
    let time = new Date();
    console.warn("Refreshing profile data", time, state);

    getProfile(state.profile.membershipType, state.profile.membershipId, state.profile.characterId, (callback) => {
      // console.log(callback);

      const state = store.getState();

      if (!callback.loading && callback.error) {
        if (callback.error === 'fetch') {
          // TO DO: error count - fail after 3
          // console.log(membershipType, membershipId, state.profile.characterId, callback.data);
          window.refreshActive = false;
          setProfile(membershipType, membershipId, state.profile.characterId, callback.data);
        }
        return;
      }

      if (!callback.loading && state.profile.membershipId === membershipId) {
        window.refreshActive = false;
        setProfile(membershipType, membershipId, state.profile.characterId, callback.data);
      } else {
        window.refreshTimer = false;
        //refreshService();
      }
    });
    
  }, frequency);
}

const service = (membershipType, membershipId) => {
  
  const state = store.getState();
  let frequency = state.refreshService.config.frequency * 1000;

  if (!window.refreshActive) {
    refreshService(frequency, membershipType, membershipId);
  }

}

export default service;