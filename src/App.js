import React, {PureComponent, PropTypes} from "react";
import styles from "./styles/App.css";
import cssModules from "react-css-modules";
import {Router, Route, browserHistory} from "react-router";
import connect from "./helpers/connect-with-action-types";
import NotFound from "./pages/404";
import LoginPopup from "./components/LoginPopup";
import OnboardingPopup from "./components/OnboardingPopup";
import ChangeLog from "./components/ChangeLog";
import EduChatPanel from "./containers/EduChatPanel";
import ForgotPasswordPopup from "./components/ForgotPasswordPopup";
import ResetPasswordPopup from "./components/ResetPasswordPopup";

@connect(state => ({
  isLoggedIn: state.currentUser.isLoggedIn
}))
@cssModules(styles)
class App extends PureComponent {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired
  };

  renderEduChat() {
    return (
      <Router history={browserHistory} key={1}>
        <Route exact path="/" component={EduChatPanel}/>
        <Route exact path="/changelog" component={ChangeLog}/>
        <Route path="/*" component={NotFound}/>
      </Router>
    );
  }

  renderLandingPage() {
    return (
      <Router history={browserHistory} key={0}>
        <Route path="/" component={LoginPopup}/>
        <Route path="/onboarding" component={OnboardingPopup}/>
        <Route path="/chat/password/reset(/:key?)" component={ResetPasswordPopup}/>
        <Route path="/password/reset" component={ForgotPasswordPopup}/>
        <Route path="/*" component={NotFound}/>
      </Router>
    );
  }

  render() {
    const {isLoggedIn} = this.props;

    return (
      <div>
        {isLoggedIn ? this.renderEduChat() : this.renderLandingPage()}
      </div>
    );
  }
}

export default App;
