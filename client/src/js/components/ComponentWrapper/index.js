import React from 'react'
import {connect} from 'react-redux'

import {
  activeComponent,
  componentsVisibilityToggles as togglesComponent
} from '../../constants/visibility'

import VideoCameraComponent from '../VideoCamera/index';
import PeoplesComponent from '../People/index';
import ChatComponent from '../Chat/index';
import UserPreferences from '../UserPreferences/index';
import AdminAccount from '../adminAccount/index';

const visibleComponentMap = new Map([
  [togglesComponent.chatArea, <ChatComponent/>],
  [togglesComponent.peopleArea, <PeoplesComponent/>],
  [togglesComponent.userPreferences, <UserPreferences/>],
  [togglesComponent.videoCamera, <VideoCameraComponent/>],
  [togglesComponent.administrationAccount, <AdminAccount/>]
]);

class ComponentWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {active} = this.props;
    return (
      <div className="wrapper_components">
        {visibleComponentMap.get(active)}
      </div>
    )
  }
}

const mapStateProps = (state, ownProps) => {
  return {
    active: state.componentsVisibilityFilter
      .get(activeComponent)
  }
};

export default connect(mapStateProps, null)(ComponentWrapper);
