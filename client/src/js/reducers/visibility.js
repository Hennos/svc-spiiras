import {TOGGLE_COMPONENT_VISIBILITY} from '../constants/visibility'
import {TOGGLE_SIDE_MENU_VISIBILITY} from '../constants/visibility'
import {sideMenuToggleKey} from '../constants/visibility'
import {appComponentsTogglesKey} from '../constants/visibility'
import {state as initialState} from '../states/visibility'

const componentsVisibilityFilter = function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_COMPONENT_VISIBILITY:
      let newAppComponentsMap =
        state
          .get(appComponentsTogglesKey)
          .map(() => {
            return false;
          })
          .set(action.id, true);
      return state.set(appComponentsTogglesKey, newAppComponentsMap);
    case TOGGLE_SIDE_MENU_VISIBILITY:
      return state.set(sideMenuToggleKey, !state.get(sideMenuToggleKey));
    default:
      return state;
  }
};

export default componentsVisibilityFilter;
