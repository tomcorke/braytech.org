import { ManifestActions } from '../actions/manifest'

interface DestinyMembershipType {
  identifier: string
  isDefault: boolean
  displayName: string
  summary: string
  imagePath: string
}

interface ContentLocale {
  identifier: string
  isDefault: boolean
  displayName: string
}

export interface DestinySettings {
  clanBannerDecalColors: unknown[]
  clanBannerDecals: unknown[]
  clanBannerGonfalonColors: unknown[]
  clanBannerGonfalonDetailColors: unknown[]
  clanBannerGonfalonDetails: unknown[]
  clanBannerGonfalons: unknown[]
  clanBannerStandards: unknown[]
  destiny2CoreSettings: {
    ammoTypeHeavyIcon: string
    ammoTypePrimaryIcon: string
    ammoTypeSpecialIcon: string
    badgesRootNode: number
    collectionRootNode: number
    medalsRootNode: number
    recordsRootNode: number
    undiscoveredCollectibleImage: string
  }
  destinyMembershipTypes: DestinyMembershipType[]
  forumCategories: unknown[]
  groupAvatars: unknown[]
  ignoreReasons: unknown[]
  recruitmentActivities: unknown[]
  recruitmentMiscTags: unknown[]
  systemContentLocales: ContentLocale[]
  systems: { [name: string]: { enabled: boolean, parameters: { [key: string]: unknown | undefined }} }
  userContentLocales: ContentLocale[]
}

import {
  DestinyActivityDefinition,
  DestinyActivityGraphDefinition,
  DestinyActivityModeDefinition,
  DestinyActivityModifierDefinition,
  DestinyActivityTypeDefinition,
  DestinyChecklistDefinition,
  DestinyClassDefinition,
  DestinyCollectibleDefinition,
  DestinyDamageTypeDefinition,
  DestinyDestinationDefinition,
  DestinyEquipmentSlotDefinition,
  DestinyFactionDefinition,
  DestinyGenderDefinition,
  DestinyInventoryBucketDefinition,
  DestinyInventoryItemDefinition,
  DestinyItemCategoryDefinition,
  DestinyItemTierTypeDefinition,
  DestinyLocationDefinition,
  DestinyLoreDefinition,
  DestinyMaterialRequirementSetDefinition,
  DestinyMilestoneDefinition,
  DestinyObjectiveDefinition,
  DestinyPlaceDefinition,
  DestinyPlugSetDefinition,
  DestinyPresentationNodeDefinition,
  DestinyProgressionDefinition,
  DestinyProgressionLevelRequirementDefinition,
  DestinyProgressionMappingDefinition,
  DestinyRaceDefinition,
  DestinyRecordDefinition,
  DestinyReportReasonCategoryDefinition,
  DestinyRewardSourceDefinition,
  DestinySandboxPerkDefinition,
  DestinySocketCategoryDefinition,
  DestinySocketTypeDefinition,
  DestinyStatDefinition,
  DestinyStatGroupDefinition,
  DestinyTalentGridDefinition,
  DestinyUnlockDefinition,
  DestinyUnlockValueDefinition,
  DestinyVendorDefinition,
  DestinyVendorGroupDefinition,
} from "bungie-api-ts/destiny2/interfaces";

type Map<T> = { [key: number]: T }

export interface DestinyManifestJsonContent {
  DestinyAchievementDefinition: Map<undefined>
  DestinyActivityDefinition: Map<DestinyActivityDefinition>
  DestinyActivityGraphDefinition: Map<DestinyActivityGraphDefinition>
  DestinyActivityInteractableDefinition: Map<undefined>
  DestinyActivityModeDefinition: Map<DestinyActivityModeDefinition>
  DestinyActivityModifierDefinition: Map<DestinyActivityModifierDefinition>
  DestinyActivityTypeDefinition: Map<DestinyActivityTypeDefinition>
  DestinyArtDyeChannelDefinition: Map<undefined>
  DestinyArtDyeReferenceDefinition: Map<undefined>
  DestinyBondDefinition: Map<undefined>
  DestinyCharacterCustomizationCategoryDefinition: Map<undefined>
  DestinyCharacterCustomizationOptionDefinition: Map<undefined>
  DestinyChecklistDefinition: Map<DestinyChecklistDefinition>
  DestinyClassDefinition: Map<DestinyClassDefinition>
  DestinyCollectibleDefinition: Map<DestinyCollectibleDefinition>
  DestinyDamageTypeDefinition: Map<DestinyDamageTypeDefinition>
  DestinyDestinationDefinition: Map<DestinyDestinationDefinition>
  DestinyEnemyRaceDefinition: Map<undefined>
  DestinyEquipmentSlotDefinition: Map<DestinyEquipmentSlotDefinition>
  DestinyFactionDefinition: Map<DestinyFactionDefinition>
  DestinyGenderDefinition: Map<DestinyGenderDefinition>
  DestinyInventoryBucketDefinition: Map<DestinyInventoryBucketDefinition>
  DestinyInventoryItemDefinition: Map<DestinyInventoryItemDefinition>
  DestinyItemCategoryDefinition: Map<DestinyItemCategoryDefinition>
  DestinyItemTierTypeDefinition: Map<DestinyItemTierTypeDefinition>
  DestinyLocationDefinition: Map<DestinyLocationDefinition>
  DestinyLoreDefinition: Map<DestinyLoreDefinition>
  DestinyMaterialRequirementSetDefinition: Map<DestinyMaterialRequirementSetDefinition>
  DestinyMedalTierDefinition: Map<undefined>
  DestinyMilestoneDefinition: Map<DestinyMilestoneDefinition>
  DestinyNodeStepSummaryDefinition: Map<undefined>
  DestinyObjectiveDefinition: Map<DestinyObjectiveDefinition>
  DestinyPlaceDefinition: Map<DestinyPlaceDefinition>
  DestinyPlugSetDefinition: Map<DestinyPlugSetDefinition>
  DestinyPresentationNodeDefinition: Map<DestinyPresentationNodeDefinition>
  DestinyProgressionDefinition: Map<DestinyProgressionDefinition>
  DestinyProgressionLevelRequirementDefinition: Map<DestinyProgressionLevelRequirementDefinition>
  DestinyProgressionMappingDefinition: Map<DestinyProgressionMappingDefinition>
  DestinyRaceDefinition: Map<DestinyRaceDefinition>
  DestinyRecordDefinition: Map<DestinyRecordDefinition>
  DestinyReportReasonCategoryDefinition: Map<DestinyReportReasonCategoryDefinition>
  DestinyRewardAdjusterPointerDefinition: Map<undefined>
  DestinyRewardAdjusterProgressionMapDefinition: Map<undefined>
  DestinyRewardItemListDefinition: Map<undefined>
  DestinyRewardMappingDefinition: Map<undefined>
  DestinyRewardSheetDefinition: Map<undefined>
  DestinyRewardSourceDefinition: Map<DestinyRewardSourceDefinition>
  DestinySackRewardItemListDefinition: Map<undefined>
  DestinySandboxPatternDefinition: Map<undefined>
  DestinySandboxPerkDefinition: Map<DestinySandboxPerkDefinition>
  DestinySocketCategoryDefinition: Map<DestinySocketCategoryDefinition>
  DestinySocketTypeDefinition: Map<DestinySocketTypeDefinition>
  DestinyStatDefinition: Map<DestinyStatDefinition>
  DestinyStatGroupDefinition: Map<DestinyStatGroupDefinition>
  DestinyTalentGridDefinition: Map<DestinyTalentGridDefinition>
  DestinyUnlockCountMappingDefinition: Map<undefined>
  DestinyUnlockDefinition: Map<DestinyUnlockDefinition>
  DestinyUnlockEventDefinition: Map<undefined>
  DestinyUnlockExpressionMappingDefinition: Map<undefined>
  DestinyUnlockValueDefinition: Map<DestinyUnlockValueDefinition>
  DestinyVendorDefinition: Map<DestinyVendorDefinition>
  DestinyVendorGroupDefinition: Map<DestinyVendorGroupDefinition>
}

export interface ManifestState {
  version?: string
  manifestContent?: DestinyManifestJsonContent
  settings?: DestinySettings
  availableLanguages?: string[]
}

const initialState = {
  hasManifestData: false,
  settings: undefined
};

export default (state: ManifestState = initialState, action: ManifestActions): ManifestState => {
  switch (action.type) {

    case 'SET_MANIFEST_STATE':
      return {
        ...state,
        version: action.payload.version,
        manifestContent: action.payload.manifestContent,
      }

    case 'SET_SETTINGS_STATE':
      return {
        ...state,
        settings: action.payload
      }

    default:
      return state;
  }
}