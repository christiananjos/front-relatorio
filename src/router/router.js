import Vue from "vue";
import VueRouter from "vue-router";
import Homepage from "../pages/HomePage";

Vue.use(VueRouter);

const routes = [
  {
    name: "Home",
    path: "/",
    component: Homepage,
  },
];

const router = new VueRouter({
  mode: "history",
  base: "localhost:8080",
  routes,
});

export default router;
