import React, { Component } from 'react';
import { Link } from 'react-router';
import LoginPopup from '../components/LoginPopup';
import OnboardingPopup from '../components/OnboardingPopup';
import styles from '../styles/StaticPage.css';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import ForgotPasswordPopup from '../components/ForgotPasswordPopup';

import {login, changeEmail, changePassword, signUp} from "../actions/current-user";
import {toggleLoginPopup, toggleForgotPasswordPopup} from "../actions/ui/static-pages";
import {setActiveStep, refreshUniversitySuggestionList, closeUniversitySuggestionList} from "../actions/ui/onboarding";

const backgroundStyle = (backgroudUrl) => {
  // The about-content(title + background image) has inline styles because this way
  // the backgroudUrl can be passed as this.props.
  // careers is the only different page so we use a different component with the
  // positions in this.props.children
  return {
    color: "white",
    height: "70vh",
    textAlign: "center",
    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroudUrl})`,
    backgroundPosition: "50% 50%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
  }
};

@connect(state => ({
  email: state.currentUser.email,
  password: state.currentUser.password,
  loginPopupActive: state.ui.staticPages.loginPopupActive,
  onboardingStep: state.ui.onboarding.activeStep,
  universitySuggestionList: state.ui.onboarding.universitySuggestionList,
  forgotPasswordPopupActive: state.ui.staticPages.forgotPasswordPopupActive
}), {
  login,
  changeEmail,
  changePassword,
  toggleLoginPopup,
  setActiveStep,
  refreshUniversitySuggestionList,
  closeUniversitySuggestionList,
  signUp,
  toggleForgotPasswordPopup
})
@CSSModules(styles)
class StaticPage extends Component {

  //ONBOARDING POPUP FUNCTIONS//
  toggleSignUpPopup (toggle) {
    if (this.props.loginPopupActive) {
      this.props.toggleLoginPopup();
    }

    this.setState({account_type: '', school: ''});

    if (toggle)
    {
      this.props.setActiveStep("school-step");
    }
    else
    {
      this.props.setActiveStep(null);
    }
  }

  changeOnboardingStep (step) {
    if(step === 'account-step' && this.state.school.trim() === '') {
      alert('Please choose a school');
    } else {
      this.props.setActiveStep(step);
    }
  }

  searchUniversity(e) {
    this.setState({school: e.target.value.trim()});
    this.props.refreshUniversitySuggestionList(e.target.value);
  }

  updateUniversity(universityId) {
    this.setState({school: universityId});
  }

  chooseAccountType(accountType) {
    this.setState({account_type: accountType})
  }

  updateDetails(e, key) {
    this.setState({[key]: e.target.value});
  }

  onboardingSubmit() {
    this.props.signUp(
      this.state.account_type,
      this.state.email,
      this.state.password,
      this.state.first_name,
      this.state.last_name,
      parseInt(this.state.school, 10)
    );
  };

  //ONBOARDING POPUP FUNCTIONS//

  toggleForgotURL() {
    this.setState({forgotURLActive: !this.state.forgotURLActive});
  }

  state = {
    forgotURLActive: this.props.route.forgotURLActive
  };


  render () {
    return (
      <div styleName="about">
        {this.props.loginPopupActive &&
          <LoginPopup login={this.props.login}
              changeEmail={this.props.changeEmail}
              changePassword={this.props.changePassword}
              toggleLoginPopup={this.props.toggleLoginPopup}
              toggleForgotPasswordPopup={this.props.toggleForgotPasswordPopup}
              toggleSignUpPopup={this.toggleSignUpPopup.bind(this)}
          />
        }

        {this.props.forgotPasswordPopupActive &&
          <ForgotPasswordPopup
              toggleLoginPopup={this.props.toggleLoginPopup}
              toggleForgotPasswordPopup={this.props.toggleForgotPasswordPopup}
          />
        }

        {this.state.forgotURLActive &&
          <ForgotPasswordPopup
            toggleLoginPopup={this.props.toggleLoginPopup}
            toggleForgotPasswordPopup={this.toggleForgotURL.bind(this)}
            resetKey={this.props.location.query.key}
          />
        }

        {this.props.onboardingStep &&
          <OnboardingPopup onboardingStep={this.props.onboardingStep}
              universitySuggestionList={this.props.universitySuggestionList}
              universityPopupActive={this.props.universityPopupActive}
              accountType={this.state.account_type}
              toggleSignUpPopup={this.toggleSignUpPopup.bind(this)}
              toggleLoginPopup={this.props.toggleLoginPopup}
              closeUniversitySuggestionList={this.props.closeUniversitySuggestionList}
              changeOnboardingStep={this.changeOnboardingStep.bind(this)}
              searchUniversity={this.searchUniversity.bind(this)}
              updateUniversity={this.updateUniversity.bind(this)}
              chooseAccountType={this.chooseAccountType.bind(this)}
              updateDetails={this.updateDetails.bind(this)}
              onboardingSubmit={this.onboardingSubmit.bind(this)}/>
        }

        <div className="horizontal-menu" styleName="navbar-top">
          <Link to='/'>
            <img styleName="logo" src="/img/home/educhat-white-logo.png" alt="Edu.chat Logo"/>
          </Link>
          <div styleName="about-signup-login">
            <span styleName="about-signup-button" onClick={() => this.toggleSignUpPopup(true)}>Sign Up</span>
            <span styleName="about-login-button" onClick={() => this.props.toggleLoginPopup()}>Log In</span>
          </div>
        </div>
        <ul className="horizontal-menu" styleName="navbar-bottom">
          <li><Link to='/chat/'>About</Link></li>
          <li><Link to='/mission'>Mission</Link></li>
          <li><Link to='/chat/team'>Team</Link></li>
          <li><Link to='/chat/press'>Press</Link></li>
          <li><Link to='/chat/careers'>Careers</Link></li>
          {/* <li><a href="http://edu.chat">Blog</a></li> */}
        </ul>
        <div id="about-content" style={backgroundStyle(this.props.route.backgroudUrl)}>
          <h1 styleName="about-title">{this.props.route.title}</h1>
        </div>
        <h3 styleName="about-top-text">
          {this.props.route.topText}
        </h3>
        <p styleName="about-bottom-text" dangerouslySetInnerHTML={{__html: this.props.route.bottomText}}/>
        {/*
          This will pass all this.props to children elements if the page has any.
          It's good to remember that the children elements for this component
          are anything that is added to the component(like the careers positions
          for example).
        */}
        {this.props.route.onPage &&
          React.cloneElement(this.props.route.onPage,
                             Object.assign({}, this.props.route, {styles: undefined}))
        }
      </div>
    );
  }
}

export default StaticPage;
