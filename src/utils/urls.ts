import { UserInfoCard } from "bungie-api-ts/user/interfaces";

export const ACCOUNT_URL_PATH = '/account/:name/:membershipType/:membershipId/:characterId'

export const getAccountUrl = (userInfo?: UserInfoCard, characterId?: string) => {
  if (!userInfo || !characterId) {
    return '/account'
  }
  return  `/account/${userInfo.displayName}/${userInfo.membershipType}/${userInfo.membershipId}/${characterId}`
}