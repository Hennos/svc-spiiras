import { combineReducers } from 'redux'
import componentsVisibilityFilter from './visibility'
import videoCameraComponent from './videoCamera'
import user from './user'
import people from './people'
import chat from './chat'
import userPreferences from './userPreferences'

const Reducers = combineReducers({
  componentsVisibilityFilter,
  videoCameraComponent,
  user,
  people,
  chat,
  userPreferences
});

export default Reducers;
