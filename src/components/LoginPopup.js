// @flow

import React, {Component, PropTypes} from "react";
import styles from "../styles/LoginPopup.css";
import cssModules from "react-css-modules";
import connect from "../helpers/connect-with-action-types";
import {deleteError} from "../actions/errors";
import {onEnterKey, withDefaultPrevented} from "../helpers/events";
import {Link} from "react-router";

import {login, changeEmail, changePassword} from "../actions/current-user";
@connect(state => ({
  loginError: state.errors.login,
  email: state.currentUser.email,
  password: state.currentUser.password,
  isLoginProgress: state.currentUser.isLoginProgress
}), {
  deleteError,
  login,
  changeEmail,
  changePassword
})
@cssModules(styles)
/* eslint-disable react/no-set-state */
export default class LoginPopup extends Component {


  componentWillUnmount() {
    const {actions} = this.props;
    actions.deleteError("login");
  }

  static propTypes = {
    loginError: PropTypes.any
  };

  static defaultProps = {
    loginError: null
  };

  onEmailChange = (e) => {
    const {actions} = this.props;

    actions.changeEmail(e.target.value);
  };

  onPasswordChange = (e) => {
    const {actions} = this.props;

    actions.changePassword(e.target.value);
  };

  onLogin = () => {
    const {actions} = this.props;
    actions.login();
    this.resetPasswordField();
  };

  resetPasswordField = () => {
    this.setState({userPassword: ""});
  };

  stopPropagation = (e) => {
    e.stopPropagation();
  };

  goToHome = () => {
    window.location.href = "/";
  };

  close = () => {
    const {actions} = this.props;

    actions.deleteError("login");
    this.goToHome();
  };
  // loginVal=()=>{
  //   actions.isloggingIn();
  // };
  render() {
    const {loginError, isLoginProgress} = this.props;
    return (
      <div styleName="login-popup-wrapper">
        {/* eslint-disable */}
        <div styleName="login-popup" onClick={this.stopPropagation}>
        {/* eslint-enable */}
          <div styleName="login-header-container">
            <img
                styleName="close-icon"
                src="/img/file_preview/close-icon.svg"
                alt="To close Login Popup"
                onClick={this.close}
                onKeyDown={onEnterKey(this.close)}
                role="button"
                tabIndex="0"
            />
            <img styleName="edu-chat-logo" src="/img/educhat-logo2.png" alt="Edu Chat Logo"/>
            <div styleName="seperator"/>
            <h3 styleName="header-title">Log into Edu.Chat</h3>
          </div>
          <div styleName="main-alert-message" style={{visibility: loginError}}>
            {loginError.text}
          </div>
          <form
              className="loginPopUp"
              styleName="login-form"
              onSubmit={withDefaultPrevented(this.onLogin)}
          >
            {/* <div styleName="input-container">
              <input styleName="email-input"
                  type="text"
                  onChange={this.onEmailChange}
                  placeholder="School Email Address"
                  style={{borderBottomColor: this.props.loginError ? "red" : "#FFFFFF"}}/>
              <a styleName="forgot-link">Forgot?</a>
            </div>
            <div styleName="input-container">
              <input styleName="password-input"
                  type="password"
                  value={this.state.userPassword}
                  onChange={this.onPasswordChange}
                  placeholder="Password"
                  style={{borderBottom: this.props.loginError
                      ? "solid 1px #FF0000" : "solid 1px #FFFFFF"}}/>
              <a styleName="forgot-link">Forgot?</a>
            </div>*/}
            {/* <a data-tip data-for='sadFace'> Hiiiiiiiiiiiiiiiiii </a>
            <ReactTooltip id='sadFace' type='warning' effect='solid'>
              <span>Show sad face</span>
            </ReactTooltip>*/}

            <div styleName="user-account-field">
              <img
                  styleName="warning-icon"
                  alt="Warning Wrong Email Address"
                  src="/img/home/warning.svg"
                  style={{visibility: loginError ? "visible" : "hidden"}}
              />
              <div styleName="input-container">
                <input
                    styleName="email-input"
                    type="text"
                    onChange={this.onEmailChange}
                    placeholder="School Email Address"
                />
                {/* onChange={withTargetValue(changeEmail)} */}
                {/* style={{border: this.props.loginError
                      ? "solid 1px #FF0000" : "solid 1px #FFFFFF"}} />*/}
              </div>
            </div>
            <div styleName="user-account-field">
              <img
                  styleName="warning-icon"
                  alt="Warning Wrong Password"
                  src="/img/home/warning.svg"
                  style={{visibility: loginError ? "visible" : "hidden"}}
              />
              <div styleName="input-container">
                <input
                    styleName="password-input"
                    type="password"
                    onChange={this.onPasswordChange}
                    placeholder="Password"
                />
                <Link styleName="forgot-link" to="/password/reset">Forgot?</Link>
              </div>
            </div>
            { (!isLoginProgress) ?
              <input styleName="login-submit-button" type="submit" value="Log In"/>
              :
              <div styleName="login-submit-button" >
                <img src="img/ring.gif" alt="loading chats" height="40px" width="40px"/>
              </div>
            }
          </form>
          <p styleName="signup-description">
            Dont have an account?&nbsp;
            <Link styleName="signup-link" to="/onboarding">
              Sign Up!
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

// export default CSSModules(LoginPopup, styles);
