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
  DestinyVendorGroupDefinition
} from "bungie-api-ts/destiny2/interfaces";

type Map<T> = { [key: number]: T }

export interface DestinyManifestJsonContent {

  DestinyAchievementDefinition: Map<unknown>
  DestinyActivityDefinition: Map<DestinyActivityDefinition>
  DestinyActivityGraphDefinition: Map<DestinyActivityGraphDefinition>
  DestinyActivityInteractableDefinition: Map<unknown>
  DestinyActivityModeDefinition: Map<DestinyActivityModeDefinition>
  DestinyActivityModifierDefinition: Map<DestinyActivityModifierDefinition>
  DestinyActivityTypeDefinition: Map<DestinyActivityTypeDefinition>
  DestinyArtDyeChannelDefinition: Map<unknown>
  DestinyArtDyeReferenceDefinition: Map<unknown>
  DestinyBondDefinition: Map<unknown>
  DestinyCharacterCustomizationCategoryDefinition: Map<unknown>
  DestinyCharacterCustomizationOptionDefinition: Map<unknown>
  DestinyChecklistDefinition: Map<DestinyChecklistDefinition>
  DestinyClassDefinition: Map<DestinyClassDefinition>
  DestinyCollectibleDefinition: Map<DestinyCollectibleDefinition>
  DestinyDamageTypeDefinition: Map<DestinyDamageTypeDefinition>
  DestinyDestinationDefinition: Map<DestinyDestinationDefinition>
  DestinyEnemyRaceDefinition: Map<unknown>
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
  DestinyMedalTierDefinition: Map<unknown>
  DestinyMilestoneDefinition: Map<DestinyMilestoneDefinition>
  DestinyNodeStepSummaryDefinition: Map<unknown>
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
  DestinyRewardAdjusterPointerDefinition: Map<unknown>
  DestinyRewardAdjusterProgressionMapDefinition: Map<unknown>
  DestinyRewardItemListDefinition: Map<unknown>
  DestinyRewardMappingDefinition: Map<unknown>
  DestinyRewardSheetDefinition: Map<unknown>
  DestinyRewardSourceDefinition: Map<DestinyRewardSourceDefinition>
  DestinySackRewardItemListDefinition: Map<unknown>
  DestinySandboxPatternDefinition: Map<unknown>
  DestinySandboxPerkDefinition: Map<DestinySandboxPerkDefinition>
  DestinySocketCategoryDefinition: Map<DestinySocketCategoryDefinition>
  DestinySocketTypeDefinition: Map<DestinySocketTypeDefinition>
  DestinyStatDefinition: Map<DestinyStatDefinition>
  DestinyStatGroupDefinition: Map<DestinyStatGroupDefinition>
  DestinyTalentGridDefinition: Map<DestinyTalentGridDefinition>
  DestinyUnlockCountMappingDefinition: Map<unknown>
  DestinyUnlockDefinition: Map<DestinyUnlockDefinition>
  DestinyUnlockEventDefinition: Map<unknown>
  DestinyUnlockExpressionMappingDefinition: Map<unknown>
  DestinyUnlockValueDefinition: Map<DestinyUnlockValueDefinition>
  DestinyVendorDefinition: Map<DestinyVendorDefinition>
  DestinyVendorGroupDefinition: Map<DestinyVendorGroupDefinition>

}

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

export type MergedManifestData = DestinyManifestJsonContent & { settings: DestinySettings }