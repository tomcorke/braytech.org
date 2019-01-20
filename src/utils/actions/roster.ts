import { getProfile } from 'bungie-api-ts/destiny2/api'
import { DestinyProfileResponse, DestinyCharacterComponent } from 'bungie-api-ts/destiny2/interfaces';
import { GroupMember } from 'bungie-api-ts/groupv2/interfaces';
import { getMembersOfGroup } from 'bungie-api-ts/groupv2/api';
import { ServerResponse } from 'bungie-api-ts/common';

import { action } from 'typesafe-actions'

import { Dispatch } from '../reduxStore'
import fetcher from '../fetcher'

const fetchGroup = async (groupId: string): Promise<GroupMember[]> => {
  const response = await getMembersOfGroup(fetcher, { groupId, currentpage: 1 })
  return response.Response.results
};

interface FetchMemberProfileOptions {
  mini?: boolean
}

const fetchMemberProfile = async (member: GroupMember, options: FetchMemberProfileOptions = {}): Promise<ServerResponse<DestinyProfileResponse>> => {
  const fetchComponentsList = options.mini
    ? [100, 200, 204]
    : [100, 200, 202, 204, 900]

  const fetchProfile = await getProfile(fetcher, {
    membershipType: member.destinyUserInfo.membershipType,
    destinyMembershipId: member.destinyUserInfo.membershipId,
    components: fetchComponentsList
  })

  return fetchProfile
};

export const clearClanRoster = () =>
  action('CLEAR_CLAN_ROSTER')

export const setClanRosterMembers = (groupMembers: GroupMember[]) =>
  action('SET_CLAN_ROSTER_MEMBERS', groupMembers);

export const setClanRosterMemberProfile = (groupMember: GroupMember, profile: DestinyProfileResponse) =>
  action('SET_CLAN_ROSTER_MEMBER_PROFILE', {
    groupMember,
    profile
  });

// Prevent duplicated fetches for the same member profile by recording which we're currently fetching
const activeMemberFetchers = new Set<string>()

const getMembershipString = (member: GroupMember) => `${member.destinyUserInfo.membershipType}/${member.destinyUserInfo.membershipId}`

interface UpdateClanRosterOptions {
  mini?: boolean
}

export const updateClanRoster = (clanId: string, options: UpdateClanRosterOptions = {}) => {
  return async (dispatch: Dispatch) => {
    const groupMembers = await fetchGroup(clanId);
    dispatch(setClanRosterMembers(groupMembers))

    groupMembers.forEach(async groupMember => {
      const membershipString = getMembershipString(groupMember)
      if (!activeMemberFetchers.has(membershipString)) {
        activeMemberFetchers.add(membershipString)

        try {
          const memberResponse = await fetchMemberProfile(groupMember, options)
          dispatch(setClanRosterMemberProfile(groupMember, memberResponse.Response));
        } catch (error) {
          console.error(error)
        }

        activeMemberFetchers.delete(membershipString)
      }

    })

  }
}

export const enableClanRosterRefresh = () => {}

export const disableClanRosterRefresh = () => {}

export type RosterActions = ReturnType<
  | typeof clearClanRoster
  | typeof setClanRosterMembers
  | typeof setClanRosterMemberProfile
>