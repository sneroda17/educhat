import React from 'react';
import CSSModules from "react-css-modules";

import styles from '../styles/Careers.css';
import CareerPosition from './CareerPosition';

const Careers = props =>
  <div styleName="careersContainer">
    <h1 styleName="careersTitle">Positions</h1>
    {props.positions.map((position) => <CareerPosition {...position}/>)}
  </div>

export default CSSModules(Careers, styles);
