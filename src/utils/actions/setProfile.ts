import { action } from 'typesafe-actions'

import * as ls from '../localStorage';
import { ProfileState, ProfileData } from '../reducers/profile';
import { ApplicationState } from '../reduxStore';

const setProfileAction = (value: ProfileState) => action('SET_PROFILE', value);

const setProfile = (
  membershipType: number,
  membershipId: string,
  characterId?: string,
  data?: ProfileData,
  setAsDefaultProfile: boolean = false
) => {

  return (dispatch: any, getState: () => ApplicationState) => {
    let savedProfile = ls.get('setting.profile') ? ls.get('setting.profile') : false;
    if (setAsDefaultProfile || (savedProfile && savedProfile.membershipId === membershipId)) {
      ls.set('setting.profile', {
        membershipType: membershipType,
        membershipId: membershipId,
        characterId: characterId
      });
    }

    const state = getState();

    let value: ProfileState = {
      membershipType: membershipType,
      membershipId: membershipId,
      characterId: characterId,
      data: data,
      prevData: state.profile && state.profile.data
    }

    dispatch(setProfileAction(value));
  }
};

export type SetProfileActions = ReturnType<
  typeof setProfileAction
>

export default setProfile;
