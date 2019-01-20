import { action } from 'typesafe-actions'
import { getDefaultProfile, setDefaultProfile } from '../localStorage'

import { ApplicationState, Dispatch } from '../reduxStore';
import { ProfileData, ProfileState } from '../reducers/profile';

export interface GetProfileResponse {
  data?: ProfileData
  characterId?: string
  loading: boolean
  error: any
}

const setProfileData = (value: ProfileState) => action('SET_PROFILE_DATA', value);

export const setProfile = (
  membershipType: number,
  membershipId: string,
  characterId?: string,
  data?: ProfileData,
  setAsDefaultProfile: boolean = false
) => {

  return (dispatch: Dispatch, getState: () => ApplicationState) => {
    let savedProfile = getDefaultProfile()
    if (setAsDefaultProfile || (savedProfile && savedProfile.membershipId === membershipId)) {
      setDefaultProfile({
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

    dispatch(setProfileData(value));
  }
};

export type ProfileActions = ReturnType<
  | typeof setProfileData
>