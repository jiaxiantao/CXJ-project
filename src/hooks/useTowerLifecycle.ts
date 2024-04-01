import { isInSoucheApp } from "@/utils/tower";
import tower from "@jarvis/tower-h5";
import { onBeforeUnmount, onMounted } from "vue";

/**
 * 监听 webview 的关闭 view.onWVHide view.offWVHide
 * 监听 webview 的显示 view.onWVShow view.offWVShow
 */
export default function (opt: { onWebviewShow: CB<void, CB | void> }) {
  if (!isInSoucheApp()) {
    return;
  }
  const hideCbs: CB[] = [];
  onMounted(() => {
    tower.view.onWVHide((error: any) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("tower.view.onWVHide");
      hideCbs.forEach((c) => {
        c();
      });
    });

    tower.view.onWVShow((error: any) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("tower.view.show");
      const onHide = opt.onWebviewShow();
      if (onHide) {
        hideCbs.push(onHide);
      }
    });
  });

  onBeforeUnmount(() => {
    tower.view.offWVShow((error: any) => {
      if (error) console.error(error);
    });
    tower.view.offWVHide((error: any) => {
      if (error) console.error(error);
    });
  });
}
