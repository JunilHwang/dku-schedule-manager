import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./styles/reset.scss";

import ko from "element-plus/es/locale/lang/ko";
import App from "./App.vue";
import { router } from "./router";

const app = createApp(App)
  .use(ElementPlus, { locale: ko })
  .use(router)
  .mount("#app");
