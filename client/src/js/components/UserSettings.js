import React from 'react';
import {connect} from 'react-redux';
import {componentsVisibilityToggles} from '../constants/visibility'
import {appComponentsTogglesKey} from '../constants/visibility'

let UserSettings = () => (
  <form className="userSettings">
    <input type="text"/>
    <input type="text"/>
    <input type="text"/>
    <input type="text"/>
  </form>
);

const mapStateCustomSettings = (state, ownProps) => {
  return {
    visible: state.componentsVisibilityFilter
      .get(appComponentsTogglesKey)
      .get(componentsVisibilityToggles.peopleArea)
  };
};

People = connect(mapStateCustomSettings)(UserSettings);

export default People;
