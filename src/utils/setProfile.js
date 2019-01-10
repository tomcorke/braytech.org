import { connect } from 'react-redux';

import * as ls from './localStorage';
import store from './reduxStore';

const setProfile = (membershipType, membershipId, characterId = false, data, setAsDefaultProfile = false) => {
  let savedProfile = ls.get('setting.profile') ? ls.get('setting.profile') : false;
  if (setAsDefaultProfile || (savedProfile && savedProfile.membershipId === membershipId)) {
    ls.set('setting.profile', {
      membershipType: membershipType,
      membershipId: membershipId,
      characterId: characterId
    });
  }

  console.log('setProfile', membershipType, membershipId, characterId, data, setAsDefaultProfile);

  // this.props.setProfile({
  //   membershipType: membershipType,
  //   membershipId: membershipId,
  //   characterId: characterId,
  //   data: data
  // });
  
  let value = {
    membershipType: membershipType,
    membershipId: membershipId,
    characterId: characterId,
    data: data
  }

  store.dispatch({ type: 'SET_PROFILE', payload: value });
};

export default setProfile;
