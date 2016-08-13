import { combineReducers } from 'redux'
import componentsVisibilityFilter from './visibility'
import videoCameraComponent from './videoCamera'
import user from './user'
import people from './people'
import chat from './chat'

const Reducers = combineReducers({
  componentsVisibilityFilter,
  videoCameraComponent,
  user,
  people,
  chat
});

export default Reducers;
