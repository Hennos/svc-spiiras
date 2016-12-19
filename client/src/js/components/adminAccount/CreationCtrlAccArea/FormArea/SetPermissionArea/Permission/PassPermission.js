import React from 'react';

import {BasePermission} from './BasePermission/index'
import {Input} from './Input'

class StatePassPermission extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      permission: false
    }
  }

  render() {
    const {title, name, onChange} = this.props;
    const {permission} = this.state;
    return (
      <div className="pass-permission-area">
        <BasePermission
          title={title} name={name}
          onChange={this.onChangePermission}
        />
        {permission && <Input name={name} onChange={onChange}/>}
      </div>
    )
  }

  onChangePermission = (name, value) => {
    this.setState({permission: value});
  }
}

export const PassPermission = (props) => (
  <StatePassPermission {...props}/>
);
