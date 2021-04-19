import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import UserRepos from "../views/UserRepos.vue";
import UserPage from "../views/UserPage.vue";




Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/userRepos/:user",
    props: true,
    name: "UserRepos",
    component: UserRepos,
  },
  {
    path: "/userPage/:user",
    name: "UserPage",
    props: true,
    component: UserPage,
  },
  
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;


