import assign from 'lodash/assign';
import Globals from './globals';

import * as responseUtils from './responseUtils';

async function apiRequest(membershipType, membershipId) {
  let requests = [
    {
      name: 'profile',
      path: `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=100,104,200,202,204,205,300,301,302,303,304,305,800,900`
    },
    {
      name: 'milestones',
      path: `https://www.bungie.net/Platform/Destiny2/Milestones/`
    },
    {
      name: 'groups',
      path: `https://www.bungie.net/Platform/GroupV2/User/${membershipType}/${membershipId}/0/1/`
    }
  ];

  let fetches = requests.map(async request => {
    const get = await fetch(request.path, {
      headers: {
        'X-API-Key': Globals.key.bungie
      }
    });
    const response = await get.json();
    let object = {};
    object[request.name] = response;
    return object;
  });

  try {
    const promises = await Promise.all(fetches);
    return assign(...promises);
  } catch (error) {
    console.log(error);
  }
}

export async function getProfile(membershipType, membershipId, stateCallback) {

  stateCallback({
    response: false,
    loading: true,
    error: false
  });

  let response = await apiRequest(membershipType, membershipId);

  if (response.profile.ErrorCode !== 1) {
    stateCallback({
      response: false,
      loading: false,
      error: response.profile.ErrorCode
    });
    return;
  }

  if (!response.profile.Response.characterProgressions.data) {
    stateCallback({
      response: false,
      loading: false,
      error: 'privacy'
    });
    return;
  }

  response = responseUtils.profileScrubber(response);
  
  stateCallback({
    response: response,
    loading: false,
    error: false
  });
}