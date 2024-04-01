// 缓存的token
import { KEY_REQUEST_TOKEN } from "@/constant";
import { isInSoucheApp } from "@/utils/tower";
import tower from "@jarvis/tower-h5";
import { getSearchParams } from "@/utils/url";

// 这里保存在sessionStorage中，避免热更新后cacheToken丢失，导致接口请求失败
let cacheToken: string | null = sessionStorage.getItem(KEY_REQUEST_TOKEN) || import.meta.env.VITE_APP_TOKEN;

/**
 * @description: 从app中获取token
 */
function getUserTokenFromApp() {
  console.log("getUserTokenFromApp");
  return new Promise<string>((resolve) => {
    if (!isInSoucheApp()) {
      console.log("not in souche app", "getUserTokenFromApp");
      resolve("");
      return;
    }

    tower.invokeModule("mars://getUserInfo/mainReceiver", {}, (error: Error, data: { user?: IUser }) => {
      console.log("getUserTokenFromApp", data?.user?.token);
      resolve(data?.user?.token || "");
    });
  });
}

/**
 * @description: 获取用户token
 */
export async function getUserToken() {
  if (isInSoucheApp()) {
    return await getUserTokenFromApp();
  }
  // 如果不在大风车app中，从缓存中获取token
  console.log("getCacheUserToken", cacheToken);
  return cacheToken || "";
}

/**
 * @description: 设置用户token
 * @param token
 */
export function setUserToken(token: string) {
  cacheToken = token;
  sessionStorage.setItem(KEY_REQUEST_TOKEN, token);
}

export function getTokenFromSession() {
  return sessionStorage.getItem(KEY_REQUEST_TOKEN);
}

/**
 * @description: 从url中获取token
 */
export function saveTokenByURL() {
  const sp = getSearchParams(location.href);
  const token = sp[KEY_REQUEST_TOKEN];
  if (token) {
    setUserToken(token);
  }
}
