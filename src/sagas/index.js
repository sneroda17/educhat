import activeChat from "./active-chat";
import currentUser from "./current-user";
import chats from "./chats";
import classes from "./classes";
import uiSagas from "./ui";
import socketSagas from "./socket-event-handlers";
import botChatSagas from "./bot-chat";

export default function*() {
  yield [
    ...uiSagas,
    activeChat(),
    currentUser(),
    chats(),
    classes(),
    socketSagas(),
    botChatSagas()
  ];
}
