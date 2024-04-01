// @ts-nocheck

import { modifyProtocol } from "./utils";

/**
 * 加载不同大小的图片
 * @returns {number}
 */
function calcScaleImageSize() {
  if (window.devicePixelRatio) {
    window.scaleImageSize = Math.ceil(window.devicePixelRatio);
    return window.scaleImageSize;
  }
  if (window.scaleImageSize) return window.scaleImageSize;
  const visualStand = 375;
  const screenWidth = window.screen.width || document.documentElement.clientWidth;

  window.scaleImageSize = Math.min(Math.max(Math.ceil(screenWidth / visualStand), 2), 3);
  return window.scaleImageSize;
}

/**
 * desc:通过网络类型，网络速度加载不同压缩质量的图片
 * @returns {boolean|number}
 */
function calcCompressSuffix() {
  const inBrowser = typeof window !== "undefined";
  if (!inBrowser) return 50;
  if (window.compressSuffix) return window.compressSuffix;
  let compressSuffix = 50; // ['Q_75', 'Q_50']
  try {
    if (window.navigator.connection) {
      // 有效网络连接类型: effectiveType 4g, 3g,2g, 4g(无网)
      // 估算的下行速度/带宽: ${downlink}Mb/s
      // 估算的往返时间: ${rtt}ms
      // 设备内存：${navigator.deviceMemory}G内存
      // cpu：${navigator.hardwareConcurrency}核CPU
      const { rtt, downlink } = navigator.connection;
      if (rtt <= 100 || downlink >= 6) compressSuffix = 75;
      if (rtt >= 500 || downlink <= 1) compressSuffix = 25;
      // 4g理论最高下载速率是12.5M/s，不过现实4g用户多，基站优先，基本上很难超过8M/s（随便定了一个2/3数字）
      if (downlink >= 8) window.maybeWifi = true;
    }
  } catch (e) {
    window.compressSuffix = 50;
  }
  window.compressSuffix = compressSuffix;
  return compressSuffix;
}

/**
 * 检测浏览器是否支持Webp格式图片
 * @returns {Boolean} 支持true 不支持false
 */
function supportWebp() {
  const inBrowser = typeof window !== "undefined";
  if (!inBrowser) return false;
  if (typeof window.supportWebp === "boolean") return window.supportWebp;

  let support = false;
  const d = document;

  try {
    // 奇妙所在,如果浏览器支持webp,那么这个object是不可见的(offsetWidth为0),否则就会显示出来,有可视宽度
    const el = d.createElement("object");
    el.type = "image/webp";
    el.style.visibility = "hidden";
    el.innerHTML = "!";
    d.body.appendChild(el);
    window.supportWebp = !el.offsetWidth;
    support = !el.offsetWidth;
    d.body.removeChild(el);
  } catch (err) {
    window.supportWebp = false;
    support = false;
  }

  return support;
}

export interface OSSImageOption {
  width: number;
  height: number;
}
/*
 * 生成带阿里云参数的图片
 * @param url:图片链接
 * @param options
 * @returns imageUrl
 */
export function generateImage(url: string, options?: OSSImageOption) {
  if (!url || url.trimEnd().match(/(svg|webp)$/) || url.indexOf("x-oss-process") >= 0) {
    return url;
  }
  url = modifyProtocol(url);
  let resize = "";
  const imgType = supportWebp() ? "/format,webp" : "/format,jpg/interlace,1"; // 图片类型；interlace：渐进显示,从模糊逐渐变成清晰，仅jpg有效
  const quality = `/quality,Q_${window.compressSuffix || calcCompressSuffix()}`; // 图片压缩质量
  const orient = "/auto-orient,1"; // 图片自动校正旋转方向
  // 图片裁剪
  if (options) {
    const scale = Math.min(window.scaleImageSize || calcScaleImageSize(), 2);
    // eslint-disable-next-line radix
    resize = `/resize,m_fill,w_${Number.parseInt(options.width * scale)},h_${Number.parseInt(options.height * scale)},limit_0`;
  }
  // 改为相对协议
  return `${url.replace(/(http|https):/gi, "")}?x-oss-process=image${resize}${quality}${orient}${imgType}`;
}

export function generateVideoCover(video: string) {
  return `${video}?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0,m_fast`;
}
