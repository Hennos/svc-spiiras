import Immutable from 'immutable'
import {componentsVisibilityToggles} from '../constants/visibility'
import {
  sideMenuToggleKey,
  defaultComponent,
  activeComponent
} from '../constants/visibility'

export const state = Immutable.Map([
  [sideMenuToggleKey, true],
  [activeComponent, defaultComponent]
]);
