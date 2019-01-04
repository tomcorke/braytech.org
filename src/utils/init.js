import * as ls from './localStorage';

let collectibleDisplayState = ls.get('setting.collectibleDisplayState') ? ls.get('setting.collectibleDisplayState') : false;
collectibleDisplayState = !collectibleDisplayState
  ? ls.set('setting.collectibleDisplayState', {
      hideTriumphRecords: false,
      hideChecklistItems: false
    })
  : collectibleDisplayState;
