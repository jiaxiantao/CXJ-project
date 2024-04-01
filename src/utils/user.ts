// @ts-nocheck
import tower from "@jarvis/tower-h5";
import { HttpRequestConfig } from "nethub";
import { showFailToast } from "vant";
import BatchRequestZipper from "./cache-promise";
import { isInSoucheApp } from "./tower";
import { isProd } from "./utils";
import { getUserToken } from "@/utils/token";
import { getAccountInformation } from "@/api/border";

declare global {
  type IUser = {
    token: string;
    shopCode: string;
    [key: string]: string;
  };
}

export type IShopInfo = {
  cityCode: string;
  cityName: string;
  provinceCode: string;
  provinceName: string;
  shopName: string;
};

export interface IUserAgent {
  init(): void;
  clearUser(): void;
  onUserExpired(): void;
  getUserInfo(): Promise<IUser | null>;
  getLocalUserInfo(): IUser;
  onHttpRequest(request: HttpRequestConfig): Promise<void>;
  getShopInfo(): Promise<IShopInfo>;
}

class AppUser implements IUserAgent {
  DEFAULT_USER: IUser = {
    token: "22_xxEp_NBAJjwvp4lM8c",
    // authentication: false,
    // departmentId: "5KsdZtIOzJ",
    // departmentName: "苏州检测合伙人1对内",
    // headImg: "http://img.souche.com/20160503/png/632525b3edd6bb2abde995db4df2793a.png",
    // iid: "500125158",
    // orgId: "OhgrN5IXYK",
    // orgName: "测试的标准集团",
    // phone: "13606510142",
    // sex: "1",
    // shopCode: "01184269",
    // shopName: "苏州检测合伙人11",
    // shopType: "NEW_SHOP_JX",
    // userId: "ACCNBA59aIDZ6ZQs",
    // userName: "娃娃",
  };

  userFetcher = new BatchRequestZipper<IUser>();
  expireCalled = false;

  init(): void {}

  clearUser(): void {
    this.userFetcher.reset();
    userWithAuthsFetcher.reset();
  }

  onUserExpired(): void {
    if (this.expireCalled) {
      return;
    }
    showFailToast({
      message: "未登录，请先登录！",
      onClose() {
        tower.vc.open(
          {
            protocol: "mars://logoutSuccess/mainReceiver",
          },
          (error: Error) => {
            if (error) console.error(error);
          }
        );
      },
    });
    this.expireCalled = true;
  }

  getUserInfo(): Promise<IUser | null> {
    if (!isInSoucheApp()) {
      return this.userFetcher.do(async function (cb: CBE<IUser>) {
        try {
          const result = await getAccountInformation("");
          cb(result ? "" : "error", result);
        } catch (e) {
          cb("", isProd() ? null : this.DEFAULT_USER);
        }
      });
      // return Promise.resolve(isProd() ? null : this.DEFAULT_USER);
    }
    return this.userFetcher.do(function (cb: CBE<IUser>) {
      tower.invokeModule("mars://getUserInfo/mainReceiver", {}, (error: Error, data: { user?: IUser }) => {
        cb(error, data.user!);
      });
    });
  }

  getLocalUserInfo(): IUser {
    return this.userFetcher.cacheData!;
  }

  async onHttpRequest(request: HttpRequestConfig) {
    request.headers = request.headers || {};
    request.headers["souche-security-token"] = await getUserToken();
  }

  getShopInfo(): Promise<IShopInfo> {
    return this.getUserInfo();
  }
}

const userIns = new AppUser();

export default userIns as IUserAgent;
