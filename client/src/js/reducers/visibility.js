import {TOGGLE_COMPONENT_VISIBILITY} from '../constants/visibility'
import {TOGGLE_SIDE_MENU_VISIBILITY} from '../constants/visibility'
import {sideMenuToggleKey} from '../constants/visibility'
import {appComponentsTogglesKey} from '../constants/visibility'
import {activeComponent} from '../constants/visibility'
import {state as initialState} from '../states/visibility'

const componentsVisibilityFilter = function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_COMPONENT_VISIBILITY:
      return handleToggleActiveComponent(state, action);
    case TOGGLE_SIDE_MENU_VISIBILITY:
      return handleToggleSideMenu(state, action);
    default:
      return state;
  }
};

function handleToggleActiveComponent(state, action) {
  const oldActive =
    state
      .get(activeComponent);
  const newActive = action.id;
  const newAppComponentsMap =
    state
      .get(appComponentsTogglesKey)
      .set(oldActive, false)
      .set(action.id, true);
  return state
    .set(appComponentsTogglesKey, newAppComponentsMap)
    .set(activeComponent, newActive);
}

function handleToggleSideMenu(state, action) {
  return state.set(sideMenuToggleKey, !state.get(sideMenuToggleKey));
}

export default componentsVisibilityFilter;
