/**
 * Created by mindaf93 on 7/17/17.
 */
import React, {PropTypes, PureComponent} from "react";
import styles from "../styles/LeftPanelSearchSwitchToggle.css";
import cssModules from "react-css-modules";

@cssModules(styles, {allowMultiple: true})
export default class LeftPanelSearchSwitchToggle extends PureComponent {
  static propTypes = {
    searchingMode: PropTypes.string.isRequired,
    changeSearchMode: PropTypes.func.isRequired
  };

  _changeSearchModeMine = () => this.props.changeSearchMode("mine");

  _changeSearchModeNew = () => this.props.changeSearchMode("new");

  _changeSearchModePeople = () => this.props.changeSearchMode("people");

  render() {
    const {searchingMode} = this.props;
    return (
      <div styleName="search-mode-selection-box">
        <span
            styleName="search-mode-button search-mode-button--private"
        >
          <span
              styleName={
                searchingMode === "mine"
                  ? "search-mode-button__text search-mode-button__text--active"
                  : "search-mode-button__text"
              }
              onClick={this._changeSearchModeMine}
              onKeyDown={this._changeSearchModeMine}
              role="button"
              tabIndex="0"
          >
            My Chats
          </span>
          <span
              styleName={
                searchingMode === "new"
                  ? "search-mode-button__text search-mode-button__text--active"
                  : "search-mode-button__text"
              }
              onClick={this._changeSearchModeNew}
              onKeyDown={this._changeSearchModeNew}
              role="button"
              tabIndex="0"
          >
            Join
          </span>
          <span
              styleName={
                searchingMode === "people"
                  ? "search-mode-button__text search-mode-button__text--active"
                  : "search-mode-button__text"
              }
              onClick={this._changeSearchModePeople}
              onKeyDown={this._changeSearchModePeople}
              role="button"
              tabIndex="0"
          >
            People
          </span>
        </span>
      </div>
    );
  }
}
