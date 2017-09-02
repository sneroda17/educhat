import React, {Component, PropTypes} from "react";
import styles from "../styles/Loading.css";
import cssModules from "react-css-modules";
import {logout} from "../actions/current-user";
import connect from "../helpers/connect-with-action-types";

@connect(state => ({
  hasSessionExpired: state.currentUser.hasSessionExpired
}), {
  logout
})
@cssModules(styles)
export default class Loading extends Component {
  static propTypes = {
    hasSessionExpired: PropTypes.bool.isRequired
  };

  componentDidMount() {
    this.interval = setInterval(this.onTick, 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  _logout = () => {
    const {actions} = this.props;
    actions.logout();
  }

  onTick = () => {
    const {hasSessionExpired} = this.props;
    if (!hasSessionExpired) {
      const thisTime = (this.state.time + 1) % 5;
      this.setState({
        time: thisTime
      });
    }
  }

  state = {
    time: 2
  }

  returnLoadingState = () => {
    const {time} = this.state;
    switch(time) {
      case 1:
        return (
          <p styleName="loading-text">
            {"Loading."}&nbsp;&nbsp;&nbsp;
          </p>
        );
      case 2:
        return (
          <p styleName="loading-text">
            {"Loading.."}&nbsp;&nbsp;
          </p>
        );
      case 3:
        return (
          <p styleName="loading-text">
            {"Loading..."}&nbsp;
          </p>
        );
      case 4:
        return (
          <p styleName="loading-text">
            {"Loading...."}
          </p>
        );
      default:
        return (
          <p styleName="loading-text">
            {"Loading"}&nbsp;&nbsp;&nbsp;&nbsp;
          </p>
        );
    }
  }

  render() {
    const {hasSessionExpired} = this.props;
    return (
      <div styleName="loading-container">
        <img styleName="loading-img" src="/img/educhat-logo.png" alt=""/>
        {hasSessionExpired
          ?
            <div styleName="loading-warning-container">
              <p styleName="loading-warning">
                Your session has expired.
              </p>
              <button styleName="logout-btn" onClick={this._logout}>
                Login Again
              </button>
            </div>
          :
          this.returnLoadingState()
        }
      </div>
    );
  }
}
