import { defineComponent, onMounted, reactive } from "vue";
import classNames from "./index.module.less";
import axios from "axios";
import { ElLoading } from "element-plus";

import TopHeader from "./components/topHeader";
import LeftPanel from "./components/leftPanel";
import BottomPanel from "./components/bottomPanel";

export default defineComponent({
  setup(props) {
    const state = reactive({
      mapLoading: true,
    });

    const loadScript = (script: any) => {
      return new Promise((resolve, reject) => {
        if (script.src) {
          // 加载外部脚本
          const newScript = document.createElement("script");
          newScript.src = script.src;
          newScript.onload = resolve;
          newScript.onerror = reject;
          document.head.appendChild(newScript); // 使用head以避免阻塞页面渲染
        } else {
          // 执行内联脚本
          try {
            eval(script.innerText);
            resolve(true);
          } catch (error) {
            reject(error);
          }
        }
      });
    };

    const executeScriptsAndSetInnerHTML = (
      serverHtml: string,
      containerId: string
    ) => {
      const container = document.createElement("div");
      container.innerHTML = serverHtml;
      const scripts = Array.from(container.querySelectorAll("script"));
      const nonScriptHTML = container.innerHTML.replace(
        /<script[^>]*>([\s\S]*?)<\/script>/gi,
        ""
      );

      // 将非脚本内容插入到指定的容器中
      const displayContainer = document.getElementById(containerId);
      if (displayContainer) {
        displayContainer.innerHTML = nonScriptHTML;
      }

      // 按顺序执行所有脚本

      scripts
        .reduce(
          (promise, script) => promise.then(() => loadScript(script) as any),
          Promise.resolve()
        )
        .then(() => {
          console.log("所有脚本加载完成");
          state.mapLoading = false;
        })
        .catch((error: any) => {
          console.error("脚本加载失败:", error);
        });
    };

    const getMap = () => {
      state.mapLoading = true;
      const loading = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      axios
        .get(
          `http://gpu.xjau.edu.cn:8080/geoserver/hx_cj/wms?service=WMS&version=1.1.0&request=GetMap&layers=hx_cj:basemap&bbox=521326.3103,4894828.4316,525148.4884,4901349.1535&width=${windowWidth}&height=${windowHeight}&srs=EPSG:4538&format=application/openlayers#toggle`
        )
        .then((res) => {
          if (res && res.data) {
            executeScriptsAndSetInnerHTML(res.data, "innerMap");
          }
        })
        .finally(() => {
          loading.close();
        });
    };

    onMounted(() => {
      getMap();
    });

    return () => {
      return (
        <div class={classNames["home"]}>
          <div id="innerMap" class={classNames["innerMap"]}></div>
          {!state.mapLoading && (
            <>
              <TopHeader />
              <LeftPanel />
              <BottomPanel />
            </>
          )}
        </div>
      );
    };
  },
});
