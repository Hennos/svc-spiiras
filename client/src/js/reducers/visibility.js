import {Events} from '../constants/visibility'
import {sideMenuToggleKey} from '../constants/visibility'
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
  return state
    .set(activeComponent, action.id);
}

function handleToggleSideMenu(state, action) {
  return state.set(sideMenuToggleKey, !state.get(sideMenuToggleKey));
}

export default componentsVisibilityFilter;
