import { getDefaultProfile } from '../localStorage';
import { DestinyProfileResponse, DestinyPublicMilestone } from 'bungie-api-ts/destiny2/interfaces'
import { ProfileActions } from '../actions/profile';
import { GroupMembershipSearchResponse } from 'bungie-api-ts/groupv2/interfaces';

// Define a limited type for our profile data
// which only contains the properties we request from
// Bungie, so we can't accidentally think we have
// the full object somewhere else
export type LimitedDestinyProfileResponse = Pick<
  DestinyProfileResponse,
  Exclude<
    keyof DestinyProfileResponse,
    keyof {
      characterCurrencyLookups: never
      characterInventories: never
      characterKiosks: never
      characterPresentationNodes: never
      characterRenderData: never
      profileCurrencies: never
      profileInventory: never
      profileKiosks: never
      profilePresentationNodes: never
      vendorReceipts: never
    }
  >
>

export interface ProfileData {
  profile: LimitedDestinyProfileResponse
  milestones: {
    [key: number]: DestinyPublicMilestone
  }
  groups: GroupMembershipSearchResponse
}

export interface ProfileState {
  membershipType?: number
  membershipId?: string
  characterId?: string
  data?: ProfileData
  prevData?: ProfileData
}

const savedProfile = getDefaultProfile()
const defaultState: ProfileState = {
  ...savedProfile,
  data: undefined,
  prevData: undefined
}

export default function profileReducer(
  state: ProfileState = defaultState,
  action: ProfileActions) {

  switch (action.type) {
    case 'SET_PROFILE_DATA':
      return action.payload
    default:
      return state
  }
}