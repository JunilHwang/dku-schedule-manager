import { createRouter, createWebHistory } from "vue-router";
import { Home } from "../views";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
  ],
});
