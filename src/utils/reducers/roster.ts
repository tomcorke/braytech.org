import { RosterActions } from '../actions/roster'

export interface RosterState {
}

const initialState = {}

export default (state: RosterState = initialState, action: RosterActions): RosterState => {
  switch (action.type) {
    default:
      return state;
  }
}