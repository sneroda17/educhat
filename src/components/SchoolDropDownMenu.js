import React, {Component, PropTypes} from "react";
import styles from "../styles/SchoolDropDownMenu.css";
import ImmutablePropTypes from "react-immutable-proptypes";
import cssModules from "react-css-modules";
// import connect from "../helpers/connect-with-action-types";
import ref from "../helpers/ref";

import School from "../records/school";

@cssModules(styles)
export default class SchoolDropDownMenu extends Component {
  static propTypes = {
    selectSchool: PropTypes.func.isRequired,
    schoolName: PropTypes.string.isRequired,
    isSchoolSelected: PropTypes.bool.isRequired,
    schoolSuggestionList: ImmutablePropTypes.listOf(PropTypes.instanceOf(School)),
    changeSchool: PropTypes.func.isRequired
  };

  static defaultProps = {
    schoolSuggestionList: null
  };

  componentDidMount() {
    window.addEventListener("click", this.handleClickOutside, false);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClickOutside, false);
  }

  handleClickOutside = (event) => {
    const {isSchoolSelected, selectSchool} = this.props;

    if (!isSchoolSelected) {
      // if this menu is already closed, then no need to check if click outside
      return;
    }
    // check if this dropDownRef exists and if the click is on
    // any target other than this component(or its children)
    if (this.dropDownRef && !this.dropDownRef.contains(event.target)) {
      // click outside => close this dropdown menu for better user experience
      selectSchool();
    }
  }

  _changeSchool = (schoolId, schoolName) => this.props.changeSchool(schoolId, schoolName);

  render() {
    return (
      <div ref={ref(this, "dropDownRef")}>
        <div
            styleName="school-input-field"
            onClick={this.props.selectSchool}
            role="button"
            onKeyDown={this.props.selectSchool}
            tabIndex="0"
        >
          {this.props.schoolName}
          <div
              styleName="school-dropdown-button"
              role="button"
              onClick={this.props.selectSchool}
              onKeyDown={this.props.selectSchool}
              tabIndex="0"
          />
        </div>
        {this.props.isSchoolSelected &&
        <ul styleName="school-input-list">
          {this.props.schoolSuggestionList &&
          this.props.schoolSuggestionList.map(school => {
            const id = school.id;
            const name = school.name;
            const _changeSchool = () => this._changeSchool(id, name);
            return (
              <li
                  styleName="school-input-option"
                  key={school.id}
                  value={school.id}
                  role="button"
                  onClick={_changeSchool}
                  onKeyDown={_changeSchool}
                  tabIndex="0"
              >
                {school.name}
              </li>
            );
          })}
        </ul>
        }
      </div>
    );
  }
}
