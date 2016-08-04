import {TOGGLE_COMPONENT_VISIBILITY }from '../constants/visibility'

export const toggleVisibilityAppComponent = (id) => {
  return {
    type: TOGGLE_COMPONENT_VISIBILITY,
    id
  }
};

