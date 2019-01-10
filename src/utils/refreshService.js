
import store from './reduxStore';
import getProfile from './getProfile';
import setProfile from './setProfile';

const activate = () => {
  store.dispatch({ type: 'SET_REFRESH_STATE', payload: { active: true } });
}

const deactivate = () => {
  store.dispatch({ type: 'SET_REFRESH_STATE', payload: { active: false } });
}

const refreshService = (membershipType, membershipId) => {
  const state = store.getState();

  window.refreshTimer = setTimeout(() => {
    let time = new Date();
    console.warn("Refreshing profile data", time, state);

    getProfile(state.profile.membershipType, state.profile.membershipId, state.profile.characterId, (callback) => {
      // console.log(callback);

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
        refreshService();
      }
    });
    
  }, 5000);
}

const service = (membershipType, membershipId) => {
  
  const state = store.getState();

  if (!window.refreshActive) {
    refreshService(membershipType, membershipId);
  }

}

export default service;