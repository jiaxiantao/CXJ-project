import { defineComponent, onMounted, reactive, ref, unref } from "vue";
import classNames from "./index.module.less";
import { DArrowLeft, DArrowRight, SwitchButton } from "@element-plus/icons-vue";

export default defineComponent({
  props: {
    showFromPanel: Boolean,
    changeFormPanel: Function,
  },
  setup(props) {
    const state = reactive({
      formData: {
        region: "",
        name: "",
        resource: "",
        desc: "",
      },
    });

    const changeFormPanel = () => {
      props.changeFormPanel && props.changeFormPanel();
    };

    const onSubmit = () => {
      changeFormPanel();
    };

    onMounted(() => {});

    return () => {
      const showFromPanel = props.showFromPanel;
      return (
        <div class={classNames["form-panel"]}>
          <div
            class={classNames["fold-wrapper"]}
            onClick={() => {
              changeFormPanel();
            }}
          >
            <DArrowRight
              class={[
                classNames["arrow"],
                showFromPanel ? classNames["expand"] : classNames["fold"],
              ]}
            />
          </div>
          <div
            class={[
              classNames["form-panel-content"],
              showFromPanel ? classNames["expand"] : classNames["fold"],
            ]}
          >
            <div class={classNames["form-panel-content-wrapper"]}>
              <el-form model="form" label-width="auto">
                <el-form-item label="作业类型">
                  <el-select
                    v-model={state.formData.region}
                    placeholder="请选择作业类型"
                    class="custom-select"
                  >
                    <el-option label="0" value="耕地" />
                    <el-option label="1" value="洒水" />
                  </el-select>
                </el-form-item>
                <el-form-item label="机具宽度（米）">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="接行宽度（米）">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="作业模式">
                  <el-radio-group v-model={state.formData.resource}>
                    <el-radio value="0">AB点</el-radio>
                    <el-radio value="1">ABCD点</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="A点纬度">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="A点经度">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="到B点的安全距离（米）">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="B点纬度">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="B点经度">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="到C点的安全距离（米）">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="到C点的安全距离（米）">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="C点纬度">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="C点经度">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="到D点的安全距离（米）">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="到C点的安全距离（米）">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="到C点的安全距离（米）">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="D点纬度">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="D点经度">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="到A点的安全距离（米）">
                  <el-input v-model={state.formData.name} />
                </el-form-item>
                <el-form-item label="Activity form">
                  <el-input v-model={state.formData.desc} type="textarea" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" onClick={onSubmit}>
                    保存
                  </el-button>
                  <el-button>取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      );
    };
  },
});
