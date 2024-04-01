import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: "/",
      component: () => import("@/views/home/index"),
      meta: { title: "首页" },
    },
  ],
});

export default router;
