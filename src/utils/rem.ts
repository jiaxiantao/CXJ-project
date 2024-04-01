function setRem() {
  const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
  //得到html的Dom元素
  const htmlDom = document.getElementsByTagName("html")[0];
  // 按照设计稿 1vw = (750px / 16)rem
  // 按照实际屏幕像素 rootFontSize = (1vw/((750px / 16)))
  htmlDom.style.fontSize = (htmlWidth / (750 / 16)).toFixed(2) + "px"; // 配置 缩放后的 rem
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem();
};
