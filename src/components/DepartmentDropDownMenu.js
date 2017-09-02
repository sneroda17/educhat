import React, {Component, PropTypes} from "react";
import styles from "../styles/DepartmentDropDownMenu.css";
import ImmutablePropTypes from "react-immutable-proptypes";
import cssModules from "react-css-modules";
// import connect from "../helpers/connect-with-action-types";
import ref from "../helpers/ref";

import Department from "../records/department";

@cssModules(styles)
export default class DepartmentDropDownMenu extends Component {
  static propTypes = {
    selectDepartment: PropTypes.func.isRequired,
    departmentName: PropTypes.string.isRequired,
    isDepartmentSelected: PropTypes.bool.isRequired,
    departmentSuggestionList: ImmutablePropTypes.listOf(PropTypes.instanceOf(Department)),
    changeDepartment: PropTypes.func.isRequired
  };

  static defaultProps = {
    departmentSuggestionList: null
  };

  componentDidMount() {
    window.addEventListener("click", this.handleClickOutside, false);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClickOutside, false);
  }

  handleClickOutside = (event) => {
    const {isDepartmentSelected, selectDepartment} = this.props;

    if (!isDepartmentSelected) {
      // if this menu is already closed, then no need to check if click outside
      return;
    }
    // check if this dropDownRef exists and if the click is on
    // any target other than this component(or its children)
    if (this.dropDownRef && !this.dropDownRef.contains(event.target)) {
      // click outside => close this dropdown menu for better user experience
      selectDepartment();
    }
  }

  _changeDepartment = (departmentId, departmentName) =>
  this.props.changeDepartment(departmentId, departmentName);

  render() {
    return (
      <div ref={ref(this, "dropDownRef")}>
        {this.props.departmentSuggestionList === null &&
        <div styleName="department-input-field-disabled" disabled>
          N/A
          <div
              styleName="department-dropdown-button-grey"
              role="button"
          />
        </div>
        }
        {this.props.departmentSuggestionList !== null &&
        <div styleName={this.props.department === null ?
          "department-input-field-missing" : "department-input-field"
          }
            onClick={this.props.selectDepartment}
            role="button"
            onKeyDown={this.props.selectDepartment}
            tabIndex="0"
        >
          {this.props.departmentName}
          <div styleName={this.props.department === null ?
            "department-dropdown-button-error" : "department-dropdown-button"}
              role="button"
              onClick={this.props.selectDepartment}
              onKeyDown={this.props.selectDepartment}
              tabIndex="0"
          />
        </div>
        }
        {this.props.isDepartmentSelected &&
        <ul styleName="department-input-list">
          {this.props.departmentSuggestionList !== null &&
          this.props.departmentSuggestionList.map(department => {
            const id = department.id;
            const name = department.name;
            const _changeDepartment = () => this._changeDepartment(id, name);
            return (
              <li
                  styleName="department-input-option"
                  role="button"
                  key={department.id}
                  value={department.id}
                  onClick={_changeDepartment}
                  onKeyDown={_changeDepartment}
                  tabIndex="0"
              >
                {department.name}
              </li>
            );
          })}
        </ul>
        }
      </div>
    );
  }
}
