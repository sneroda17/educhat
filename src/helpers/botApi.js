export function forwardQuestionApi(chatId, question) {
  const questionId = question.id;
  const data = new FormData();
  data.append("chat_id", chatId);
  data.append("question_id", questionId);
  fetch("https://bot.edu.chat/forwardToProf/", {
    method: "POST",
    body: data
  }).then((res) => {
    console.log("we get this ", res);
  }).catch((err) => {
    console.log("soethig is wrong ", err);
  });
}
