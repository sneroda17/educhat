import React from 'react';
import CSSModules from "react-css-modules";

import styles from '../styles/TeamMember.css';

const TeamMember = props =>
  <div styleName="teamMember">
    <img styleName="memberPhoto" src={props.photoUrl} alt={`${props.name}`}/>
    <h2>{props.name}</h2>
    <p>{props.title}</p>
  </div>;


export default CSSModules(TeamMember, styles);
