import { onUnmounted } from "vue";
import { getDefaultPool } from "./taskPool";
import { buildUrl } from "./tower";
import { getSearchParams } from "@/utils/url";

declare global {
  interface Window {
    wx: any;
    __wxjs_environment?: string;
    WeixinJSBridge?: any;
  }
}

const WEBVIEW_ID = getSearchParams(window.location.href)["webviewId"] as string;
export const isInWx = /MicroMessenger/.test(window.navigator.userAgent);

function invokeMini<T = any>(action: string, data: any, miniPage: string, idRef?: Array<string>) {
  return new Promise<T>((r, j) => {
    if (idRef) {
      const id = getDefaultPool().store((data) => {
        console.log("invokeMiniAction result", data);
        if (!data) {
          return j(new Error("data is null"));
        }
        if (!data?.success) {
          return j(new Error(data.error));
        }
        r(data.data);
      }, true);
      idRef.unshift(id);
    }

    let wxFunc = window.wx.miniProgram.navigateTo;
    if (data?.repacleWeb) {
      delete data?.repacleWeb;
      wxFunc = window.wx.miniProgram.redirectTo;
    }
    const req = {
      callbackUrl: buildUrl("/miniBridge"),
      callbackId: idRef?.[0] || "-1",
      webviewId: WEBVIEW_ID,
      action,
      data,
    };
    console.log("send bridge", req);
    console.log("wxFunc", wxFunc);
    wxFunc({
      url: `${miniPage}?data=${encodeURIComponent(JSON.stringify(req))}`,
    });
  });
}

export function invokeMiniCallback() {
  const pms = getSearchParams(window.location.href);
  const callbackId = pms["callbackId"] as string;
  if (!callbackId || callbackId == "-1") {
    return;
  }
  const callbackData = pms["data"] as string;
  console.log("callbackId", callbackId, callbackData, JSON.parse(decodeURIComponent(callbackData)));
  if (callbackData) {
    getDefaultPool().execute(callbackId, JSON.parse(decodeURIComponent(callbackData)));
  } else {
    getDefaultPool().execute(callbackId);
  }
}

export type IWXRouter = ReturnType<typeof useWxRouter>;

export function useWxRouter() {
  const cbids: string[] = [];
  onUnmounted(() => {
    cbids.forEach((id) => {
      getDefaultPool().remove(id);
    });
  });
  return {
    invokeAction: function (action: string, data?: any) {
      return invokeMini(action, data, "/pages/bridge/index", cbids);
    },
    openWeb: function (url: string, pageTitle?: string) {
      return invokeMini(
        "",
        {
          url,
          title: pageTitle,
        },
        "/pages/webview/index",
        cbids
      );
    },
    repacleWeb: function (url: string, pageTitle?: string) {
      return invokeMini(
        "",
        {
          url,
          title: pageTitle,
          repacleWeb: true,
        },
        "/pages/webview/index",
        cbids
      );
    },
  };
}
