import React from 'react';
import { Link } from 'react-router';
import CSSModules from "react-css-modules";

import styles from '../styles/HomePage.css';

const HomePage = (props) =>
  <div styleName="homePage-container">
    <Link to="/">
      <img className="logo" src="img/home/educhat-white-logo.png" alt="edu.chat logo"/>
    </Link>
    <ul className="horinzontal-menu" styleName="navbar-left">
      <li><a href="">Blog</a></li>
      <li><a href="">Help</a></li>
      <li><Link to="/about">About Us</Link></li>
    </ul>
    <div styleName="button-login">Log In</div>
    <div styleName="home-title">
      <h1>Stay connected, academically</h1>
      <h3>Engage and collaborate with people in your classes, labs, and groups</h3>
    </div>
    <Link styleName="signup-button" to="/about">Learn more</Link>
    <ul className="horinzontal-menu" styleName="footer">
      <li><a href="">Privacy</a></li>
      <li><a href="">Terms of Service</a></li>
      <li><a href="">Internships</a></li>
    </ul>
  </div>

export default CSSModules(HomePage, styles);
