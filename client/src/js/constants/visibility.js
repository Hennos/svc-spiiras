const TOGGLE_COMPONENT_VISIBILITY = 'TOGGLE_COMPONENT_VISIBILITY';
const TOGGLE_SIDE_MENU_VISIBILITY = 'TOGGLE_SIDE_MENU_VISIBILITY';

const componentsVisibilityToggles = {
  videoCamera: 'videoCameraVisibilityToggle',
  chatArea: 'chatAreaVisibilityToggle',
  peopleArea: 'peopleAreaVisibilityToggle',
  userPreferences: 'userPreferencesVisibilityToggle',
  commonPreferences: 'commonPreferencesVisibilityToggle',
  cameraAudioPreferences: 'cameraAudioPreferencesVisibilityToggle',
  administrationAccount: 'administraatioAccountVisibilityToggle'
};
const sideMenuToggleKey = 'sideMenuVisibilityToggle';
const appComponentsTogglesKey = 'appComponentsVisibilityToggles';

const defaultComponent = componentsVisibilityToggles.administrationAccount;

export {
  TOGGLE_COMPONENT_VISIBILITY,
  TOGGLE_SIDE_MENU_VISIBILITY,
  componentsVisibilityToggles,
  sideMenuToggleKey,
  appComponentsTogglesKey,
  defaultComponent
}
