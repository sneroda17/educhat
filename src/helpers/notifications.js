import * as firebase from "firebase";

export function getBrowserNotificationStatus() {
  if(Notification in window) {
    const permission = Notification.permission;
    if(permission === "denied" || permission === "granted") {
      return;
    }
  }
  Notification.requestPermission();
}

export function notify(message, user, onClick) {
  getBrowserNotificationStatus();
  const body = `${user.first_name} says: ${message.text}`;
  const options = {
    body,
    icon: "https://edu.chat/img/educhat-logo2.png"
  };
  /* const notification = new Notification("New message on Edu.Chat", options);
  notification.onclick = () => {
    onClick();
    window.focus();
    notification.close();
  }; */
}

export function getFireBaseToken() {
  const config = {
    apiKey: "AIzaSyCEwtlz07Q4jvkleCkJXiJhaQqSli3r7JY",
    authDomain: "edu-chat-3a29d.firebaseapp.com",
    databaseURL: "https://edu-chat-3a29d.firebaseio.com",
    projectId: "edu-chat",
    storageBucket: "edu-chat.appspot.com",
    messagingSenderId: "662093183648"
  };
  firebase.initializeApp(config);
  const messaging = firebase.messaging();
  messaging.onMessage((payload) => {
    console.log("Just got a new message! ", payload);
  });
  const token = messaging.requestPermission().then(() => {
    return messaging.getToken();
  }).catch((err) => {
    console.warn("User denined notifications ", err);
  });
  return token;
}
