import { showFailToast, showLoadingToast, showSuccessToast } from "vant";

export function loadingWrapper<T>(fn: Promise<T>): Promise<T>;
export function loadingWrapper<F extends (...args: any) => Promise<any>>(fn: F): F;
export function loadingWrapper<T>(fn: Promise<T> | ((...args: any) => Promise<T>)): typeof fn {
  if (fn instanceof Promise) {
    const ins = showLoadingToast({ duration: 1000000 });
    return fn.finally(ins.close);
  }
  return function (...args: Parameters<typeof fn>) {
    return loadingWrapper(fn(...args));
  };
}

export function toastWrapper<T>(fn: Promise<T>, toastWhenSucc?: string): Promise<T>;
export function toastWrapper<F extends (...args: any) => Promise<any>>(fn: F, toastWhenSucc?: string): F;
export function toastWrapper<T>(fn: Promise<T> | ((...args: any) => Promise<T>), toastWhenSucc?: string): typeof fn {
  if (fn instanceof Promise) {
    return fn
      .then((r) => {
        if (toastWhenSucc) {
          showSuccessToast({ message: toastWhenSucc, type: "text" });
        }
        return r;
      })
      .catch((e) => {
        showFailToast(e instanceof Error ? e.message : typeof e === "string" ? e : "发生错误");
        throw e;
      });
  }
  return function (...args: Parameters<typeof fn>) {
    return toastWrapper(fn(...args));
  };
}

export function complexWrapper<T>(fn: Promise<T>, toastWhenSucc?: string): Promise<T>;
export function complexWrapper<F extends (...args: any) => Promise<any>>(fn: F, toastWhenSucc?: string): F;
export function complexWrapper<T>(fn: Promise<T> | ((...args: any) => Promise<T>), toastWhenSucc?: string): typeof fn {
  if (fn instanceof Promise) {
    return toastWrapper(loadingWrapper(fn), toastWhenSucc);
  }
  return toastWrapper(loadingWrapper(fn), toastWhenSucc);
}
