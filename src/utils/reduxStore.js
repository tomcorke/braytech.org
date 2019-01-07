import { createStore, combineReducers } from 'redux';

import profileReducer from './reducers/profile';

const rootReducer = combineReducers({
  profile: profileReducer
})

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store;