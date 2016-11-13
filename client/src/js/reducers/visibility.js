import {Events} from '../constants/visibility'
import {sideMenuToggleKey} from '../constants/visibility'
import {appComponentsTogglesKey} from '../constants/visibility'
import {activeComponent} from '../constants/visibility'
import {state as initialState} from '../states/visibility'

const componentsVisibilityFilter = function (state = initialState, action) {
  switch (action.type) {
    case Events.toggleComponentVisibility:
      return handleToggleActiveComponent(state, action);
    case Events.toggleSideMenuVisibility:
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
