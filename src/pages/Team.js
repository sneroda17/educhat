import React from 'react';
import CSSModules from "react-css-modules";

import TeamMember from './TeamMember';
import styles from "../styles/Team.css";

const Team = props =>
  <div styleName="teamContainer">
    {props.members.map(member =>
      <TeamMember {...member}/>
    )}
  </div>;

export default CSSModules(Team, styles);
