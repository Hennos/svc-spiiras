import Immutable from 'immutable'
import {componentsVisibilityToggles} from '../constants/visibility'
import {sideMenuToggleKey} from '../constants/visibility'
import {appComponentsTogglesKey} from '../constants/visibility'
import {defaultComponent} from '../constants/visibility'
import {activeComponent} from '../constants/visibility'

const appComponentsTogglesMap = Immutable.Map(componentsVisibilityToggles)
  .mapEntries(
    ([key, value]) => {
      return [value, false];
    }
  )
  .set(defaultComponent, true);

export const state = Immutable.Map([
  [sideMenuToggleKey, true],
  [activeComponent, defaultComponent],
  [appComponentsTogglesKey, appComponentsTogglesMap]
]);
