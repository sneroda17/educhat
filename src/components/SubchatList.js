import React, {PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import styles from "../styles/ChatListItem.css";
import cssModules from "react-css-modules";
import Chat from "../records/chat";
import {withPropagationStopped, onEnterKey} from "../helpers/events";

const propTypes = {
  subchats: ImmutablePropTypes.listOf(PropTypes.instanceOf(Chat)).isRequired,
  activeId: PropTypes.number.isRequired,
  openChat: PropTypes.func.isRequired,
  requestLoadSubchats: PropTypes.func.isRequired,
  allSubchatsLoaded: PropTypes.bool.isRequired,
  parentId: PropTypes.number,
  showSeeMoreButton: PropTypes.bool.isRequired
};
const SubchatList = ({subchats, activeId, openChat, requestLoadSubchats, allSubchatsLoaded, showSeeMoreButton}) =>
  <div>
    <div styleName="subchat-wrapper">
      <div styleName="subchat-container">
        <ul styleName="subchat-list">
          {subchats && subchats.map(subchat => {
            // alert(subchat);
            if (!subchat.is_bot)
              return (
                <li
                    key={subchat.id}
                    styleName={activeId === subchat.id ? "active" : ""}
                    onClick={withPropagationStopped(() => openChat(subchat.id, subchat.parent))}
                    onKeyDown={onEnterKey(withPropagationStopped(() =>
                      openChat(subchat.id, subchat.parent)
                    ))}
                    role="listItem"
                    tabIndex="0"
                >
                  <div styleName="bullet-class">
                    <div styleName="bullet-icon"/>
                    <div styleName="bullet-class-name">{subchat.name}</div>
                    {(subchat.unread_count > 0) ?
                      <div styleName={subchat.unread_count<=99 ? "unread-message-subchat" :"unread-message-subchat-large"}>
                        {subchat.unread_count<= 99 ? subchat.unread_count : "99+"}
                      </div>
                      :
                      ""
                    }
                  </div>
                </li>
              // </div>
              );
            else return null;
          })}
        </ul>
      </div>
    </div>
    {!allSubchatsLoaded && showSeeMoreButton &&
      <div
          styleName="create-seemore-container"
          onClick={requestLoadSubchats}
          onKeyDown={requestLoadSubchats}
          role="Button"
          tabIndex="0"
      >
        <div styleName="see-more-button">See More</div>
      </div>
    }
  </div>;

SubchatList.propTypes = propTypes;
export default cssModules(SubchatList, styles);
