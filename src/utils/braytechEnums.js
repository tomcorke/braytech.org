
const flagEnum = (state, value) => !!(state & value);

export const enumerateCollectibleDisplayState = state => ({
  none: flagEnum(state, 0),
  showAll: flagEnum(state, 1),
  hideTriumphRecords: flagEnum(state, 2),
  hideChecklistItems: flagEnum(state, 4)
});
