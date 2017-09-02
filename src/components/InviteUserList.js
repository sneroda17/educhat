import React, {PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import styles from "../styles/InviteBox.css";
import cssModules from "react-css-modules";
import User from "../records/user";
import {onEnterKey} from "../helpers/events";

const propTypes = {
  removeUserFromInviteList: PropTypes.func.isRequired,
  inviteList: ImmutablePropTypes.orderedSetOf(PropTypes.instanceOf(User)).isRequired
};

const InviteUserList = ({removeUserFromInviteList, inviteList}) => {
  return (
    <div styleName="invited-user-list" className="invited-user-list">
      {inviteList.reverse().map(user => {
        if (user.first_name) {
          const userName = `${user.first_name} ${user.last_name}`;
          return (
            <div key={user.id}>
              <div styleName="user">
                <img styleName="user-img" src={user.picture_file.url} alt={user.first_name}/>
                <div styleName="user-name">{userName}</div>
                <img
                    styleName="remove-btn"
                    src="img/ic_cancel_black_24px.svg"
                    alt="delete-user"
                    tabIndex="0"
                    role="button"
                    key={user.id}
                    onClick={() => removeUserFromInviteList(user)} // eslint-disable-line
                    onKeyDown={onEnterKey(() => removeUserFromInviteList(user))}
                />
              </div>
            </div>
          );
        } else {
          return (
            <div styleName="user" key={user.email}>
              <img styleName="user-img" src="img/ic_email_black_48px.svg" alt="email-user"/>
              <div styleName="user-name">{user.email}</div>
              <img
                  styleName="remove-btn"
                  src="img/ic_cancel_black_24px.svg"
                  alt="delete-user"
                  tabIndex="0"
                  role="button"
                  key={user.id}
                  onClick={() => removeUserFromInviteList(user)} // eslint-disable-line
                  onKeyDown={onEnterKey(() => removeUserFromInviteList(user))}
              />
            </div>
          );
        }
      })}
    </div>
  );
};

InviteUserList.propTypes = propTypes;

export default cssModules(InviteUserList, styles);
