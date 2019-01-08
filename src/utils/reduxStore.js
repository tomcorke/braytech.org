import { createStore, combineReducers } from 'redux';

import profileReducer from './reducers/profile';
import themeReducer from './reducers/theme';
import collectiblesReducer from './reducers/collectibles';

const rootReducer = combineReducers({
  profile: profileReducer,
  theme: themeReducer,
  collectibles: collectiblesReducer
})

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store;