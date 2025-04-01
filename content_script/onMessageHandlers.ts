import { ChatDetails, UrlCheckResult } from "../shared/types";
import { checkUrlType } from "../shared/utils";

export const onOpenPopup = async (): Promise<UrlCheckResult> => {
  const url = window.location.href;
  const urlType = checkUrlType(url);

  return urlType;
};

export const isChatSelected = async (): Promise<boolean> => {
  const path = window.location.pathname;
  return path.startsWith("/c/") || path.startsWith("/a/chat/s/");
};

export const getCurrentChatDetails = async (
  urlType: UrlCheckResult
): Promise<ChatDetails> => {
  const url = window.location.href;
  const path = window.location.pathname;
  if (urlType.isChatGPT) {
    const chatName = getInnerTextByHref();
    const chatID = path.split("/").pop() || "";
    const chatUrl = url;

    return { chatName, chatID, chatUrl };
  }

  const selectedChatDiv = document.getElementsByClassName("_83421f9 b64fb9ae");
  const innerText = (selectedChatDiv[0] as HTMLElement).innerText || null;
  const chatName = innerText;
  const chatID = path.split("/").pop() || "";
  const chatUrl = url;

  return { chatName, chatID, chatUrl };
};

function getInnerTextByHref() {
  const path = window.location.pathname;
  const links = document.getElementsByTagName("a");

  for (let link of links) {
    if (link.getAttribute("href") === path) {
      return link.innerText;
    }
  }
  return null;
}

export const navigateToChat = async (chatUrl: string) => {
  window.location.href = chatUrl;
};
