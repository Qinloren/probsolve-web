import { createRouter, createWebHistory } from "vue-router";
import { message } from 'ant-design-vue'

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
        },
        {
          path: "user/login",
          name: "user-login",
          component: () => import("@/views/LoginView.vue"),
        },
        {
          path: "user/register",
          name: "user-register",
          component: () => import("@/views/RegisterView.vue"),
        },
        {
          path: "user/profile",
          name: "user-profile",
          meta: {
            requiresAuth: true
          },
          component: () => import("@/views/ProfileView.vue"),
        },
        {
          path: "user/question/lib",
          name: "user-question-lib",
          meta: {
            requiresAuth: true
          },
          component: () => import("@/views/QuestionLibView.vue"),
        }
      ]
    },
    {
      path: "/study",
      component: () => import("@/layout/DefaultLayout.vue"),
      children: [
        {
          path: "practise",
          name: "practise",
          meta: {
            requiresAuth: true
          },
          component: () => import("@/views/PractiseView.vue")
        }
      ]
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  const { useUserStore } = await import("@/stores/user.ts");
  const userStore = useUserStore();
  if (to.meta.requiresAuth) {
    const isValid = await userStore.checkLoginToken();
    if (!isValid) {
      message.error("请先登录后在操作！")
      next({
        name: "user-login",
        query: {
          redirect: to.fullPath
        }
      })
      return
    }
  }
  next()
  // if (to.name && to.name.toString().startsWith("user-")) {
//     if (!userStore.isLogin()) {
//       notification.warning({
//         message: "请先登录",
//         description: "登录后即可访问该页面。",
//         duration: 2,
//       });
//       next({
//         name: "user-login",
//         query: {
//           redirect: to.fullPath,
//         }
//       })
//       return false;
//     } else {
//       next();
//     }
//   }
//   return true;
})

export default router;
