import React from 'react';

import ExitStatusMessage from './ExitStatusMessage'

const RESPONSE = {
  DEFAULT: 0,
  SUCCESS: 1,
  BAD_PASSWORD: 2,
  TIMEOUT: 3,
  FAILED: 4
};

const resStatus = new Map([
  [RESPONSE.DEFAULT, "До запроса"],
  [RESPONSE.SUCCESS, "Успешно"],
  [RESPONSE.BAD_PASSWORD, "Неправильный пароль"],
  [RESPONSE.TIMEOUT, "Сервер не отвечает"],
  [RESPONSE.FAILED, "Ошибка"]
]);

class ExitPasswordForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      status: RESPONSE.DEFAULT,
      loading: false
    };
  }

  render() {
    const {outFocus, onFocus} = this.props;
    return (
      <div className="exit-password-form-area">
        <form  className="exit-password-form" onSubmit={this.handleSubmit}>
          <label className="exit-password-input-label">
            <input
              type="password" value={this.state.value} placeholder="Пароль"
              onChange={this.handleChange} onBlur={outFocus} onFocus={onFocus}
            />
            {this._resPasswordStatus(this.state.status)}
          </label>
          {(this.state.loading) ?
            <input type="submit" value="Загрузка..." disabled/>
            :
            <input type="submit" value="Отправить"/>
          }
        </form>
      </div>
    )
  };

  componentDidMount = () => {
    this.props.outFocus();
  };

  handleChange = (event) => {
    this.setState({value: event.target.value});
  };

  handleSubmit = (event) => {
    this._requestExit();
    event.preventDefault();
  };

  _requestExit = () => {
    if (this.state.value == '') {
      this.setState({status: RESPONSE.BAD_PASSWORD});
      return;
    }

    this.setState({loading: true});

    const params = "exit-password=" + encodeURIComponent(this.state.value);

    let exitRequest = new XMLHttpRequest();

    exitRequest.timeout = 10000;

    exitRequest.open('GET', '/logout/submit?' + params, true);

    exitRequest.onreadystatechange = () => {
      if (exitRequest.readyState != 4) return;

      this.setState({loading: false});

      switch (exitRequest.status) {
        case 200:
          this.setState({status: RESPONSE.SUCCESS});
          break;
        case 406:
          this.setState({status: RESPONSE.BAD_PASSWORD});
          break;
        default:
          this.setState({status: RESPONSE.FAILED});
      }
    };

    exitRequest.ontimeout = () => {
      this.setState({
        status: RESPONSE.TIMEOUT,
        loading: false
      });
    };

    exitRequest.send();
  };

  _resPasswordStatus = (status) =>
    (status != RESPONSE.DEFAULT) &&
     (<ExitStatusMessage status={resStatus.get(status)}/>);
}

export default ExitPasswordForm;
