import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./styles/reset.scss";

import ko from "element-plus/es/locale/lang/ko";
import App from "./App.vue";


createApp(App)
  .use(ElementPlus, {
    locale: ko,
  })
  .mount("#app", true);
