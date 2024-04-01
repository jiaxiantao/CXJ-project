import PageStack from "page-stack-vue3";
import { VNode, defineComponent, onMounted, watch } from "vue";
import { RouteLocation, RouterView, useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();

    watch(
      () => router.currentRoute.value,
      (current) => {
        if (current.meta?.title) {
          document.title = current.meta?.title as string;
        }
      }
    );
    onMounted(() => {});
    return function () {
      return (
        <RouterView>
          {function ({ Component, route }: { Component: VNode; route: RouteLocation }) {
            return (
              <PageStack router={router} mergeQueryToProps={true} disableAnimation={false}>
                {Component}
              </PageStack>
            );
          }}
        </RouterView>
      );
    };
  },
});
