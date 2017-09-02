import React, {PropTypes, PureComponent} from "react";
import SearchChatMineItem from "./SearchChatMineItem";
import SearchNoResultDisplay from "./SearchNoResultDisplay";
import WelcomeSearchMessage from "./WelcomeSearchMessage";
import styles from "../styles/LeftPanel.css";
import cssModules from "react-css-modules";

@cssModules(styles)
export default class DisplaySearchChatMine extends PureComponent {
  static propTypes = {
    isLeftPanelMakingSearchRequest: PropTypes.bool.isRequired,
    findUserFirstNameById: PropTypes.func.isRequired,
    searchKeyword: PropTypes.string.isRequired,
    switchToThisChatOrClass: PropTypes.func.isRequired,
    scrollTheLeftPanelDown: PropTypes.func.isRequired
  };

  renderChatsSearchResult = (
    searchKeyword, searchChatsMineResult, findUserFirstNameById, switchToThisChatOrClass) => {
    if (searchKeyword.trim().length === 0) {
      return <WelcomeSearchMessage searchMode={"mine"}/>;
    } else {
      return (
        searchChatsMineResult.size === 0
          ?
            <SearchNoResultDisplay searchKeyword={searchKeyword}/>
          :
          searchChatsMineResult.toList().map((chat) =>
            <SearchChatMineItem
                chat={chat}
                getFirstName={findUserFirstNameById}
                key={chat.get("id")}
                switchToThisChatOrClass={switchToThisChatOrClass}
            />
          )
      );
    }
  }

  render() {
    const {searchKeyword, isLeftPanelMakingSearchRequest,
      searchChatsMineResult, findUserFirstNameById, switchToThisChatOrClass,
      scrollTheLeftPanelDown} = this.props;
    return(
      <div styleName="chat-container" onScroll={scrollTheLeftPanelDown}>
        {
          isLeftPanelMakingSearchRequest
            ?
              <img src="img/ring.gif" alt="loading chats" styleName="loading-ring"/>
            :
            this.renderChatsSearchResult(searchKeyword,
              searchChatsMineResult, findUserFirstNameById, switchToThisChatOrClass)
        }
      </div>
    );
  }
}
