import { combineReducers } from 'redux'
import componentsVisibilityFilter from './visibility'
import videoCameraComponent from './videoCamera'
import user from './user'
import people from './people'
import chat from './chat'
import adminAccount from './adminAccount'
import rootIO from './rootIO'

const Reducers = combineReducers({
  componentsVisibilityFilter,
  videoCameraComponent,
  user,
  people,
  chat,
  adminAccount,
  rootIO
});

export default Reducers;
