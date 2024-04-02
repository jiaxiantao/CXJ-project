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
        name1: "",
        name2: "",
        name3: "",
        name4: "",
        name5: "",
        name6: "",
        name7: "",
        name8: "",
        name9: "",
        name10: "",
        name11: "",
        name12: "",
        name13: "",
        name14: "",
        name15: "",
        name16: "",
        name17: ""
      },
    });

    const changeFormPanel = () => {
      props.changeFormPanel && props.changeFormPanel();
    };

    const onSubmit = () => {
      changeFormPanel();
    };

    const onCancel = () => {
      changeFormPanel();
    };

    onMounted(() => {});

    return () => {
      const showFromPanel = props.showFromPanel;
      return (
        <div class={classNames["form-panel"]}>
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
                    placeholder="请下拉选择"
                    class="custom-select"
                  >
                    <el-option label="无作业" value="0" />
                    <el-option label="犁地" value="1" />
                    <el-option label="深松" value="2" />
                    <el-option label="肥地" value="3" />
                    <el-option label="旋耕" value="4" />
                    <el-option label="打桨" value="5" />
                    <el-option label="播种" value="6" />
                    <el-option label="插秧" value="7" />
                    <el-option label="喷雾" value="8" />
                    <el-option label="施肥" value="9" />
                    <el-option label="收货" value="10" />
                    <el-option label="开沟" value="11" />
                    <el-option label="起垄" value="12" />
                  </el-select>
                </el-form-item>
                <el-form-item label="机具宽度（米）">
                  <el-input v-model={state.formData.name1} />
                </el-form-item>
                <el-form-item label="接行宽度（米）">
                  <el-input v-model={state.formData.name2} />
                </el-form-item>
                <el-form-item label="作业模式">
                  <el-radio-group v-model={state.formData.resource}>
                    <el-radio value="0">AB点</el-radio>
                    <el-radio value="1">ABCD点</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="A点纬度">
                  <el-input v-model={state.formData.name3} />
                </el-form-item>
                <el-form-item label="A点经度">
                  <el-input v-model={state.formData.name4} />
                </el-form-item>
                <el-form-item label="到B点的安全距离（米）">
                  <el-input v-model={state.formData.name5} />
                </el-form-item>
                <el-form-item label="B点纬度">
                  <el-input v-model={state.formData.name6} />
                </el-form-item>
                <el-form-item label="B点经度">
                  <el-input v-model={state.formData.name7} />
                </el-form-item>
                <el-form-item label="到C点的安全距离（米）">
                  <el-input v-model={state.formData.name8} />
                </el-form-item>
                <el-form-item label="到C点的安全距离（米）">
                  <el-input v-model={state.formData.name9} />
                </el-form-item>
                <el-form-item label="C点纬度">
                  <el-input v-model={state.formData.name10} />
                </el-form-item>
                <el-form-item label="C点经度">
                  <el-input v-model={state.formData.name11} />
                </el-form-item>
                <el-form-item label="到D点的安全距离（米）">
                  <el-input v-model={state.formData.name12} />
                </el-form-item>
                <el-form-item label="到C点的安全距离（米）">
                  <el-input v-model={state.formData.name13} />
                </el-form-item>
                <el-form-item label="到C点的安全距离（米）">
                  <el-input v-model={state.formData.name14} />
                </el-form-item>
                <el-form-item label="D点纬度">
                  <el-input v-model={state.formData.name15} />
                </el-form-item>
                <el-form-item label="D点经度">
                  <el-input v-model={state.formData.name16} />
                </el-form-item>
                <el-form-item label="到A点的安全距离（米）">
                  <el-input v-model={state.formData.name17} />
                </el-form-item>
                <el-form-item>
                  <div class={classNames["form-submit-wrapper"]}>
                    <el-button type="primary" onClick={onSubmit}>
                      提交
                    </el-button>
                    <el-button onClick={onCancel}>取消</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      );
    };
  },
});
