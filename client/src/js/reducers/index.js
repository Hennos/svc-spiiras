import { combineReducers } from 'redux'
import componentsVisibilityFilter from './visibility'
import videoCameraComponent from './videoCamera'
import user from './user'
import people from './people'

const Reducers = combineReducers({
  componentsVisibilityFilter,
  videoCameraComponent,
  user,
  people
});

export default Reducers;
