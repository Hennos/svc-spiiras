import {Events } from '../constants/visibility'

export const toggleVisibilityAppComponent = (id) => {
  return {
    type: Events.toggleComponentVisibility,
    id
  }
};

export const toggleVisibilitySideMenu = (id) => {
  return {
    type: Events.toggleSideMenuVisibility,
    id
  }
};

