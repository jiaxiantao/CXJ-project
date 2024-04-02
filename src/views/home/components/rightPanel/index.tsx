import { defineComponent, onMounted, reactive, ref, unref, watch } from "vue";
import classNames from "./index.module.less";
import { DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
import axios from "axios";
import { ElLoading } from "element-plus";
import { ServiceType } from "../bottomPanel/index";
import { number } from "echarts";

export default defineComponent({
  props: {
    selectedRow: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    const state = reactive({
      showRightPanel: false,
      activeName: "first",
    });

    const data = reactive({
      gnssdifferentialstate: "--",
      sim1SIGNALSTRENGTH: "--",
      sim2SIGNALSTRENGTH: "--",
      navigationsystemstatusinformation: "--",
      operationmode: "--",
      operationtype: "--",
      jobnameid: "--",
      mu: "--",
      realtimefixlongitude: "--",
      realtimelocationlatitude: "--",
      currentjobspeed: "--",
      aaaa: "--",
    });

    const changeRightPanel = () => {
      state.showRightPanel = !state.showRightPanel;
    };

    const handleClick = () => {};

    const getInfo = (selectedRow: Record<string, any>) => {
      if (selectedRow.serviceType === ServiceType.LEIWO) {
        getLeiWoInfo(selectedRow.equipmentCoding);
      } else if (selectedRow.serviceType === ServiceType.ZHONGKE) {
        getZhongKeInfo(selectedRow.equipmentCoding);
      }
    };

    const getLeiWoInfo = (deviceNo: string) => {
      const loading = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 创建请求配置对象
      const headerConfig = {
        headers: {
          bizapiauth: "xjnd@-@fT1T#$a198bcdc2603954672$78Sm^bDbbe02ce88c66ec95",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      axios
        .post(
          "http://cloud.lovol.com:3000/api/unpiloted/v2/rest/unpiloted2/getNavData",
          {
            deviceNo,
          },
          headerConfig
        )
        .then((response: { data: any }) => {
          if (response.data.data.devicenum == "") {
            response.data.data.gnssdifferentialstate = "--";
            response.data.data.sim1SIGNALSTRENGTH = "--";
            response.data.data.sim2SIGNALSTRENGTH = "--";
            response.data.data.navigationsystemstatusinformation = "--";
            response.data.data.operationmode = "--";
            response.data.data.operationtype = "--";
            response.data.data.jobnameid = "--";
            response.data.data.mu = "--";
            response.data.data.realtimefixlongitude = "--";
            response.data.data.realtimelocationlatitude = "--";
            response.data.data.currentjobspeed = "--";
            response.data.data.aaaa = "--";
            return;
          }
          // 差分信号状态
          if (response.data.data.gnssdifferentialstate == 0) {
            data.gnssdifferentialstate = "差分异常，卫星红色";
          } else if (response.data.data.gnssdifferentialstate == 1) {
            data.gnssdifferentialstate = "差分正常，卫星绿色";
          } else if (response.data.data.gnssdifferentialstate == 2) {
            data.gnssdifferentialstate = "错误数据";
          } else if (response.data.data.gnssdifferentialstate == 3) {
            data.gnssdifferentialstate = "无效数据";
          }

          // SIM卡1状态
          if (response.data.data.sim1SIGNALSTRENGTH == 0) {
            data.sim1SIGNALSTRENGTH = "显示 0 格";
          } else if (response.data.data.sim1SIGNALSTRENGTH == 1) {
            data.sim1SIGNALSTRENGTH = "显示 1 格";
          } else if (response.data.data.sim1SIGNALSTRENGTH == 2) {
            data.sim1SIGNALSTRENGTH = "显示 2 格";
          } else if (response.data.data.sim1SIGNALSTRENGTH == 3) {
            data.sim1SIGNALSTRENGTH = "显示 3 格";
          } else if (response.data.data.sim1SIGNALSTRENGTH == 4) {
            data.sim1SIGNALSTRENGTH = "显示 4 格";
          } else if (response.data.data.sim1SIGNALSTRENGTH == 99) {
            data.sim1SIGNALSTRENGTH = "显示 99 格";
          }

          // SIM卡2状态
          if (response.data.data.sim2SIGNALSTRENGTH == 0) {
            data.sim2SIGNALSTRENGTH = "显示 0 格";
          } else if (response.data.data.sim2SIGNALSTRENGTH == 1) {
            data.sim2SIGNALSTRENGTH = "显示 1 格";
          } else if (response.data.data.sim2SIGNALSTRENGTH == 2) {
            data.sim2SIGNALSTRENGTH = "显示 2 格";
          } else if (response.data.data.sim2SIGNALSTRENGTH == 3) {
            data.sim2SIGNALSTRENGTH = "显示 3 格";
          } else if (response.data.data.sim2SIGNALSTRENGTH == 4) {
            data.sim2SIGNALSTRENGTH = "显示 4 格";
          } else if (response.data.data.sim2SIGNALSTRENGTH == 99) {
            data.sim2SIGNALSTRENGTH = "显示 99 格";
          }

          //navigationsystemstatusinformation
          if (response.data.data.navigationsystemstatusinformation == 0) {
            data.navigationsystemstatusinformation =
              "导航自动驾驶禁止,方向盘红色";
          } else if (
            response.data.data.navigationsystemstatusinformation == 1
          ) {
            data.navigationsystemstatusinformation =
              "导航自动驾驶启用，方向盘绿色";
          } else if (
            response.data.data.navigationsystemstatusinformation == 2
          ) {
            data.navigationsystemstatusinformation =
              "导航自动驾驶暂停，方向盘黄色";
          } else if (
            response.data.data.navigationsystemstatusinformation == 3
          ) {
            data.navigationsystemstatusinformation = "无效数据";
          }

          //operationmode
          if (response.data.data.operationmode == 0) {
            data.operationmode = "AB 直线";
          } else if (response.data.data.operationmode == 1) {
            data.operationmode = "A+直线";
          } else if (response.data.data.operationmode == 2) {
            data.operationmode = "圆周作业";
          } else if (response.data.data.operationmode == 3) {
            data.operationmode = "无人驾驶";
          } else if (response.data.data.operationmode == 4) {
            data.operationmode = "任意曲线";
          } else if (response.data.data.operationmode == 5) {
            data.operationmode = "耙地（直线+角度）";
          } else if (response.data.data.operationmode == 6) {
            data.operationmode = "耙地（双对角线）";
          }

          //operationtype
          if (response.data.data.operationtype == 0) {
            data.operationtype = "无作业";
          } else if (response.data.data.operationtype == 1) {
            data.operationtype = "犁地（深翻）";
          } else if (response.data.data.operationtype == 2) {
            data.operationtype = "深松";
          } else if (response.data.data.operationtype == 3) {
            data.operationtype = "耙地";
          } else if (response.data.data.operationtype == 4) {
            data.operationtype = "旋耕";
          } else if (response.data.data.operationtype == 5) {
            data.operationtype = "打浆";
          } else if (response.data.data.operationtype == 6) {
            data.operationtype = "播种";
          } else if (response.data.data.operationtype == 7) {
            data.operationtype = "插秧";
          } else if (response.data.data.operationtype == 8) {
            data.operationtype = "喷雾";
          } else if (response.data.data.operationtype == 9) {
            data.operationtype = "施肥";
          } else if (response.data.data.operationtype == 10) {
            data.operationtype = "收获";
          } else if (response.data.data.operationtype == 11) {
            data.operationtype = "开沟";
          } else if (response.data.data.operationtype == 12) {
            data.operationtype = "起垄";
          }

          // 作业名称
          data.jobnameid = response.data.data.jobnameid;

          //mu
          if (response.data.data.mu == 0) {
            data.mu = "无作业";
          } else if (response.data.data.mu == 1) {
            data.mu = "作业进行中";
          } else if (response.data.data.mu == 2) {
            data.mu = "作业完成";
          }

          // 定位数据经度
          data.realtimefixlongitude =
            response.data.data.realtimefixlongitude + " 度";
          // 定位数据纬度
          data.realtimelocationlatitude =
            response.data.data.realtimelocationlatitude + " 度";
          // 行驶速度
          data.currentjobspeed = response.data.data.currentjobspeed + " km/h";
          // 发动机转速
          data.aaaa = response.data.data.aaaa + " rpm";

          // 处理响应数据
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          // 处理错误
        })
        .finally(() => {
          loading.close();
        });
    };

    const getZhongKeInfo = (mcSn: string) => {
      const loading = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 创建请求配置对象
      const headerConfig = {
        headers: {
          token:
            "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNjNfZGV2IiwidXNlciI6IntcIm1hbmFnZXJJZFwiOjE2MyxcIm1uTG9nTmFtZVwiOlwibm9uZ2RhXCIsXCJtbk5pY2tuYW1lXCI6XCLmlrDlhpzlpKdcIixcInV0UGF0aFwiOlwiLzEvODMvNDkvXCJ9IiwiaWF0IjoxNzExOTQzOTg0LCJqdGkiOiI4Nzk4NDM2Yy04NDQ4LTQzZGItYWYxNC00MzMxZTA2ZmQ5ZDAifQ.kOZwyNV4XQuGq1lbdgDUuXAg3bLEwu5t7DC_btXofMw",
          "Content-Type": "multipart/form-data",
          Host: "tb.aiforcetech.com:8081",
        },
      };

      axios
        .post(
          `/abmapi/machine/getMachineLiveBySn`,
          {
            mcSn,
          },
          headerConfig
        )
        .then((response: { data: any }) => {})
        .catch((error) => {
          console.error("Error fetching data:", error);
          // 处理错误
        })
        .finally(() => {
          loading.close();
        });
    };

    onMounted(() => {
      setTimeout(() => {
        state.showRightPanel = true;
        // getLeiWoInfo(props.deviceNo || "");
      }, 0);
    });

    watch(
      () => props.selectedRow,
      (value) => {
        value && getInfo(value);
      }
    );

    // onMounted(() => {});

    return () => {
      return (
        <div class={classNames["right-panel"]}>
          <div
            class={classNames["fold-wrapper"]}
            onClick={() => {
              changeRightPanel();
            }}
          >
            <DArrowRight
              class={[
                classNames["arrow"],
                state.showRightPanel
                  ? classNames["expand"]
                  : classNames["fold"],
              ]}
            />
          </div>
          <div
            class={[
              classNames["right-panel-content"],
              state.showRightPanel ? classNames["expand"] : classNames["fold"],
            ]}
          >
            <div class={classNames["panel-title"]}>拖拉机信息</div>
            <div class={classNames["panel-content"]}>
              <el-tabs
                v-model={state.activeName}
                class="demo-tabs"
                onClick={handleClick}
              >
                <el-tab-pane label="设备信息" name="first">
                  <div class={classNames["form-content"]}>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>差分信号状态</div>
                      <div
                        v-html={data.gnssdifferentialstate}
                        class={classNames["form-value"]}
                      ></div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>SIM卡1状态</div>
                      <div
                        v-html={data.sim1SIGNALSTRENGTH}
                        class={classNames["form-value"]}
                      ></div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>SIM卡2状态</div>
                      <div
                        v-html={data.sim2SIGNALSTRENGTH}
                        class={classNames["form-value"]}
                      ></div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>导航系统状态</div>
                      <div
                        v-html={data.navigationsystemstatusinformation}
                        class={classNames["form-value"]}
                      ></div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>作业模式</div>
                      <div
                        v-html={data.operationmode}
                        class={classNames["form-value"]}
                      ></div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>作业类型</div>
                      <div
                        v-html={data.operationtype}
                        class={classNames["form-value"]}
                      ></div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>作业名称</div>
                      <div
                        v-html={data.jobnameid}
                        class={classNames["form-value"]}
                      ></div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>作业状态</div>
                      <div
                        v-html={data.mu}
                        class={classNames["form-value"]}
                      ></div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>定位数据经度</div>
                      <div
                        v-html={data.realtimefixlongitude}
                        class={classNames["form-value"]}
                      ></div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>定位数据纬度</div>
                      <div
                        v-html={data.realtimelocationlatitude}
                        class={classNames["form-value"]}
                      ></div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>行驶速度</div>
                      <div
                        v-html={data.currentjobspeed}
                        class={classNames["form-value"]}
                      ></div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div
                        v-html={data.aaaa}
                        class={classNames["form-value"]}
                      ></div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="作业信息" name="second">
                  <div class={classNames["form-content"]}>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速速度</div>
                      <div class={classNames["form-value"]}>191</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速1</div>
                      <div class={classNames["form-value"]}>191</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速1</div>
                      <div class={classNames["form-value"]}>191</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速1</div>
                      <div class={classNames["form-value"]}>191</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="导航信息" name="third">
                  <div class={classNames["form-content"]}>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速2</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="诊断信息" name="fourth">
                  <div class={classNames["form-content"]}>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速3</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="系统信息" name="fifth">
                  <div class={classNames["form-content"]}>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速4</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                    <div class={classNames["form-row"]}>
                      <div class={classNames["form-label"]}>发动机转速</div>
                      <div class={classNames["form-value"]}>19</div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      );
    };
  },
});

function data() {
  throw new Error("Function not implemented.");
}
