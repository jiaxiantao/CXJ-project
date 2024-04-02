import { defineComponent, onMounted, reactive, ref, unref } from "vue";
import classNames from "./index.module.less";
import { DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
import * as echarts from "echarts";

export default defineComponent({
  setup(props) {
    const state = reactive({
      showHeader: false,
    });

    onMounted(() => {
      setTimeout(() => {
        state.showHeader = true;
      }, 0);
    });

    return () => {
      return (
        <div
          class={[
            classNames["top-header"],
            state.showHeader ? classNames["expand"] : classNames["fold"],
          ]}
        >
          {/* <div class={classNames["header-left"]}>logo</div> */}
          <span class={classNames["header-title"]}>无人农机示范基地</span>
          <div class={classNames["header-right"]}>
            <span class={classNames["info-name"]}>ZL</span>
            <span class={classNames["exit"]}>退出</span>
          </div>
        </div>
      );
    };
  },
});
