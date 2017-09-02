import React from 'react';
import CSSModules from "react-css-modules";

import styles from '../styles/Careers.css';

const JobPosition = props =>
  <div>
    <div className="careersPosition">
      <h2>{props.title}</h2>
      <p dangerouslySetInnerHTML={{__html: props.description}}></p>
      <a href={props.applyFormUrl} styleName="careersApplyButton">Apply now</a>
    </div>
    <hr styleName="careerLineLimit"/>
  </div>

JobPosition.propTypes = {
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  applyFormUrl: React.PropTypes.string.isRequired
};

export default CSSModules(JobPosition, styles);
