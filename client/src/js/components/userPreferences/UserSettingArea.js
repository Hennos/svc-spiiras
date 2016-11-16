import React from 'react';

class UserSettingArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {title, name, baseValue, onChange} = this.props;
    return (
      <div className="module_wrapper">
        <div className="name_block">
          <p>{title}</p>
          <p>{baseValue}</p>
        </div>
        <div className="input_block">
          <input type="text" name={name} value={baseValue} onChange={onChange}/>
        </div>
      </div>
    )
  }
}

export default UserSettingArea;
