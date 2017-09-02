import React, {Component} from "react";
import styles from "../styles/PasswordReset.css";
import cssModules from "react-css-modules";
import connect from "../helpers/connect-with-action-types";
import {resetPassword} from "../actions/current-user";
// import bindState from "../helpers/bind-state";
import {withDefaultPrevented} from "../helpers/events";
import {setHasResetPassword} from "../actions/ui/onboarding";
import {Link} from "react-router";

@connect(state => ({
  hasResetPassword: state.ui.onboarding.hasResetPassword
}), {
  resetPassword,
  setHasResetPassword
})
@cssModules(styles)
export default class ResetPasswordPopup extends Component {
  componentWillMount() {
    this.state = {
      key: this.props.location.query.key
    };
    this.props.actions.setHasResetPassword(false);
  }

  state = {
    newUserPassword: "",
    passwordsEqual: false,
    emailError: false
  };

  changePassword = () => {
    this.props.actions.resetPassword(this.state.key, this.state.newUserPassword);
  };

  onPasswordChange = (e) => {
    this.setState({"newUserPassword": e.target.value});
  };

  onPasswordConfirmChange = (e) => {
    if(e.target.value === this.state.newUserPassword) {
      this.setState({"passwordsEqual": true});
    } else {
      this.setState({"passwordsEqual": false});
    }
  };

  render() {
    const {passwordsEqual} = this.state;
    return(
      this.props.hasResetPassword ?
        <div styleName="container-confirmation">
          <div styleName="container-confirmation-items">
            <p>
              Password Reset Successfully
            </p>
            <Link styleName="login-link" to="/">Click here to login</Link>
          </div>
        </div>
        :
        <div styleName="container">
          <div styleName="password-popup">
            <button styleName="back-btn">
              <img styleName="back-img" src="/img/back-arrow.svg" alt=""/>
              <span styleName="back-text">Back</span></button>
            <img styleName="logo" src="/img/educhat-logo2.png" alt=""/>
            <div styleName="line"/>
            <p styleName="chose-new-password">Choose a new password</p>
            <form
                onSubmit={withDefaultPrevented(this.changePassword)}
            >
              <input
                  type="password"
                  styleName="password-reset-input"
                  placeholder="Enter New Password"
                  onChange={this.onPasswordChange}
              />
              <input
                  type="password"
                  styleName="password-reset-input"
                  placeholder="Confirm New Password"
                  onChange={this.onPasswordConfirmChange}
              />
              <img
                  styleName="passwords-valid"
                  src="/img/passwords-valid.svg"
                  style={{visibility: passwordsEqual ? "visible" : "hidden"}}
                  alt=""
              />
              <input
                  type="submit"
                  value="Save"
                  disabled={!passwordsEqual}
                  styleName={
                    passwordsEqual ? "password-submit-enabled" : "password-submit-disabled"}
              />
            </form>
          </div>
        </div>
    );
  }
}
