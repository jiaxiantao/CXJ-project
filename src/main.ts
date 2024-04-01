import "@/utils/rem";
import { createPinia } from "pinia";
import { createApp } from "vue";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import 'element-plus/theme-chalk/dark/css-vars.css'

import App from "./app";
import "./main.less";
import router from "./router";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

const init = () => {
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.use(ElementPlus);

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }

  app.mount("#app");

  // 将中文本地化配置应用到 dayjs 实例上
  dayjs.locale("zh-cn");
};

init();
