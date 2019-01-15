import { getProfile as getDestinyProfile, getPublicMilestones } from 'bungie-api-ts/destiny2/api'
import { getGroupsForMember } from 'bungie-api-ts/groupv2/api'
import { DestinyProfileResponse,  DestinyPublicMilestone } from 'bungie-api-ts/destiny2/interfaces';
import { GroupMembershipSearchResponse } from 'bungie-api-ts/groupv2/interfaces';

import fetcher from '../fetcher';
import * as responseUtils from '../responseUtils';
import { ApplicationState } from '../reduxStore';
import { ProfileState, ProfileData } from '../reducers/profile';

export interface GetProfileResponse {
  data?: ProfileData
  characterId?: string
  loading: boolean
  error: any
}

async function apiRequest(membershipType: number, membershipId: string) {

  const [profile, milestones, groups] = await Promise.all([
    getDestinyProfile(fetcher,
      {
        membershipType,
        destinyMembershipId: membershipId,
        components: [
          100, 104, 200, 202, 204, 205, 300, 301, 302, 303, 304, 305, 800, 900
        ]
      }
    ),
    getPublicMilestones(fetcher),
    // create-react-app does not support enums in typescript
    // filter: 0 = GroupsForMemberFilter.All
    // groupType 1 = GroupType.Clan
    getGroupsForMember(fetcher, { membershipType, membershipId, filter: 0, groupType: 1 })
  ])

  return {
    profile,
    milestones,
    groups,
  }
}

function getProfile(
  membershipType: number,
  membershipId: string,
  characterId?: string,
  stateCallback?: (data: GetProfileResponse) => void
) {

  return async (dispatch: unknown, getState: () => ApplicationState) => {
    const state = getState();

    stateCallback && stateCallback({
      data: state.profile && state.profile.data,
      characterId: characterId,
      loading: true,
      error: false
    });

    let data = await apiRequest(membershipType, membershipId);

    if (!data) {
      stateCallback && stateCallback({
        data: state.profile && state.profile.data,
        characterId: characterId,
        loading: false,
        error: 'fetch'
      });
      return;
    }

    if (data.profile.ErrorCode !== 1) {
      stateCallback && stateCallback({
        data: state.profile && state.profile.data,
        characterId: characterId,
        loading: false,
        error: data.profile.ErrorCode
      });
      return;
    }

    if (!data.profile.Response.characterProgressions.data) {
      stateCallback && stateCallback({
        data: state.profile && state.profile.data,
        characterId: characterId,
        loading: false,
        error: 'privacy'
      });
      return;
    }

    const scrubbedData: ProfileData = {
      profile: responseUtils.profileScrubber(data.profile),
      milestones: data.milestones.Response,
      groups: responseUtils.groupScrubber(data.groups),
    }

    stateCallback && stateCallback({
      data: scrubbedData,
      characterId: characterId,
      loading: false,
      error: false
    });

  }
}

export default getProfile;