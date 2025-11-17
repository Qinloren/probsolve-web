import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/layout/DefaultLayout.vue"),
      redirect: {
        name: "home",
      },
      children: [
        {
          path: "home",
          name: "home",
          component: () => import("@/views/HomeView.vue"),
        }
      ]
    }
  ],
});

export default router;
