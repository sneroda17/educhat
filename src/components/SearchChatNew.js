import React, {PropTypes, PureComponent} from "react";
import SearchChatNewItem from "./SearchChatNewItem";
import SearchNoResultDisplay from "./SearchNoResultDisplay";
import styles from "../styles/LeftPanel.css";
import cssModules from "react-css-modules";
import WelcomeSearchMessage from "./WelcomeSearchMessage";

@cssModules(styles)
export default class DisplaySearchChatMine extends PureComponent {
  static propTypes = {
    isLeftPanelMakingSearchRequest: PropTypes.bool.isRequired,
    searchKeyword: PropTypes.string.isRequired,
    joinNewChatOrClass: PropTypes.func.isRequired,
    scrollTheLeftPanelDown: PropTypes.func.isRequired
  };

  renderNewChatsSearchResult = (
    searchKeyword, isLeftPanelMakingSearchRequest, searchNewChatResultList, joinNewChatOrClass) => {
    if (searchKeyword.trim().length === 0) {
      return <WelcomeSearchMessage searchMode={"new"}/>;
    } else {
      return (
        searchNewChatResultList.size === 0
          ?
            <SearchNoResultDisplay searchKeyword={searchKeyword}/>
          :
          searchNewChatResultList.toList().map((newChat) =>
            <SearchChatNewItem
                newChat={newChat}
                key={newChat.id}
                joinNewChatOrClass={joinNewChatOrClass}
            />
          )
      );
    }
  }

  render() {
    const {
      searchKeyword,
      isLeftPanelMakingSearchRequest,
      searchNewChatResultList,
      joinNewChatOrClass,
      scrollTheLeftPanelDown
    } = this.props;
    return(
      <div styleName="chat-container" onScroll={scrollTheLeftPanelDown}>
        {
          isLeftPanelMakingSearchRequest
            ?
              <img src="img/ring.gif" alt="loading chats" styleName="loading-ring"/>
            :
            this.renderNewChatsSearchResult(searchKeyword, isLeftPanelMakingSearchRequest,
              searchNewChatResultList, joinNewChatOrClass)
        }
      </div>
    );
  }
}
