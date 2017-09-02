import React, {PropTypes, PureComponent} from "react";
import SearchPeopleItem from "./SearchPeopleItem";
import SearchNoResultDisplay from "./SearchNoResultDisplay";
import styles from "../styles/LeftPanel.css";
import cssModules from "react-css-modules";
import WelcomeSearchMessage from "./WelcomeSearchMessage";

@cssModules(styles)
export default class DisplaySearchChatMine extends PureComponent {
  static propTypes = {
    isLeftPanelMakingSearchRequest: PropTypes.bool.isRequired,
    searchKeyword: PropTypes.string.isRequired,
    createOneToOneChat: PropTypes.func.isRequired,
    scrollTheLeftPanelDown: PropTypes.func.isRequired
  };

  renderPeopleSearchResult = (
    searchKeyword, isLeftPanelMakingSearchRequest, searchPeopleResultList, createOneToOneChat) => {
    if (searchKeyword.trim().length === 0) {
      return <WelcomeSearchMessage searchMode={"people"}/>;
    } else {
      return (
        searchPeopleResultList.size === 0
          ?
            <SearchNoResultDisplay searchKeyword={searchKeyword}/>
          :
          searchPeopleResultList.toList().map((people) =>
            <SearchPeopleItem
                people={people}
                key={people.id}
                createOneToOneChat={createOneToOneChat}
            />
          )
      );
    }
  }

  render() {
    const {
      isLeftPanelMakingSearchRequest,
      searchPeopleResultList,
      searchKeyword,
      createOneToOneChat,
      scrollTheLeftPanelDown
    } = this.props;

    return(
      <div styleName="chat-container" onScroll={scrollTheLeftPanelDown}>
        {
          isLeftPanelMakingSearchRequest
            ?
              <img src="img/ring.gif" alt="loading chats" styleName="loading-ring"/>
            :
            this.renderPeopleSearchResult(searchKeyword, isLeftPanelMakingSearchRequest,
              searchPeopleResultList, createOneToOneChat)
        }
      </div>
    );
  }
}
