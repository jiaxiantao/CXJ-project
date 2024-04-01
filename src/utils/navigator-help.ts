import router from "@/router";
import { getDefaultPool } from "./taskPool";
import {
  _isInSoucheApp,
  buildUrl,
  canGoback,
  getTower,
  isUrl,
  openH5Page,
  openH5PageByPath,
  trigglePageCallback as trigglePageCallbackTower,
} from "./tower";
import { KEY_REQUEST_TOKEN, KEY_ROUTER_CALLBACK_ID } from "@/constant";
import { onUnmounted } from "vue";
import { LocationQueryRaw } from "vue-router";
import { IWXRouter, isInWx, useWxRouter } from "./wx";
import { getTokenFromSession, getUserToken } from "./token";

export function useNavigatorHelper() {
  const ids: string[] = [];
  const taskPool = getDefaultPool();
  const callbackId = router.currentRoute.value.query[KEY_ROUTER_CALLBACK_ID] as string;
  onUnmounted(function () {
    setTimeout(() => {
      ids.forEach((id) => {
        taskPool.remove(id);
      });
    }, 100);
  });

  const triggerPageCallback = (data: any) => {
    if (callbackId) {
      taskPool.execute(callbackId, data);
    } else {
      window.wx.miniProgram.postMessage({ data });
      trigglePageCallbackTower(data);
    }
  };

  const wxRouter = isInWx ? useWxRouter() : null;

  const openAppPage = function (
    path: string,
    opt?: {
      query?: LocationQueryRaw | Record<string, any>;
      data?: Record<string, any>;
      newContainer?: boolean;
      title?: string;
      translucentMode?: boolean;
      nav?: {};
    }
  ) {
    if (opt?.newContainer) {
      if (_isInSoucheApp) {
        if (opt.translucentMode) {
          opt.nav = { enable: false, translucentMode: true, translucentStatusAndTitle: true, statusBarStyle: "dark" };
        }
        return openH5PageByPath(path, opt);
      }
      if (isInWx) {
        let wxRouterFunc = wxRouter!.openWeb;
        if (opt?.query?.isRepalcePage) {
          delete opt?.query?.isRepalcePage;
          wxRouterFunc = wxRouter!.repacleWeb;
        }
        return getUserToken().then((token) => {
          const url = buildUrl(path, {
            ...opt?.query,
            callBackType: "wx",
            // 微信中必须携带token跳到下一个页面
            [KEY_REQUEST_TOKEN]: token,
          });
          let title = "";
          if (isUrl(path)) {
            title = opt?.title || "";
          } else {
            title = opt?.title || (router.resolve({ path })?.meta?.title as string);
          }
          console.log("wxRouterFunc:", wxRouterFunc);
          return wxRouterFunc(url, title);
        });
      }
    }
    return new Promise((r, j) => {
      const id = taskPool.store((data) => {
        r(data);
      }, false);
      ids.push(id);
      let routerFunc = router.push;
      if (opt?.query?.isRepalcePage) {
        delete opt?.query?.isRepalcePage;
        routerFunc = router.replace;
      }
      routerFunc({
        path,
        query: {
          [KEY_ROUTER_CALLBACK_ID]: id,
          ...(opt?.query || {}),
        },
      });
    });
  };

  const closePage = () => {
    if (!canGoback()) {
      getTower().vc.close();
      if (isInWx) {
        window.wx.miniProgram.navigateBack();
      }
      return;
    }
    router.back();
  };

  const closeWithCallback = (data: any) => {
    triggerPageCallback(data);
    closePage();
  };

  return {
    openAppPage,
    triggerPageCallback,
    closeWithCallback,
    closePage,
  };
}

export type INavigatorHelper = ReturnType<typeof useNavigatorHelper>;

export function chooseStaff(nav: IWXRouter, opt?: { title?: string; selectedId?: string }) {
  // const url = `http://172.18.53.156:8080/#/?id=${opt?.selectedId || ""}&token=${getTokenFromSession()}&callbackType=${isInWx ? "wx" : ""}`;
  const url = `${import.meta.env.VITE_APP_H5_PAGE}/projects/Mars_WEB/web-app-mars-saler-selector/#/?id=${
    opt?.selectedId || ""
  }&token=${getTokenFromSession()}&callbackType=${isInWx ? "wx" : ""}`;
  if (_isInSoucheApp) {
    return openH5Page(url);
  }
  return nav.openWeb(url);
}
