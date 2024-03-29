import { createRouter, createWebHistory } from "vue-router";
import { Home, Shared } from "../views";

export const router = createRouter({
  history: createWebHistory("/dku-schedule-manager"),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/shared",
      name: "Shared",
      component: Shared,
    },
  ],
});
