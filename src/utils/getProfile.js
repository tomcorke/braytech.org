import assign from 'lodash/assign';
import globals from './globals';

import * as responseUtils from './responseUtils';

export async function fetchProfile(membershipType, membershipId) {
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
        'X-API-Key': globals.key.bungie
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

// TODO lol, this needs a better name
export async function fetchAndWhatever(membershipType, membershipId, stateCallback, queuedFetch) {
  stateCallback({
    response: false,
    queuedFetch: queuedFetch,
    loading: true,
    error: false
  });
  let response = await fetchProfile(membershipType, membershipId);

  if (response.profile.ErrorCode !== 1) {
    stateCallback({
      response: false,
      queuedFetch: false,
      loading: false,
      error: response.profile.ErrorCode
    });
    return;
  }

  if (!response.profile.Response.characterProgressions.data) {
    stateCallback({
      response: false,
      queuedFetch: false,
      loading: false,
      error: 'privacy'
    });
    return;
  }

  response = responseUtils.profileScrubber(response);
  
  stateCallback({
    response: response,
    queuedFetch: false,
    loading: false,
    error: false
  });
}
