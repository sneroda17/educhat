import React, {Component, PropTypes} from "react";
import connect from "../helpers/connect-with-action-types";
import {toggleInviteBox} from "../actions/ui/right-panel";
import styles from "../styles/InviteBox.css";
import cssModules from "react-css-modules";
import {onEnterKey} from "../helpers/events";

@connect(state => ({
  inviteBoxActive: state.ui.rightPanel.inviteBoxActive
}), {
  toggleInviteBox
})

@cssModules(styles)
export default class InviteBox extends Component {
  static propTypes = {
    inviteBoxActive: PropTypes.bool.isRequired
  };

  // componentDidMount() {
  //   window.addEventListener("click", this.handleClickOutside, false);
  // }
  //
  // componentWillUnmount() {
  //   window.removeEventListener("click", this.handleClickOutside, false);
  // }
  //
  // handleClickOutside = (event) => {
  //   const {inviteBoxActive} = this.props;
  //
  //   if (!inviteBoxActive) {
  //     // if this menu is already closed, then no need to check if click outside
  //     return;
  //   } else {
  //     this.props.actions.toggleInviteBox(false);
  //   }
  // };

  onButtonClick = () => {
    const {inviteBoxActive} = this.props;
    this.props.actions.toggleInviteBox(!inviteBoxActive);
  };

  render() {
    return (
      <div styleName="invite-header">
        <button
            styleName="toggle-invite-button"
            onClick={this.onButtonClick}
            onKeyDown={onEnterKey(this.onButtonClick)}
        >
          <span>
            <img src="img/right_panel/shape.svg" alt="toggle invite box"/>
          </span>
          <div styleName="invite-header-text">Add people</div>
        </button>
      </div>
    );
  }
}
