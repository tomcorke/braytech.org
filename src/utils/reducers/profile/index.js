import * as ls from '../../localStorage';

const savedProfile = ls.get('setting.profile') ? ls.get('setting.profile') : false;
const defaultState = {
  membershipType: savedProfile ? savedProfile.membershipType : false,
  membershipId: savedProfile ? savedProfile.membershipId : false,
  characterId: false,
  data: false,
  prevData: false
}

export default function profileReducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return action.payload
    default:
      return state
  }
}