import router from "@/router";
import tower, { towerController } from "@jarvis/tower-h5";
import { LocationQueryRaw } from "vue-router";
import { appendURLSearchParam, getSearchParams } from "@/utils/url";
import { showConfirmDialog, showToast } from "vant";

const { appInfo } = towerController || {};

export function getTower() {
  return tower;
}

export function getAppScheme() {
  return appInfo?.su_AppScheme || "";
}

export function isInSoucheApp() {
  return !!appInfo?.su_AppScheme;
}

export function NotInSoucheApp() {
  if (!isInSoucheApp()) {
    showToast("请前往大风车app中查看");
    // 微信小程序中不支持跳转到任意APP中
    // showConfirmDialog({
    //   title: "立即前往大风车app中查看",
    // })
    //   .then(() => {
    //     // on confirm
    //     window.location.href = "mars://";
    //   })
    //   .catch(() => {
    //     // on cancel
    //   });
    return true;
  }
  return false;
}

export const _isInSoucheApp = isInSoucheApp();

export function setTitle(title: string) {
  tower.nav.setTitle(title);
  document.title = title;
}

export function isIos() {
  return isInSoucheApp() && !appInfo.isAndroid;
}

export function getAppVersion() {
  return appInfo?.su_AppVersion || "2.0.8";
}

export function setTransparent(transparent: boolean) {
  tower.nav.setStyle({
    enable: !transparent,
    translucentMode: transparent,
    translucentStatusAndTitle: transparent,
    statusBarStyle: "dark",
  });
}

export function showClose(show: boolean) {
  tower.nav.setClose({
    show,
  });
}

let cachedHeight = 0;
export function getStatusBarHeight(cb: (h: number) => void) {
  if (cachedHeight) {
    cb(cachedHeight);
    return;
  }
  tower.nav.getStatusBarHeight({}, (error: any, data: { statusBarHeight: number }) => {
    if (error) {
      cb(22);
      return;
    }
    const ratio = isIos() ? 1 : window.devicePixelRatio;
    cachedHeight = (data?.statusBarHeight || 0) / ratio || cachedHeight;
    cb(cachedHeight);
  });
}

export function canGoback() {
  return !!history.state.back;
}

export function goBack() {
  if (!canGoback()) {
    tower.vc.close();
    return;
  }
  router.back();
}

export function closeContainer() {
  tower.vc.close();
}

export function closeWithCallback(data: Record<string, unknown>) {
  tower.vc.closeWithCallback(data);
}

export function openRNPage<T = void>(module: string, route: string, data?: object, cb?: CBE<T>) {
  tower.vc.open(
    {
      protocol: `${appInfo.su_AppScheme}://open/reactnative`,
      data: {
        module,
        props: { route, ...(data || {}) },
      },
    },
    (error: Error, data: T) => {
      cb?.(error, data);
    }
  );
}

/**
 * tower 的 triggleCallback
 * @param data
 */
export function trigglePageCallback(data: any) {
  tower.vc.triggleCallback(data, (error: any, data: any) => {
    if (error) console.error(error);
    console.log("tower.vc.triggleCallback", data);
  });
}

/**
 * 通过vue router path 打开页面
 * @param path vue router path
 * @param opt
 * @returns
 */
export function openH5PageByPath(path: string, opt?: { nav?: {}; query?: LocationQueryRaw; data?: Record<string, any> }) {
  const matched = router.resolve(path);
  const jarvisPageConfig = matched.meta?.jarvisPageConfig || (opt?.nav ? { nav: opt?.nav } : {});
  const data = opt?.query || opt?.data ? { ...opt?.query, ...opt?.data } : undefined;
  let openFunc = openH5Page;
  if (opt?.query?.isRepalcePage) {
    delete opt?.query?.isRepalcePage;
    openFunc = replaceH5Page;
  }
  return openFunc(buildUrl(path, opt?.query), { ...jarvisPageConfig, data: data });
}

export function openH5Page<T = void>(url: string, data?: any, cb?: CBE<T>) {
  return new Promise((r, j) => {
    tower.vc.open(
      {
        protocol: `${appInfo.su_AppScheme}://open/jarvisWebview`,
        data: { url, ...(data || {}) },
      },
      (error: Error, data: any) => {
        if (data?.type !== "triggerData") {
          return;
        }
        cb?.(error, data.triggerData);
        if (error) {
          j(error);
        } else {
          r(data.triggerData as T);
        }
      }
    );
  });
}

export function replaceH5Page<T = void>(url: string, data?: object, cb?: CBE<T>) {
  return new Promise((r, j) => {
    tower.vc.replace(
      {
        protocol: `${appInfo.su_AppScheme}://open/jarvisWebview`,
        data: { url, ...(data || {}) },
      },
      (error: Error, data: any) => {
        if (data?.type !== "triggerData") {
          return;
        }
        cb?.(error, data.triggerData);
        if (error) {
          j(error);
        } else {
          r(data.triggerData as T);
        }
      }
    );
  });
}

/**
 * 老的tower
 */
export function openH5PageTower<T = void>(url: string, config?: { hideNavBar?: boolean }) {
  return new Promise((r, j) => {
    tower.vc.open(
      {
        protocol: `${appInfo.su_AppScheme}://open/webv?url=${encodeURIComponent(url)}`,
        data: {
          url,
          hideNavBar: !!config?.hideNavBar,
        },
      },
      (error: Error, data: T) => {
        if (error) {
          j(error);
        } else {
          r(data);
        }
      }
    );
  });
}

export function invokeAgreement<T = void>(protocol: string, data?: object, cb?: CBE<T>) {
  tower.vc.open({ protocol, data }, cb);
}

export function enableRefresh(cb?: CB<void, Promise<any>>) {
  tower.pull.setEnable(!!cb);
  if (!cb) {
    return;
  }
  tower.pull.withListener(async (error: any, data: any, complate: CB) => {
    cb().finally(() => {
      complate?.();
    });
  });
}

/**
 * 获取容器打开时，上个页面传进来的的数据 data
 * @returns
 */
export async function getVCOpenData<T = any>() {
  return new Promise<T>((r, j) => {
    tower.vc.getWebVcData({}, (error: Error, data: T) => {
      if (error) {
        j(error);
        return;
      }
      r(data);
    });
  });
}

export type TowerMediaType = "video" | "image";
export function previewImage(images: Array<{ mediaUrl: string; mediaType: TowerMediaType } | string>, index = 0) {
  if (!images.length) {
    return;
  }
  const isVideo = (path: string) => /\.(mp4|avi|wmv|mpg|mov|swf|flv|webm|ogg)$/.test(path);
  tower.photo.browser({
    index,
    hasDelete: false,
    hasDowload: false,
    isLandscape: false,
    medias:
      typeof images[0] === "object"
        ? images
        : (images as string[]).map((i: string) => {
            return {
              mediaUrl: i,
              mediaType: isVideo(i) ? "video" : "image",
            };
          }),
  });
}

/**
 * 判断是否是url
 * @param str
 */
export function isUrl(str: string) {
  return /^https?:\/\//.test(str);
}

/**
 * vue router path to full url
 */
export function buildUrl(pathOrUrl: string, query?: Record<string, any>) {
  console.log("buildUrl", pathOrUrl, query);
  let url = pathOrUrl;
  if (!isUrl(pathOrUrl)) {
    url = `${location.protocol}//${location.host}${location.pathname}#${pathOrUrl}`;
  }
  url = appendURLSearchParam(url, query);
  return url;
}

export function copyText(content: string, cbe?: CBE) {
  tower.clipboard.set({ content }, (error: any, data: any) => {
    if (error) console.error(error);
    console.log("tower.clipboard.set", data);
    cbe?.(error);
  });
}
