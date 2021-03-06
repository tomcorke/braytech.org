import { createStore, combineReducers } from 'redux';

import profile from './reducers/profile';
import theme from './reducers/theme';
import collectibles from './reducers/collectibles';
import refreshService from './reducers/refreshService';

const rootReducer = combineReducers({
  profile,
  theme,
  collectibles,
  refreshService
})

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store;