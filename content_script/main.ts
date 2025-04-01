import { Message, MessageTypes, UrlCheckResult } from "../shared/types";
import {
  getCurrentChatDetails,
  navigateToChat,
  onOpenPopup,
} from "./onMessageHandlers";

const registerEventListeners = () => {
  chrome.runtime.onMessage.addListener(
    (message: Message, _sender, sendResponse) => {
      switch (message.type) {
        case MessageTypes.OPEN_POPUP: {
          onOpenPopup().then((urlValidation) => {
            sendResponse(urlValidation);
          });
          return true;
        }
        case MessageTypes.PULL_CURRENT_URL_TYPE: {
          getCurrentChatDetails(message.body?.urlType as UrlCheckResult).then(
            (chatDetails) => {
              sendResponse(chatDetails);
            }
          );
          return true;
        }
        case MessageTypes.NAVIGATE_TO_CHAT: {
          navigateToChat(message.body?.chatUrl as string);
          return true;
        }
        default:
          return false;
      }
    }
  );
};

(() => {
  registerEventListeners();
})();
