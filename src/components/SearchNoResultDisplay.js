import React, {PropTypes} from "react";
import styles from "../styles/LeftPanel.css";
import cssModules from "react-css-modules";

const propTypes = {
  searchKeyword: PropTypes.string.isRequired
};

const defaultProps = {
  searchKeyword: ""
};

const SearchNoResultDisplay = ({searchKeyword}) =>
  <div styleName="search-no-result-container">
    <p styleName="search-no-result-title">Sorry! :(</p>
    <p styleName="search-no-result-body">{"We couldn't find any results for "}</p>
    <p>{"\"" + searchKeyword + "\"."}</p>
  </div>;

SearchNoResultDisplay.propTypes = propTypes;
SearchNoResultDisplay.defaultProps = defaultProps;

export default cssModules(SearchNoResultDisplay, styles);
