import { getTower, isInSoucheApp } from "@/utils/tower";

/**
 * 设置Webview导航栏分隔线样式
 * @param enable
 * @param color
 */
export function setNavDivider(enable: boolean = true, color: string = "#E9E9E9") {
  if (isInSoucheApp()) {
    // 去掉页面底部分割线
    getTower().nav.setStyle({
      bottomDividerMode: {
        enable: enable,
        color: color,
      },
    });
  }
}
