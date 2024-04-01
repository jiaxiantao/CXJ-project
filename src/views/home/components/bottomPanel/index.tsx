import { defineComponent, onMounted, reactive, ref, unref } from "vue";
import classNames from "./index.module.less";
import {
  DArrowLeft,
  DArrowRight,
  SwitchButton,
  Key,
  Odometer,
  Aim,
  Pointer,
  WarningFilled,
  Fold,
  WarnTriangleFilled,
  Operation,
  UserFilled,
  EditPen,
  Compass,
  HelpFilled,
  UploadFilled,
  Discount,
  Setting,
  Plus,
} from "@element-plus/icons-vue";
import FormPanel from "./formPanel";
import RightPanel from "../rightPanel";

export default defineComponent({
  setup(props) {
    const state = reactive({
      showBottomPanel: false,
      showFromPanel: false,
      selectedRow: {
        equipmentCoding: null,
      },
      tableData: [
        {
          equipmentType: "收货机",
          equipmentName: "VT202392200178",
          equipmentCoding: "VT202392200178",
          equipmentStatus: "离线",
        },
        {
          equipmentType: "水稻机",
          equipmentName: "0036测试导航",
          equipmentCoding: "VT042023110800036",
          equipmentStatus: "在线",
        },
        {
          equipmentType: "拖拉机",
          equipmentName: "VT202382600040",
          equipmentCoding: "VT202382600040",
          equipmentStatus: "离线",
        },
        {
          equipmentType: "水稻机",
          equipmentName: "P平台动力换挡联调导航",
          equipmentCoding: "VT202382600019",
          equipmentStatus: "离线",
        },
        {
          equipmentType: "插秧机",
          equipmentName: "华测插秧机",
          equipmentCoding: "110TS01374000021",
          equipmentStatus: "在线",
        },
        {
          equipmentType: "水稻机",
          equipmentName: "L2水稻机4LZ-7G1",
          equipmentCoding: "VT042023110800004",
          equipmentStatus: "离线",
        },
        {
          equipmentType: "小麦机",
          equipmentName: "63321GME8N323817",
          equipmentCoding: "VT042023110800012",
          equipmentStatus: "离线",
        },
        {
          equipmentType: "小麦机",
          equipmentName: "0002测试导航",
          equipmentCoding: "VT042023110800002",
          equipmentStatus: "离线",
        },
        {
          equipmentType: "插秧机",
          equipmentName: "358081插秧机",
          equipmentCoding: "3580184",
          equipmentStatus: "离线",
        },
      ],
    });

    const changeBottomPanel = () => {
      state.showBottomPanel = !state.showBottomPanel;
    };

    const handleClick = () => {
      state.showFromPanel = true;
    };

    const changeFormPanel = () => {
      state.showFromPanel = !state.showFromPanel;
    };

    onMounted(() => {
      setTimeout(() => {
        if (window.innerHeight > 600) {
          state.showBottomPanel = true;
        }
      }, 0);
    });

    return () => {
      return (
        <>
          <div class={classNames["bottom-panel"]}>
            <div class={classNames["bottom-panel-main-wrapper"]}>
              <div
                class={classNames["fold-wrapper"]}
                onClick={() => {
                  changeBottomPanel();
                }}
              >
                <DArrowRight
                  class={[
                    classNames["arrow"],
                    state.showBottomPanel
                      ? classNames["expand"]
                      : classNames["fold"],
                  ]}
                />
              </div>
              <div
                class={[
                  classNames["bottom-panel-content"],
                  state.showBottomPanel
                    ? classNames["expand"]
                    : classNames["fold"],
                ]}
              >
                <div class={classNames["control-center"]}>
                  {state.showBottomPanel && (
                    <div class={classNames["control-title"]}>控制中心</div>
                  )}
                  <div class={classNames["control-wrapper"]}>
                    <div class={classNames["control-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <Key class={classNames["button-icon"]} />
                      </div>
                      <span>启动</span>
                    </div>
                    <div class={classNames["control-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <Odometer class={classNames["button-icon"]} />
                      </div>
                      <span>熄火</span>
                    </div>
                    <div class={classNames["control-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <Aim class={classNames["button-icon"]} />
                      </div>
                      <span>导航开始</span>
                    </div>
                    <div class={classNames["control-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <Pointer class={classNames["button-icon"]} />
                      </div>
                      <span>导航暂停</span>
                    </div>
                    <div class={classNames["control-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <WarnTriangleFilled class={classNames["button-icon"]} />
                      </div>
                      <span>紧急停止</span>
                    </div>
                    <div class={classNames["control-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <Fold class={classNames["button-icon"]} />
                      </div>
                      <span>解除紧急</span>
                    </div>
                    <div class={classNames["control-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <WarningFilled class={classNames["button-icon"]} />
                      </div>
                      <span>警示信息</span>
                    </div>
                    <div class={classNames["control-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <Operation class={classNames["button-icon"]} />
                      </div>
                      <span>更多操作</span>
                    </div>
                  </div>
                </div>
                <div class={classNames["table-panel"]}>
                  <el-table
                    data={state.tableData}
                    class={classNames["table-wrapper"]}
                    onRowClick={(row: any) => {
                      state.selectedRow = row || {};
                    }}
                  >
                    <el-table-column
                      prop="equipmentType"
                      label="设备类型"
                      width="120"
                    />
                    <el-table-column
                      prop="equipmentName"
                      label="设备名称"
                      width="200"
                    />
                    <el-table-column
                      prop="equipmentCoding"
                      label="设备编码"
                      width="240"
                    />
                    <el-table-column prop="equipmentStatus" label="状态" />
                  </el-table>
                </div>
                <div class={classNames["management-center"]}>
                  {state.showBottomPanel && (
                    <div class={classNames["management-title"]}>管理中心</div>
                  )}
                  <div class={classNames["management-wrapper"]}>
                    <div
                      onClick={handleClick}
                      class={classNames["management-button"]}
                    >
                      <div class={classNames["button-wrapper"]}>
                        <Plus class={classNames["button-icon"]} />
                      </div>
                      <span>新建任务</span>
                    </div>
                    <div class={classNames["management-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <Setting class={classNames["button-icon"]} />
                      </div>
                      <span>参数配置</span>
                    </div>
                    <div class={classNames["management-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <Discount class={classNames["button-icon"]} />
                      </div>
                      <span>作业状态</span>
                    </div>
                    <div class={classNames["management-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <UploadFilled class={classNames["button-icon"]} />
                      </div>
                      <span>历史任务</span>
                    </div>
                    <div class={classNames["management-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <HelpFilled class={classNames["button-icon"]} />
                      </div>
                      <span>360环视</span>
                    </div>
                    <div class={classNames["management-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <Compass class={classNames["button-icon"]} />
                      </div>
                      <span>自主驾驶</span>
                    </div>
                    <div class={classNames["management-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <EditPen class={classNames["button-icon"]} />
                      </div>
                      <span>手动调试</span>
                    </div>
                    <div class={classNames["management-button"]}>
                      <div class={classNames["button-wrapper"]}>
                        <UserFilled class={classNames["button-icon"]} />
                      </div>
                      <span>本地控制</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class={classNames["bottom-panel-form-wrapper"]}>
              <FormPanel
                showFromPanel={state.showFromPanel}
                changeFormPanel={changeFormPanel}
              />
            </div>
          </div>
          <RightPanel deviceNo={state.selectedRow.equipmentCoding} />
        </>
      );
    };
  },
});
