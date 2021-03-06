import React from 'react'
import {connect} from 'react-redux'

import ButtonMap from './ButtonMap'

class Man extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {image, username, firstName, lastName, place, type} = this.props;
    return (
      <div className="man_wrapper">
        <div className="man">

          <div className="img_place">
            {(image != null) ?
              <img src={image} alt="Нет изображения"/>
              :
              <p className="fa fa-question-circle"/>
            }
          </div>

          <ul className="name_place">
            <li className="name">
              <div className="username">{username + '\n'}</div>
              <div className="allName">{
                (lastName != null) ? lastName : ''} {(firstName != null) ? firstName : ''
              }
              </div>
            </li>
            <li className="place">{place}</li>
          </ul>

          <ButtonMap type={type} username={username}/>

        </div>
      </div>
    );
  };
}

export default Man;
