import React, {PropTypes} from "react";
import styles from "../styles/RightPanelSearchSwitchToggle.css";
import cssModules from "react-css-modules";
import {onEnterKey, withPropagationStopped} from "../helpers/events";

const RightPanelSearchSwitchToggle =
  ({searchingMode, changeSearchMode, isSearching, rightPanelActive, closeRightPanelSearch}) => {
    return (
      <div styleName="search-mode-selection-box"
           style={{display: (!rightPanelActive && isSearching) ? "block" : "none"}}>
        <div styleName="search-mode-selection-box">
          <span>Search Results</span>
          <img
            styleName="close-right-panel-search-button"
            role="button"
            src="img/file_preview/close-icon.svg"
            alt="toggle right panel"
            title="Toggle the right panel"
            onClick={closeRightPanelSearch}
          />
        </div>
        <span
          styleName="search-mode-button search-mode-button--private"
        >
          <span
            styleName={
              searchingMode === "mine"
                ? "search-mode-button__text search-mode-button__text--active"
                : "search-mode-button__text"
            }
            onClick={() => searchingMode !== "mine" && changeSearchMode("mine")}
            onKeyDown={onEnterKey(withPropagationStopped(() => changeSearchMode("mine")))}
            role="button"
            tabIndex="0"
          >
            Messages
          </span>
          <span
            styleName={
              searchingMode === "new"
                ? "search-mode-button__text search-mode-button__text--active"
                : "search-mode-button__text"
            }
            onClick={() => searchingMode !== "new" && changeSearchMode("new")}
            onKeyDown={onEnterKey(withPropagationStopped(() => changeSearchMode("new")))}
            role="button"
            tabIndex="0"
          >
            Files
          </span>
          <span
            styleName={
              searchingMode === "people"
                ? "search-mode-button__text search-mode-button__text--active"
                : "search-mode-button__text"
            }
            onClick={() => searchingMode !== "people" && changeSearchMode("people")}
            onKeyDown={onEnterKey(withPropagationStopped(() => changeSearchMode("people")))}
            role="button"
            tabIndex="0"
          >
            People
          </span>
        </span>
      </div>
    );
  };

RightPanelSearchSwitchToggle.propTypes = propTypes;

const propTypes = {
  searchingMode: PropTypes.string.isRequired,
  changeSearchMode: PropTypes.func.isRequired,
  rightPanelActive: PropTypes.bool.isRequired
};

export default cssModules(RightPanelSearchSwitchToggle, styles, {allowMultiple: true});
