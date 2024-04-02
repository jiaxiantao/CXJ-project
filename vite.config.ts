import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { defineConfig } from "vite";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
dayjs.extend(utc);

export default defineConfig((config) => {
  const isDev = config.command === "serve";
  const isProd = config.mode === "production";
  const isDevelopment = config.mode === "development";
  return {
    base: "./",
    build: {
      minify: isDevelopment ? false : "esbuild", //测试环境不压缩
    },
    server: {
      host: "0.0.0.0",
      proxy: {
        '/abmapi': {
          target: 'http://tb.aiforcetech.com:8081',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''),
        }
      },
      cors: true,
    },
    plugins: [
      // visualizer() as PluginOption,
      // 为不支持module的浏览器构建旧版本
      legacy({
        targets: isDev ? "modules" : ["chrome > 70", "ios > 11"],
        modernPolyfills: true,
      }),
      vue(),
      vueJsx({
        babelPlugins: [
          // 没有专用的注解处理插件，用这个顶一下
          ["@babel/plugin-proposal-decorators", { version: "2022-03" }],
        ],
      }),
    ],
    define: {
      __APP_BUILD_TIME__: JSON.stringify(dayjs().utcOffset(8).format("YYYY-MM-DD HH:mm:ss").toString()),
    },
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  };
});
