
import entities from 'entities';
import { DestinyProfileResponse, DestinyCharacterComponent } from 'bungie-api-ts/destiny2/interfaces';
import { ServerResponse } from 'bungie-api-ts/common';
import * as _ from 'lodash';
import { GroupMembershipSearchResponse } from 'bungie-api-ts/groupv2/interfaces';

export const profileScrubber = (serverResponse: ServerResponse<DestinyProfileResponse>): DestinyProfileResponse => {

  const response = serverResponse.Response;

  // remove dud ghost scans
  delete response.profileProgression.data.checklists[2360931290][1116662180];
  delete response.profileProgression.data.checklists[2360931290][3856710545];
  delete response.profileProgression.data.checklists[2360931290][508025838];

  // adjust adventures checklist state https://github.com/Bungie-net/api/issues/786
  let completed = false;
  // Signal Light
  _.values(response.characterProgressions.data).forEach(character => {
    if (character.checklists[4178338182][844419501]) {
      completed = true;
    }
  });
  _.values(response.characterProgressions.data).forEach(character => {
    if (completed) {
      character.checklists[4178338182][844419501] = true;
    }
  });
  completed = false;
  //Not Even the Darkness
  _.values(response.characterProgressions.data).forEach(character => {
    if (character.checklists[4178338182][1942564430]) {
      completed = true;
    }
  });
  _.values(response.characterProgressions.data).forEach(character => {
    if (completed) {
      character.checklists[4178338182][1942564430] = true;
    }
  });
  completed = false;

  return response;
}

export const groupScrubber = (serverResponse: ServerResponse<GroupMembershipSearchResponse>): GroupMembershipSearchResponse => {

  const response = serverResponse.Response;

  if (response.results.length > 0) {
    (response.results[0].group.clanInfo as any).clanCallsign = entities.decodeHTML(response.results[0].group.clanInfo.clanCallsign);
    (response.results[0].group as any).name = entities.decodeHTML(response.results[0].group.name);
  }

  return response;
}