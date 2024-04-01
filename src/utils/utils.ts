import { setUserToken } from "@/utils/token";
import { KEY_REQUEST_TOKEN } from "@/constant";

export function isProd() {
  return import.meta.env.VITE_APP_ENV === "production";
}

export function isDev() {
  return import.meta.env.VITE_APP_ENV === "development";
}

export function isNotProd() {
  return import.meta.env.VITE_APP_ENV !== "production";
}

export function checkIsInWxMiniProgram() {
  return new Promise((resolve) => {
    if (!/MicroMessenger/.test(window.navigator.userAgent)) {
      resolve(false);
      return;
    }

    if (!window.wx) {
      if (!window.WeixinJSBridge || !window.WeixinJSBridge.invoke) {
        document.addEventListener(
          "WeixinJSBridgeReady",
          () => {
            resolve(window.__wxjs_environment === "miniprogram");
          },
          false
        );
      } else {
        resolve(window.__wxjs_environment === "miniprogram");
      }
    } else {
      window.wx.miniProgram.getEnv((res: { miniprogram: boolean }) => {
        resolve(res.miniprogram);
      });
    }
  });
}

export function throttle(
  callback: (args?: any) => void,
  delay = 300
): {
  (args?: any): void;
  cancel: () => void;
} {
  let timeRef: any = 0;
  const fn = function (...args: any) {
    clearTimeout(timeRef);
    timeRef = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
  fn.cancel = function () {
    clearTimeout(timeRef);
  };
  return fn;
}

export function isDef<T>(val: T | undefined | null): val is T {
  return val !== null && val !== undefined;
}

export function isNumberLike(val: string | number | null | undefined) {
  if (typeof val === "number") {
    return true;
  }
  if (!isDef(val)) {
    return false;
  }
  if (val.trim() === "") {
    return false;
  }
  if (isNaN(+val)) {
    return false;
  }
  return true;
}

export function modifyProtocol(url: string, forceProtocol?: "http:" | "https:") {
  if (!url) {
    return url;
  }
  const localProtocol = forceProtocol || window.location.protocol;
  if (url.startsWith("//")) {
    return localProtocol + url;
  }
  const urlProtocol = url.match(/^http:/) ? "http:" : "https:";
  if (localProtocol === urlProtocol) {
    return url;
  }
  return url.replace(new RegExp(`^${urlProtocol}`), localProtocol);
}

export function parseUrlQuery(url: string, merge = {}) {
  const queryInPath = new URLSearchParams(url.split("?")[1]);
  const query: any = { ...merge };
  for (const key of queryInPath.keys()) {
    if (key in query) {
      continue;
    }
    query[key] = queryInPath.get(key);
  }
  return query;
}

export function getDisplayCityName(data: { provinceName?: string; cityName?: string }, join = " ") {
  if (data.provinceName === data.cityName) {
    return data.provinceName;
  }
  return `${data.provinceName || ""}${join}${data.cityName || ""}`;
}

export function createRequiredValidator(msg: string) {
  return (value?: string) => {
    if (!isDef(value)) {
      return msg;
    }
    if (typeof value === "string" && value.trim() === "") {
      return msg;
    }
    if (Array.isArray(value) && !value.length) {
      return msg;
    }
    return true;
  };
}

export function createNumberValidator(name: string, min?: number, max?: number) {
  return (value?: string) => {
    if (!value) {
      return true;
    }
    if (isNaN(+value)) {
      return name + "不是合法的数字";
    }
    if (isDef(min) && +value < min) {
      return name + `最小值为${min}`;
    }
    if (isDef(max) && +value > max) {
      return name + `最大值为${max}`;
    }
    return true;
  };
}

export function createLengthValidator(name: string, len: number) {
  return (value?: string) => {
    if (!isDef(value)) {
      return true;
    }
    if (value.length !== len) {
      return name + "不足17位";
    }
    return true;
  };
}

export function createMaxTailValidator(name: string, num: number) {
  return (value?: string) => {
    if (!isDef(value)) {
      return true;
    }
    if (isNaN(+value)) {
      return name + "不是合法的数字";
    }
    const tail = value.split(".")[1];
    if (!tail) {
      return true;
    }
    if (tail.length > num) {
      return name + `最多${num}位小数`;
    }
    return true;
  };
}

export function createPhoneValidator(name: string, require = false) {
  return (value?: string) => {
    if (!value) {
      if (require) {
        return name + "必须填写";
      }
      return true;
    }
    if (!/^\d{11}$/.test(value)) {
      return name + "不是合法的手机号";
    }
    return true;
  };
}

const MunicipalityMap: any = {
  "00001": {
    name: "北京",
    code: "00002",
  },
  "00063": {
    name: "重庆",
    code: "00064",
  },
  "00043": {
    name: "天津",
    code: "00044",
  },
  "00021": {
    name: "上海",
    code: "00022",
  },
};
/**
 * 判断是不是直辖市，是的话返回直辖市信息，不是返回undefined
 * @param city
 * @returns
 */
export function getMunicipalityCity(city: { code: string; name: string }) {
  const municipality = MunicipalityMap[city.code];
  if (municipality) {
    return {
      code: municipality.code,
      name: municipality.name,
    };
  }
}

/**
 * 千位分隔符
 * @param num
 * @returns
 */
export function addCommas(num: number): string {
  const str = num.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}

/**
 * 用车型信息拼接简化的车名，同后端逻辑
 * @param brandName
 * @param seriesName
 * @param modelName
 * @returns
 */
export function modifyCarName(brandName: string, seriesName: string = "", modelName: string = "") {
  const remove = (s1: string, s2: string) => {
    return s1.replace(new RegExp(s2, "g"), "");
  };
  const contains = (s1: string, s2: string) => {
    return s1.match(new RegExp(s2));
  };
  const finalModelName = remove(remove(modelName, seriesName), brandName);
  let result;
  if (contains(seriesName, brandName)) {
    result = seriesName + " " + finalModelName;
  } else {
    result = brandName + " " + seriesName + " " + finalModelName;
  }
  while (contains(result, "  ")) {
    result = result.replace("  ", " ");
  }
  return result;
}

export const localImage = (image: string) => {
  // image为相对路径
  // 第二个参数:当前路径的URL
  return new URL(`/${image}`, import.meta.url).href;
};

/**
 * 用于渲染显示值
 * @param value
 * @param config
 */
export const renderDisplayValue = (
  value?: { canRead: boolean; displayValue: string },
  config: { prefix?: string; suffix?: string; placeholder?: string; postProcess?: (data: string) => string } = { placeholder: "-" }
) => {
  const { prefix = "", suffix = "", placeholder = "-", postProcess } = config;
  if (!value) {
    return placeholder;
  }
  if (!value.canRead) {
    return `无权限查看`;
  }
  if (!value.displayValue || value.displayValue === "-") {
    return placeholder;
  }
  if (typeof postProcess === "function") {
    return postProcess(value.displayValue);
  }
  return `${prefix}${value.displayValue}${suffix}`;
};
