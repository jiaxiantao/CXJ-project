import { defineComponent, onMounted, reactive, ref, unref } from "vue";
import classNames from "./index.module.less";
import {
  DArrowLeft,
  DArrowRight,
  Histogram,
  Promotion,
} from "@element-plus/icons-vue";
import * as echarts from "echarts";

export default defineComponent({
  setup(props) {
    const state = reactive({
      showLeftPanel: false,
    });

    const changeLeftPanel = () => {
      state.showLeftPanel = !state.showLeftPanel;
    };

    onMounted(() => {
      setTimeout(() => {
        state.showLeftPanel = true;
      }, 0);
    });

    return () => {
      return (
        <div class={classNames["left-panel"]}>
          <div
            class={[
              classNames["left-panel-content"],
              state.showLeftPanel ? classNames["expand"] : classNames["fold"],
            ]}
          >
            <div class={classNames["panel-content-wrapper"]}>
              <div class={classNames["panel-chart"]}>
                <div class={classNames["chart-left"]}>
                  <Histogram class={classNames["chart-icon"]} />
                </div>
                <div class={classNames["chart-right"]}>
                  <div class={classNames["top-info"]}>66台</div>
                  <div class={classNames["bottom-info"]}>无人农机总量</div>
                </div>
              </div>
              <div class={classNames["panel-chart"]}>
                <div class={classNames["chart-left"]}>
                  <Histogram class={classNames["chart-icon"]} />
                </div>
                <div class={classNames["chart-right"]}>
                  <div class={classNames["top-info"]}>0台</div>
                  <div class={classNames["bottom-info"]}>作业中无人农机</div>
                </div>
              </div>
            </div>
          </div>
          <div
            class={classNames["fold-wrapper"]}
            onClick={() => {
              changeLeftPanel();
            }}
          >
            <DArrowLeft
              class={[
                classNames["arrow"],
                state.showLeftPanel ? classNames["expand"] : classNames["fold"],
              ]}
            />
          </div>
        </div>
      );
    };
  },
});
