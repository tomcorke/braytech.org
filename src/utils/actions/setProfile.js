import * as ls from '../localStorage';

const setProfile = (membershipType, membershipId, characterId = false, data, setAsDefaultProfile = false) => {
  return (dispatch, getState) => {
    let savedProfile = ls.get('setting.profile') ? ls.get('setting.profile') : false;
    if (setAsDefaultProfile || (savedProfile && savedProfile.membershipId === membershipId)) {
      ls.set('setting.profile', {
        membershipType: membershipType,
        membershipId: membershipId,
        characterId: characterId
      });
    }

    const state = getState();

    let value = {
      membershipType: membershipType,
      membershipId: membershipId,
      characterId: characterId,
      data: data,
      prevData: state.profile.data
    }

    dispatch({ type: 'SET_PROFILE', payload: value });
  }
};

export default setProfile;
