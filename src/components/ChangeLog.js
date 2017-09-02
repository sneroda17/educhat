import React from "react";
import styles from "../styles/LeftPanel.css";
import cssModules from "react-css-modules";

// @CSSModules(styles)
// export default class ChangeLog extends PureComponent {
//   render() {
//     return (<div styleName="changeLog-container">
//       <ul> First batch of changes...
//         <li> test 1</li>
//         <li> test 2</li>
//       </ul>
//     </div>);
//   }
// }


const ChangeLog = () => {
  return (
    <div>
      <ul> First batch of changes...
        <li> test 1</li>
        <li> test 2</li>
      </ul>
    </div>
  );
};

export default cssModules(ChangeLog, styles);
