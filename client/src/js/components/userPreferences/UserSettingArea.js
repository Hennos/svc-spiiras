import React from 'react';

class UserSettingArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {title, name, baseValue} = this.props;
    return (
      <div className="module_wrapper">
        <div className="name_block">
          <p>{title}</p>
          <p>{baseValue}</p>
        </div>
        <div className="input_block">
          <input type="text" name={name} value={baseValue}/>
        </div>
      </div>
    )
  }
}

export default UserSettingArea;
