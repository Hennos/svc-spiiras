import Immutable from 'immutable';
import {TOGGLE_COMPONENT_VISIBILITY} from '../constants/visibility'
import {componentsVisibilityToggles} from '../constants/visibility'


const componentsVisibilityFilter = (state = Immutable.Map([
  [componentsVisibilityToggles.sideMenu, true],
  [componentsVisibilityToggles.videoCamera, false],
  [componentsVisibilityToggles.chatArea, false],
  [componentsVisibilityToggles.peopleArea, true],
  [componentsVisibilityToggles.userPreferences, false],
  [componentsVisibilityToggles.commonPreferences, false],
  [componentsVisibilityToggles.cameraAudioPreferences, false]

]), action) => {
  switch (action.type) {
    case TOGGLE_COMPONENT_VISIBILITY:
      return state.set(action.id, !state.get(action.id));
    default:
      return state;
  }
};

export default componentsVisibilityFilter;
