import Vue from "vue";
import VueRouter from "vue-router";
// import Home from '../views/Home.vue'
import Main from "../views/Main.vue";
import CategoryEdit from "../views/CategoryEdit.vue";
import CategoryList from "../views/CategoryList.vue";

import ItemEdit from "../views/ItemEdit.vue";
import ItemList from "../views/ItemList.vue";

import HeroEdit from "../views/HeroEdit.vue";
import HeroList from "../views/HeroList.vue";

import ArticleEdit from "../views/ArticleEdit.vue";
import ArticleList from "../views/ArticleList.vue";




Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
    children: [
      { path: "/categories/create", component: CategoryEdit },
      { path: "/categories/edit/:id", component: CategoryEdit, props:true },
      { path: "/categories/list", component: CategoryList },

      { path: "/items/create", component: ItemEdit },
      { path: "/items/edit/:id", component: ItemEdit, props:true },
      { path: "/items/list", component: ItemList },

      { path: "/heros/create", component: HeroEdit },
      { path: "/heros/edit/:id", component: HeroEdit, props:true },
      { path: "/heros/list", component: HeroList },

      { path: "/articles/create", component: ArticleEdit },
      { path: "/articles/edit/:id", component: ArticleEdit, props:true },
      { path: "/articles/list", component: ArticleList },
    ],
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
