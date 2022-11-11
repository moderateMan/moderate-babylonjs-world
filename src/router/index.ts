import {
  createRouter,
  createWebHistory,
} from "vue-router";
import { Login } from "../pages";

let loginPage = {
  path: "/",
  name: "login",
  title: "登录",
  component: Login,
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [loginPage],
});

export default router;
