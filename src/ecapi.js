/* eslint-disable camelcase */

import {HttpClient, json} from "aurelia-fetch-client";
import io from "socket.io-client";

import {getStorageItem} from "./helpers/storage";
import {CursorPaginator, Paginator} from "./helpers/paginator";

export const AUTH_ERROR = {valueOf: () => "Not Authorized"};

// export const API_BASE = "http://localhost:8001/v1/";
export const API_BASE = "https://api.edu.chat/v1/";
export const BOT_BASE = "http://bot.edu.chat:8080/";
export const SOCKET_BASE = "https://socket.edu.chat/";

export function connectSocket(reconnectionDelayMax = 30000) {
  return io(SOCKET_BASE, {
    query: `token=${getStorageItem("token")}`,
    reconnectionDelayMax
  });
}

const apiClient = new HttpClient();
apiClient.configure(config => config
  .useStandardConfiguration()
  .withBaseUrl(API_BASE)
);

const botClient = new HttpClient();
botClient.configure(config => config
  .useStandardConfiguration()
  .withBaseUrl(BOT_BASE)
);

export const makeEduChatRequest = (api = apiClient, bot = botClient) =>
  async (url, method, data = {}, useBotApi = false, authRequired = true,
         returnRawResponse = false) => {
    const token = getStorageItem("token");

    if (authRequired && !token) throw AUTH_ERROR;

    let body;
    if (method.toUpperCase() === "GET") {
      let doneFirstArg = false;
      for (const key in data) if (data.hasOwnProperty(key)) {
        const val = data[key];
        if (val === undefined) continue;

        if (doneFirstArg) {
          url += "&";
        } else {
          url += "?";
          doneFirstArg = true;
        }

        url += `${key}=${encodeURIComponent(typeof val !== "object" ? val : JSON.stringify(val))}`;
      }
    } else {
      body = json(data);
    }

    try {
      const response = await (useBotApi ? bot : api).fetch(url, {
        method,
        body,
        headers: authRequired ? {
          Authorization: `Token ${token}`
        } : {}
      });
      // APIs that delete something return nothing when successful(204 HTTP status)
      // so we don't need to proccess the response
      if (response.status === 204) {
        return undefined;
      }
      const responseJSON = await response.json();
      if (returnRawResponse) {
        return responseJSON;
      } else {
        // TODO those errors should go to the catch block
        const apiResult = responseJSON.results;
        // const userError = responseJSON.alert; // TODO: errors for the user
        responseJSON.console && console.error(responseJSON.console); // shows an error for the devs
        return apiResult;
      }
      // aurelia-fetch-client throws the actual response object on an error code
    } catch (errResp) {
      if (errResp.status === 401) {
        throw AUTH_ERROR;
      } else {
        const errText = await errResp.text();
        let err;
        try {
          err = JSON.parse(errText);
          console.error(err);
        } catch (_) {
          err = {text: errText};
          console.error(errText);
        }
        throw err;
      }
    }
  };

// All of the below API functions follow the convention of:
// required arguments are standard parameters,
// while optional arguments are passed in an object as the last argument

export const makeEcapi = (eduChatRequest = makeEduChatRequest()) => {
  const ecapi = {
    logout: () => eduChatRequest("api/logout/", "POST", {platform: "web"}),

    login: (username, password) =>
      eduChatRequest("api/login/", "POST", {username, password, platform: "web"}, false, false),


    institution: {
      getUniversities: (name) =>
        new CursorPaginator("institution/university/",
          "GET", {name__icontains: name}, false, false),

      getSchools: (name) =>
        new CursorPaginator("institution/school/",
          "GET", {name__icontains: name}, false, false)
    },


    chat: {
      create: (name, is_class, parent, {description, color, picture_file, searchable, is_anonymous,
               is_read_only, add_new_users_from_parent, course_code, is_bot} = {}) =>
        eduChatRequest("chat/", "POST", {
          name,
          is_class,
          parent,
          description,
          color,
          picture_file,
          searchable,
          is_anonymous,
          is_read_only,
          add_new_users_from_parent,
          course_code,
          is_bot
        }),

      changeDetails: async (id, {chat_name, chat_desc} = {}) => {
        const changeName = typeof chat_name === "string";
        const changeDesc = typeof chat_desc === "string";
        if (!changeName && !changeDesc) return undefined;

        return await eduChatRequest(`chat/${id}/`, "PATCH", {
          name: chat_name,
          description: chat_desc
        });
      },

      changePicture: async (id, chat_picture) => {
        const changePic = typeof chat_picture === "number";
        if (!changePic) return undefined;

        return await eduChatRequest(`chat/${id}/`, "PATCH", {
          picture_file: chat_picture
        });
      },

      changeAddNewUsersFromParentChat: async (id, {ifSubchatInviteAll} = {}) => {
        return await eduChatRequest(`chat/${id}/`, "PATCH", {
          add_new_users_from_parent: ifSubchatInviteAll
        });
      },

      delete: (id) => eduChatRequest(`chat/${id}/`, "DELETE"),

      getMessages: (id) => new Paginator(`message/`, "GET", {chat: id}),

      getChats: ({parent} = {}) => new CursorPaginator("chat/", "GET", {parent}),

      getResources: (id) => new CursorPaginator(`chat/${id}/resources/`, "GET"),

      getPrivilegedUsers: (chat) => eduChatRequest("chat_user/", "GET", {chat, privileged: true})
    },

    tag: {
      addTag: (userId, tagName) => eduChatRequest("tag/user/", "POST", {user: userId, tag: tagName})

    },


    // I don't know which of these methods require auth, so I'm assuming they all do for now
    // I'm also basically guessing at which args are required
    bot: {
      activate: (chat_id) => eduChatRequest("create_chat_bot/", "POST", {chat_id}, true),

      sendAnswer: (chat_id, question_id, answer) =>
        eduChatRequest("send_answer/", "POST", {chat_id, question_id, answer}, true),

      getTags: (text) => eduChatRequest("get_tags/", "POST", {text}, true),

      addQuestionAnswerPair: (chat_id, user_id, question, answer, {tags} = {}) =>
        eduChatRequest("add_question_answer_pair/", "POST", {
          chat_id,
          user_id,
          question,
          answer,
          tags
        }, true),

      upvoteAnswer: (answer_id) => eduChatRequest("upvote_answer/", "POST", {answer_id}, true),

      verifyAnswer: (answer_id) => eduChatRequest("verify_answer/", "POST", {answer_id}, true),

      addUsers: (user_list) => eduChatRequest("join_chat_group/", "POST", {user_list}, true),

      getAllQuestions: (chat_id) =>
        eduChatRequest("view_questions_answers", "POST", {chat_id}, true),

      markQuestionSimilar: (question, similar_question_id) =>
        eduChatRequest("similar_question/", "POST", {question, similar_question_id}, true),

      makeAdmin: (chat_id, user_id) =>
        eduChatRequest("make_admin", "POST", {chat_id, user_id}, true),

      getAnswers: (question_id) => eduChatRequest("view_answers/", "POST", {question_id}, true),

      allowCrowdsourcing: (chat_id, admins_only) =>
        eduChatRequest("crowdsource_admins_only/", "POST", {chat_id, admins_only}, true)
    },


    chatUser: {
      add: (chats, users) =>
        eduChatRequest("chat_user/", "POST", {
          chat: JSON.stringify(chats),
          user: JSON.stringify(users)
        }),

      leave: (chatId, userId) => eduChatRequest(`chat_user/${chatId}/${userId}/`, "DELETE", {}),

      getChat: (chat) => eduChatRequest("chat_user/", "GET", {chat}, false, true),

      getAll: (chat) => new CursorPaginator("chat_user/", "GET", {chat})
    },


    file: {
      create: async (file, name) => {
        // FIXME: Is there any reason this needs to be form data and can't use eduChatRequest?
        const form = new FormData();
        form.append("upload", file);
        form.append("name", name);
        try {
          const response = await apiClient.fetch(API_BASE + "file/", {
            method: "post",
            headers: {
              "Authorization": "Token " + getStorageItem("token")
            },
            body: form
          });

          return await response.json();
        } catch (errResp) {
          if (errResp.status === 401) {
            throw AUTH_ERROR;
          } else {
            const errText = await errResp.text();
            let err;
            try {
              err = JSON.parse(errText);
              console.error(err);
            } catch (_) {
              err = {text: errText};
              console.error(errText);
            }
            throw err;
          }
        }
      },

      createAndSend: async (chat, user, file, name, extension, {text = "", parent} = {}) => {
        const fileUploaded = await ecapi.file.create(file, name);
        const id = fileUploaded.results.id;
        return await ecapi.message.send(chat, user, text, {parent, file: id});
      }
    },


    message: {
      send: (chat, user, text, {type = "t", parent, is_question, file} = {}) =>
        eduChatRequest("message/", "POST", {chat, user, text, type, parent, is_question, file}),

      delete: (id) => eduChatRequest(`message/${id}/`, "DELETE"),

      get: (id) => eduChatRequest(`message/${id}/`, "GET"),

      edit: (id, text) => eduChatRequest(`message/${id}/`, "PATCH", {text}),

      getComments: (chat, parent) => new CursorPaginator("message/", "GET", {chat, parent})
    },


    // Search and edit are currently broken due to backend issues
    user: {
      search: (first_name, {last_name} = {}) =>
        new CursorPaginator("user/", "GET", {first_name, last_name}),

      get: (id) => eduChatRequest("user/", "GET", {id}),

      edit: (id, first_name, last_name, email, university, type, school, department,
             year_of_graduation, picture_file) =>
        eduChatRequest(`user/${id}/`, "PATCH", {
          first_name,
          // last_name,
          picture_file,
          // email,
          // university,
          // type,
          school
          // department,
          // year_of_graduation
        }),

      // edit: (id, first_name) =>
      //   eduChatRequest(`user/${id}/`, "PATCH", {
      //     first_name
      //   }),

      create: (email, password, first_name, last_name, university,
               {type = "s", school, department, year_of_graduation, picture_file = "1"} = {}) =>
        eduChatRequest("user/signup/", "POST", {
          email,
          password,
          first_name,
          last_name,
          university,
          type,
          school,
          department,
          year_of_graduation,
          picture_file
        }, false, false),

      forgotPasswordRequest: (email) =>
        eduChatRequest("password/request/", "POST", {email}, false, false),

      forgotPasswordReset: (password, key) =>
        eduChatRequest("password/reset/", "POST", {key, password}, false, false)
    }
  };
  return ecapi;
};

export default makeEcapi();
