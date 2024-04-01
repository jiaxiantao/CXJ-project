import { _isInSoucheApp, getTower, invokeAgreement, isIos } from "./tower";
import { complexWrapper, toastWrapper } from "./ui";
import { isInWx, useWxRouter } from "./wx";
import { uploadImg } from "@/api/others";

export type IMediaActionConfig = {
  type: "image" | "video" | "mix";
  /**
   * 最大图片数 小程序最大 9
   */
  maxImageCount: number;
  /**
   * 最多可选几个视频，wx 无效
   */
  maxVideoCount?: number;
  maxDuration?: number;
  [key: string]: any;
};

export type ICompatMediaItem = { url: string; [key: string]: any; type: "image" | "video" };
export interface IMediaAction {
  /**
   * 拍照
   */
  takePhoto(config: IMediaActionConfig): Promise<ICompatMediaItem[]>;
  /**
   *选图
   */
  pickPhoto(config: IMediaActionConfig): Promise<ICompatMediaItem[]>;
}

/**
 * AppMediaActionImpl 自带上传toast
 */
class AppMediaActionImpl implements IMediaAction {
  takePhoto(config: IMediaActionConfig): Promise<ICompatMediaItem[]> {
    return new Promise((r, j) => {
      getTower().photo.camera(
        {
          maxPicCount: config.maxImageCount,
          maxVideoCount: config.maxVideoCount,
          maxVideoTime: config.maxDuration,
          canSelectVideo: config.type !== "image",
          canEdit: false,
          enableUpload: false,
          original: true,
          ...config,
        },
        (error: any, data: any) => {
          if (error) {
            j(error);
            return;
          }
          r(
            data?.data?.medias?.map((i: any) => {
              return {
                url: i.mediaUrl,
                type: i.mediaType,
                ...i,
              };
            }) || []
          );
        }
      );
    });
  }
  pickPhoto(config: IMediaActionConfig): Promise<ICompatMediaItem[]> {
    return new Promise((r, j) => {
      getTower().photo.picker(
        {
          maxPicCount: config.maxImageCount,
          maxVideoCount: config.maxVideoCount,
          maxVideoTime: config.maxDuration,
          canSelectVideo: config.type !== "image",
          canEdit: false,
          enableUpload: true,
          ...config,
        },
        (error: any, data: any) => {
          if (error) {
            j(error);
            return;
          }
          r(
            data?.data?.medias?.map((i: any) => {
              return {
                url: i.mediaUrl,
                type: i.mediaType,
                ...i,
              };
            }) || []
          );
        }
      );
    });
  }
}

class AppMediaActionImplV2 implements IMediaAction {
  takePhoto(config: IMediaActionConfig): Promise<ICompatMediaItem[]> {
    return new Promise((r, j) => {
      invokeAgreement(
        "mars://open/Media",
        {
          pickerType: "camera",
          startPicCount: 0,
          startVideoNum: 0,
          maxPicCount: config.maxImageCount || 0,
          maxVideoNum: config.maxVideoCount || 0,
          videoMaxDuration: config.maxDuration || 0,
          supportVideo: config.type !== "image" ? 1 : 0,
          needEdit: 0,
          ...config,
        },
        async (err: any, data: any) => {
          if (err) {
            return j(err);
          }
          if (!data?.body?.length) {
            r([]);
          }
          const files = data.body;
          try {
            const uploadFiles = await complexWrapper(
              Promise.all(
                files.map((f: any) => {
                  if (isIos()) {
                    const [binData, type] = this.base64ToBlob(f.base64Image) || [];
                    console.log("type", type);
                    if (!binData) {
                      return Promise.reject("无效的图片数据");
                    }
                    return uploadImg(new File([binData], `image.${type}`, { type: `image/${type}` })).then((r) => {
                      return { url: r };
                    });
                  }
                  return new Promise((resove, reject) => {
                    invokeAgreement("mars://upload/himekaidou", { file: f.localUrl, dir: "f2e" }, function (err: any, data: any) {
                      if (err) {
                        return reject(err);
                      }
                      return resove(data);
                    });
                  });
                })
              )
            );
            r(uploadFiles);
          } catch (e) {
            j(e);
          }
        }
      );
    });
  }

  base64ToBlob(base64Data: string): [Blob, string] | undefined {
    const dataArr = base64Data.split(","); // 根据,来分隔
    if (!dataArr.length) {
      return;
    }
    const imageType = dataArr[0].match(/:(.*?);/)?.[1]; // 获取文件类型。使用正则捕获 image/jpeg
    const textData = window.atob(dataArr[1]); // 使用atob() 将base64 转为文本文件
    const arrayBuffer = new ArrayBuffer(textData.length); // 创建一个二进制数据缓冲区，可以理解为一个数组
    const uint8Array = new Uint8Array(arrayBuffer); // 创建一个类型化数组对象，可以理解为上面的数组的成员，给这个对象赋值就会放到上面的数组中。
    for (let i = 0; i < textData.length; i++) {
      uint8Array[i] = textData.charCodeAt(i); // 将文本文件转为UTF-16的ASCII, 放到类型化数组对象中
    }
    return [new Blob([arrayBuffer], { type: imageType }), imageType?.slice(6)!]; // 返回两个值，一个Blob对象，一个图片格式（如jpeg）
  }

  pickPhoto(config: IMediaActionConfig): Promise<ICompatMediaItem[]> {
    return new Promise((r, j) => {
      invokeAgreement(
        "mars://open/Media",
        {
          pickerType: "album",
          startPicCount: 0,
          startVideoNum: 0,
          maxPicCount: config.maxImageCount || 0,
          maxVideoNum: config.maxVideoCount || 0,
          videoMaxDuration: config.maxDuration || 0,
          supportVideo: config.type !== "image" ? 1 : 0,
          needEdit: 0,
          ...config,
        },
        async (err: any, data: any) => {
          if (err) {
            return j(err);
          }
          if (!data?.body?.length) {
            r([]);
          }
          const files = data.body;
          try {
            const uploadFiles = await complexWrapper(
              Promise.all(
                files.map((f: any) => {
                  if (isIos()) {
                    const [binData, type] = this.base64ToBlob(f.base64Image) || [];
                    if (!binData) {
                      return Promise.reject("无效的图片数据");
                    }
                    return uploadImg(new File([binData], `image.${type}`, { type: `image/${type}` }), "f2e").then((r) => {
                      return { url: r };
                    });
                  }
                  return new Promise((resove, reject) => {
                    invokeAgreement("mars://upload/himekaidou", { file: f.localUrl, dir: "f2e" }, function (err: any, data: any) {
                      if (err) {
                        return reject(err);
                      }
                      return resove(data);
                    });
                  });
                })
              )
            );
            r(uploadFiles);
          } catch (e) {
            j(e);
          }
        }
      );
    });
  }
}

class WxImpl implements IMediaAction {
  miniRouter: ReturnType<typeof useWxRouter>;
  constructor(miniRouter: ReturnType<typeof useWxRouter>) {
    this.miniRouter = miniRouter;
  }
  takePhoto(config: IMediaActionConfig): Promise<ICompatMediaItem[]> {
    const opt: any = {
      title: "选择图片",
      sourceType: ["camera"],
      count: Math.min(config.maxImageCount || 0, 9),
    };
    if (!/(Android)|(Adr)/.test(navigator.userAgent || "")) {
      opt.sizeType = ["compressed"];
    }
    return toastWrapper(
      this.miniRouter
        .invokeAction("chooseimg", opt) //微信api限制一次最多9张
        .then((data = []) => {
          return data.map((i: string) => {
            return {
              url: i,
            };
          });
        })
        .catch((e) => {
          if (/cancel/.test(e.message)) {
            return;
          }
          throw e;
        })
    );
  }
  pickPhoto(config: IMediaActionConfig): Promise<ICompatMediaItem[]> {
    const opt: any = {
      title: "选择图片",
      sourceType: ["album"],
      count: Math.min(config.maxImageCount || 0, 9),
    };
    if (!/(Android)|(Adr)/.test(navigator.userAgent || "")) {
      opt.sizeType = ["compressed"];
    }
    return toastWrapper(
      this.miniRouter
        .invokeAction("chooseimg", opt) //微信api限制一次最多9张
        .then((data = []) => {
          return data.map((i: string) => {
            return {
              url: i,
            };
          });
        })
        .catch((e) => {
          if (/cancel/.test(e.message)) {
            return;
          }
          throw e;
        })
    );
  }
}

export function useMediaChooser() {
  const mediaActionImpl: IMediaAction = _isInSoucheApp ? new AppMediaActionImplV2() : new WxImpl(useWxRouter());
  return mediaActionImpl;
}
