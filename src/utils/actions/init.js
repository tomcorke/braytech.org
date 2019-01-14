import { matchPath } from 'react-router'
import getProfile from './getProfile'
import setProfile from './setProfile'

export const init = () => {
  return async (dispatch, getState) => {

    const state = getState();

    const accountPath = matchPath(state.router.location.pathname, { path: '/account/:id/:membershipType/:membershipId/:characterId' });

    if (accountPath) {
      dispatch(getProfile(accountPath.params.membershipType, accountPath.params.membershipId, accountPath.params.characterId, (state) => {
        if (state.data) {
          let membershipType = state.data.profile.profile.data.userInfo.membershipType;
          let membershipId = state.data.profile.profile.data.userInfo.membershipId;
          let data = state.data;
          let setAsDefaultProfile = false;
          dispatch(setProfile(membershipType, membershipId, accountPath.params.characterId, data, setAsDefaultProfile));
        }
      }));
    }

  };
}