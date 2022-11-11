import { createApp } from "vue";
import { createPinia } from "pinia";
import ArcoVue from "@arco-design/web-vue";
import App from "./App.vue";
import router from "./router";
import 'uno.css'
import "@arco-design/web-vue/dist/arco.css";
import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());

app.use(router);

app.use(ArcoVue, {
  // 用于改变使用组件时的前缀名称
  componentPrefix: "arco",
});

app.mount("#app");
