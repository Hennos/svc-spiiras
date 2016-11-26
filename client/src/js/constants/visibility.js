const Events = {
  toggleComponentVisibility: 'TOGGLE_COMPONENT_VISIBILITY',
  toggleSideMenuVisibility: 'TOGGLE_SIDE_MENU_VISIBILITY'
};

const componentsVisibilityToggles = {
  videoCamera: 'videoCameraVisibilityToggle',
  chatArea: 'chatAreaVisibilityToggle',
  peopleArea: 'peopleAreaVisibilityToggle',
  userPreferences: 'userPreferencesVisibilityToggle',
  administrationAccount: 'administrationAccountVisibilityToggle',
  cameraAudioPreferences: 'cameraAudioPreferencesVisibilityToggle'
};

const sideMenuToggleKey = 'sideMenuVisibilityToggle';
const defaultComponent = componentsVisibilityToggles.peopleArea;
const activeComponent = "activeComponent";

export {
  Events,
  componentsVisibilityToggles,
  sideMenuToggleKey,
  defaultComponent,
  activeComponent
}
