import {TOGGLE_COMPONENT_VISIBILITY } from '../constants/visibility'
import {TOGGLE_SIDE_MENU_VISIBILITY} from '../constants/visibility'

export const toggleVisibilityAppComponent = (id) => {
  return {
    type: TOGGLE_COMPONENT_VISIBILITY,
    id
  }
};

export const toggleVisibilitySideMenu = (id) => {
  return {
    type: TOGGLE_SIDE_MENU_VISIBILITY,
    id
  }
};

