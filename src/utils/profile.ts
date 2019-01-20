import { getProfile as getDestinyProfile, getPublicMilestones } from 'bungie-api-ts/destiny2/api'
import { getGroupsForMember } from 'bungie-api-ts/groupv2/api'

import { ProfileData } from './reducers/profile'
import fetcher from './fetcher';
import * as responseUtils from './responseUtils';

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

export const getProfile = async (
  membershipType: number,
  membershipId: string
) => {
  let data = await apiRequest(membershipType, membershipId);

  if (!data) {
    return;
  }

  if (data.profile.ErrorCode !== 1) {
    return;
  }

  if (!data.profile.Response.characterProgressions.data) {
    return;
  }

  const scrubbedData: ProfileData = {
    profile: responseUtils.profileScrubber(data.profile),
    milestones: data.milestones.Response,
    groups: responseUtils.groupScrubber(data.groups),
  }

  return scrubbedData;
}