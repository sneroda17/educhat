import React, {Component, PropTypes} from "react";
import styles from "../styles/ProfileViewPopup.css";
import cssModules from "react-css-modules";
import connect from "../helpers/connect-with-action-types";
import {changeGraduationYear} from "../actions/current-user";
import ref from "../helpers/ref";

@connect(state => ({
  yearOfGraduation: state.currentUser.yearOfGraduation,
  yourId: state.currentUser.id
}), {
  changeGraduationYear
})
@cssModules(styles)

export default class GraduationYearDropdownList extends Component {

  static propTypes = {
    userData: PropTypes.object.isRequired,
    closeGraduationYearDropdownList: PropTypes.func.isRequired,
    graduationYearDropdownList: PropTypes.bool.isRequired
  };

  state = {
    graduationYears: [new Date().getFullYear() + 1, new Date().getFullYear() + 2,
      new Date().getFullYear() + 3, new Date().getFullYear() + 4],
    graduationYearDropdownList: this.props.graduationYearDropdownList
  };

  onYearSelection = (id, yearOfGraduation) => {
    this.props.closeGraduationYearDropdownList();
    this.selectNewGradYear(id, yearOfGraduation);
  };

  selectNewGradYear = (id, yearOfGraduation) => {
    const {actions} = this.props;
    actions.changeGraduationYear(id, yearOfGraduation);
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
  //   const {graduationYearDropdownList, actions} = this.props;
  //
  //   if (!graduationYearDropdownList) {
  //     // if this menu is already closed, then no need to check if click outside
  //     return;
  //   }
  //   // check if this dropDownRef exists and if the click is on
  //   // any target other than this component(or its children)
  //   if (this.dropDownRef && !this.dropDownRef.contains(event.target)) {
  //     // click outside => close this dropdown menu for better user experience
  //     this.props.closeGraduationYearDropdownList();
  //   }
  // };

  render() {
    const currentYear = new Date().getFullYear();
    const latestYear = new Date().getFullYear() + 5;
    const selectThisYearOfGraduation = () =>
      this.onYearSelection(this.props.userData.id, currentYear);
    const selectLatestYearOfGraduation = () =>
      this.onYearSelection(this.props.userData.id, latestYear);
    return (
      <div ref={ref(this, "dropDownRef")}>
        <ul styleName="graduation-year-dropdown-list">
          <li styleName="graduation-year-dropdown-first-item"
              onClick={selectThisYearOfGraduation}
              onKeyDown={selectThisYearOfGraduation}
              key={currentYear}
              tabIndex="0"
              role="button"
          >
            Class of {currentYear}
          </li>
          {this.state.graduationYears.map((yearOfGraduation) => {
            const selectThatYearOfGraduation = () =>
              this.onYearSelection(this.props.userData.id, yearOfGraduation);
            return (
              <li styleName="graduation-year-dropdown-list-item"
                  onClick={selectThatYearOfGraduation}
                  onKeyDown={selectThatYearOfGraduation}
                  key={yearOfGraduation}
                  tabIndex="0"
                  role="button"
              >
                Class of {yearOfGraduation}
              </li>
            );
          })}
          <li
              styleName="graduation-year-dropdown-last-item"
              onClick={selectLatestYearOfGraduation}
              onKeyDown={selectLatestYearOfGraduation}
              key={latestYear}
              tabIndex="0"
              role="button"
          >
             Class of {latestYear}
          </li>
        </ul>
      </div>
    );
  }
}
