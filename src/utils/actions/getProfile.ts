import assign from 'lodash/assign';
import Globals from '../globals';
import * as _ from 'lodash';

import * as responseUtils from '../responseUtils';
import { getProfile as getDestinyProfile, getPublicMilestones } from 'bungie-api-ts/destiny2/api'
import { getGroupsForMember } from 'bungie-api-ts/groupv2/api'
import { HttpClient, HttpClientConfig } from 'bungie-api-ts/http';
import { ApplicationState } from '../reduxStore';

async function apiRequest(membershipType: number, membershipId: string) {

  const fetcher: HttpClient = async (config: HttpClientConfig) => {
    const url = (config.method === 'GET' && config.params && Object.keys(config.params).length > 0)
      ? `${config.url}?${_.entries(config.params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`).join('&')}`
      : config.url;
    const get = await fetch(url, {
      method: config.method,
      headers: {
        'X-API-Key': Globals.key.bungie || ''
      }
    })
    return get.json()
  }

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
  stateCallback?: (data: any) => void
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

    const scrubbedData = {
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