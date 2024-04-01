import LubanV2 from "@souche-f2e/luban-js-v2";
import { isInSoucheApp, isIos } from "./tower";
import userIns from "./user";

let user: IUser | null;

const initLubanV2 = async () => {
  let appName = "mars";
  if (!isIos()) {
    appName += "_ANDROID";
  } else {
    appName += "_IOS";
  }

  if (!isInSoucheApp()) {
    appName += "_WEB";
  }

  LubanV2?.load({
    appName,
    projectId: "saas_f2e",
    platform: 4,
    env: import.meta.env.VITE_APP_ENV === "prepub" ? "prepublish" : import.meta.env.VITE_APP_ENV,
  });
  return LubanV2;
};
let instanceV2: any;

const sendBury = async (
  options: {
    [key: string]: any;
  } = {}
) => {
  if (!instanceV2) {
    instanceV2 = await initLubanV2();
  }

  if (!user) {
    user = await userIns.getUserInfo();
  }

  console.log("send", {
    typeId: options?.typeId,
    eventType: options?.eventType || "CLICK",
    attributes: JSON.stringify({
      iid: user?.iid,
      shopCode: user?.shopCode,
      ...(options || {}),
    }),
  });

  instanceV2?.customizeSend?.({
    typeId: options?.typeId,
    eventType: options?.eventType || "CLICK",
    attributes: JSON.stringify({
      iid: user?.iid,
      shopCode: user?.shopCode,
      ...(options || {}),
    }),
  });
};

export default sendBury;
