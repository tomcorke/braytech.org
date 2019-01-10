
import store from './reduxStore';
import getProfile from './getProfile';
import setProfile from './setProfile';

const activate = () => {
  store.dispatch({ type: 'SET_REFRESH_STATE', payload: { active: true } });
}

const deactivate = () => {
  store.dispatch({ type: 'SET_REFRESH_STATE', payload: { active: false } });
}

const refreshService = (membershipType, membershipId, timer) => {

  const state = store.getState();

  activate();

  timer = setTimeout(() => {
    let time = new Date();
    console.warn("Refreshing profile data", time, state);

    getProfile(state.profile.membershipType, state.profile.membershipId, state.profile.characterId, (callback) => {
      // console.log(callback);

      if (!callback.loading && callback.error) {
        if (callback.error === 'fetch') {
          // TO DO: error count - fail after 3
          // console.log(membershipType, membershipId, state.profile.characterId, callback.data);
          deactivate();
          setProfile(membershipType, membershipId, state.profile.characterId, callback.data);
        }
        return;
      }

      if (!callback.loading && state.profile.membershipId === membershipId) {
        deactivate();
        setProfile(membershipType, membershipId, state.profile.characterId, callback.data);
      } else {
        timer = false;
        refreshService();
      }
    });
    
  }, 5000);
}

const service = (timer, callback, membershipType, membershipId) => {
  
  const state = store.getState();

  if (!timer && !state.refreshService.active) {
    refreshService(membershipType, membershipId, timer);
  }

}

export default service;