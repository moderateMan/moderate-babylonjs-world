import {
  createRouter,
  createWebHistory,
} from "vue-router";
import { Hello } from "../pages";

let loginPage = {
  path: "/",
  name: "login",
  title: "登录",
  component: Hello,
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [loginPage],
});

export default router;
