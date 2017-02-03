import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {user as userFields} from '../../../../../../constants/user';

import {MainStatus} from './MainStatus/index';
import {PreferencesStatus} from './PreferencesStatus/index';
import {SubmitButton} from './SubmitButton';

class StatusArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: {
        main: {
          password: null,
          email: null
        }
      }
    }
  }

  render() {
    const {main, preferences} = this.props.value;
    return (
      <div className={"status-area"}>
        <MainStatus value={main} onChange={this.changeStatus}/>
        <PreferencesStatus value={preferences}/>
        <SubmitButton name='Submit' value="Сохранить изменения"
                      onSubmit={this.submitUpdating}
        />
      </div>
    )
  }

  changeStatus = (name, value) =>
    this.setState((prevState) => {
      let postStatus = _.cloneDeep(prevState.status);
      postStatus.main[name] = (value) ? value : null;
      return {status: postStatus};
    });

  submitUpdating = () => {
    const value = _.get(this.state.status, 'main');
    //this.props.onSubmitUpdate(value);
  };
}

export default StatusArea;
