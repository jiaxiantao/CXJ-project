import { getAppVersion } from "@/utils/tower";
import { checkIsInWxMiniProgram, isDev, modifyProtocol } from "@/utils/utils";
import {
  ApiError,
  DefaultAxiosRequestCoreImpl,
  NetHubMethodDecorator,
  createInstance,
  type ApiClient,
  type ClientConfig,
  type ChainedInterceptor,
  type HttpRequestConfig,
  type HttpResponse,
  type Interceptor,
} from "nethub";
import { showFailToast, showToast } from "vant";

/**
 * 标记为不需要token
 */
class AuthDecor extends NetHubMethodDecorator<string> {
  collectMethod() {
    return function (config: HttpRequestConfig) {
      config.clientConfig = config.clientConfig || {};
      config.clientConfig.NO_AUTH = true;
      return config;
    };
  }
}

export const NO_AUTH = new AuthDecor().regist();

class AppVersionDecor extends NetHubMethodDecorator<string> {
  collectMethod() {
    return function (config: HttpRequestConfig) {
      config.clientConfig = config.clientConfig || {};
      config.clientConfig.NO_APP_VERSION_HEADER = true;
      return config;
    };
  }
}

/**
 * 使用注解，去掉请求中的appversion
 */
export const NO_APP_VERSION_HEADER = new AppVersionDecor().regist();

async function appVersionInterceptor(request: HttpRequestConfig, next: ChainedInterceptor<HttpResponse<SoucheResponse<any>>>) {
  request.headers = request.headers || {};
  if (request.clientConfig?.NO_APP_VERSION_HEADER !== true) {
    request.headers["version"] = getAppVersion();
  }
  return next(request);
}

async function setTokenInterceptor(request: HttpRequestConfig, next: ChainedInterceptor<HttpResponse<SoucheResponse<any>>>) {
  if (request.clientConfig?.NO_AUTH !== true) {
    await (await import("@/utils/user")).default.onHttpRequest(request);
  }
  return next(request);
}

export class ErrorNoReadAuth extends ApiError {}

/**
 * 处理业务失败，直接抛出异常
 */
async function soucheRequestInterceptor(request: HttpRequestConfig, next: ChainedInterceptor<HttpResponse<SoucheResponse<any>>>) {
  request.url = modifyProtocol(request.url!);
  request.headers = request.headers || {};

  if (request.method === "POST") {
    request.headers["content-type"] = request.headers["content-type"] || "application/json";
  }

  if (isDev()) {
    // request.headers['X-Souche-ServiceChain'] = 'env-1016113';
  }

  const httpResponse = await next(request);

  //   http 失败
  if (httpResponse.statusCode != 200) {
    throw new ApiError(httpResponse.errMsg, httpResponse.statusCode, httpResponse);
  }

  let soucheResponse = httpResponse.data;
  if (soucheResponse !== null && (soucheResponse instanceof String || typeof soucheResponse === "string")) {
    soucheResponse = JSON.parse(soucheResponse.toString());
  }
  if (Number(soucheResponse?.code) == 10001) {
    const isMiniApp = await checkIsInWxMiniProgram();
    if (isMiniApp) {
      window.wx.miniProgram.reLaunch({ url: "/pages/index/index" });
      return;
    }
    // 避免循环导入
    import("@/utils/user").then((m) => {
      m.default.onUserExpired();
    });
    return;
  }

  if (soucheResponse.code && +soucheResponse.code == -403) {
    throw new ErrorNoReadAuth(soucheResponse.msg!, soucheResponse.code, httpResponse);
  }

  //   souche error
  if (!soucheResponse.success || Number(soucheResponse.code || 0) !== 200) {
    throw new ApiError(soucheResponse.msg!, soucheResponse.code, httpResponse);
  }

  //   ok
  return Promise.resolve(soucheResponse.data);
}

const DEFAULT_OPT = { setAppVersion: true, setToken: true, interceptors: [] as Interceptor<any>[] };
type OptionType = Partial<typeof DEFAULT_OPT> & Partial<ClientConfig>;
export function createSoucheInstance(opt: OptionType = DEFAULT_OPT): ApiClient {
  const userOption = {
    ...DEFAULT_OPT,
    ...opt,
  };

  // 数组前面的拦截器先执行
  let interceptors = [soucheRequestInterceptor];

  // if (userOption.setAppVersion) {
  //   interceptors.push(appVersionInterceptor);
  // }

  if (userOption.setToken) {
    interceptors.push(setTokenInterceptor);
  }

  if (userOption.interceptors) {
    interceptors = interceptors.concat(userOption.interceptors);
  }

  return createInstance({
    ...opt,
    requestCore: new DefaultAxiosRequestCoreImpl(),
    interceptors,
    errorHandler(e: ApiError) {
      if (!(e instanceof ErrorNoReadAuth)) {
        // setTimeout(() => {
        showToast({ message: e.message, duration: 2000 });
        // }, 300);
        // showToast(e.message)
      }
    },
  });
}
