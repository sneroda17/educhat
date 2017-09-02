import React, {PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import ChatListItem from "./ChatListItem";
import NoChatsOrClassesDisplay from "./NoChatsOrClassesDisplay";
import cssModules from "react-css-modules";
import styles from "../styles/LeftPanel.css";
import Chat from "../records/chat";
import User from "../records/user";

const propTypes = {
  chats: ImmutablePropTypes.orderedMapOf(PropTypes.instanceOf(Chat)),
  findUserFirstNameById: PropTypes.func.isRequired,
  openChat: PropTypes.func.isRequired,
  requestLoadSubchats: PropTypes.func.isRequired,
  parentId: PropTypes.number,
  activeChatId: PropTypes.number,
  allSubchatsLoaded: PropTypes.bool,
  toggleSubchatCreation: PropTypes.func.isRequired,
  rightPanelActive: PropTypes.bool,
  closeRightPanel: PropTypes.func.isRequired,
  createNewBotSubchat: PropTypes.func.isRequired,
  isBotSubChat: PropTypes.bool.isRequired,
  isShowingClasses: PropTypes.bool.isRequired,
  totalChatsCount: PropTypes.number.isRequired,
  totalClassesCount: PropTypes.number.isRequired,
  showSeeMoreButton: PropTypes.bool
};

const defaultProps = {
  chats: null,
  parentId: null,
  activeChatId: 0,
  allSubchatsLoaded: false,
  rightPanelActive: false,
  showSeeMoreButton: false
};

const ChatList = ({chats, findUserFirstNameById, openChat, requestLoadSubchats, parentId,
                  activeChatId, allSubchatsLoaded, showSeeMoreButton, toggleSubchatCreation,
                  rightPanelActive, closeRightPanel, unreadMessages, createNewBotSubchat,
                    isBotSubChat, isShowingClasses, totalChatsCount, totalClassesCount
                  }) => {
  if ((totalClassesCount === 0 && isShowingClasses)
    || (totalChatsCount === 0 && !isShowingClasses)) {
    return (
      <div styleName="chat-container">
        <NoChatsOrClassesDisplay isShowingClasses={isShowingClasses}/>
      </div>
    );
  }
  // eslint-disable-next-line
  return (
    <div>
      <div styleName="chat-list-inner-container">
        {chats.toArray().map((chat) =>
          !chat.parent && (chat.is_class === isShowingClasses) &&
          <ChatListItem
              key={chat.id}
              chat={chat}
              getFirstName={findUserFirstNameById}
              openChat={openChat}
              requestLoadSubchats={requestLoadSubchats}
              isOpen={(parentId || activeChatId) === chat.id}
              activeId={activeChatId || -1}
              allSubchatsLoaded={allSubchatsLoaded}
              subchats={chat.subchats.map(id => chats.get(id))}
              toggleSubchatCreation={toggleSubchatCreation}
              rightPanelActive={rightPanelActive}
              closeRightPanel={closeRightPanel}
              unreadMessages={unreadMessages}
              createNewBotSubchat={createNewBotSubchat}
              isBotSubChat={isBotSubChat}
              parentId={parentId}
              showSeeMoreButton={showSeeMoreButton}
          />
        )}
      </div>
    </div>
  );
};

ChatList.propTypes = propTypes;
ChatList.defaultProps = defaultProps;

export default cssModules(ChatList, styles);
