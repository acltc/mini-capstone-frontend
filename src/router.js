import Vue from "vue";
import Router from "vue-router";

import Exercise1App from "./views/exercise1/App.vue";
import Exercise1ProductsIndex from "./views/exercise1/ProductsIndex.vue";
import Exercise1ProductsShow from "./views/exercise1/ProductsShow.vue";
import Exercise1ProductsNew from "./views/exercise1/ProductsNew.vue";
import Exercise1ProductsEdit from "./views/exercise1/ProductsEdit.vue";

import Exercise2App from "./views/exercise2/App.vue";
import Exercise2ProductsIndex from "./views/exercise2/ProductsIndex.vue";
import Exercise2ProductsShow from "./views/exercise2/ProductsShow.vue";
import Exercise2ProductsNew from "./views/exercise2/ProductsNew.vue";
import Exercise2ProductsEdit from "./views/exercise2/ProductsEdit.vue";

import Exercise3App from "./views/exercise3/App.vue";
import Exercise3ProductsIndex from "./views/exercise3/ProductsIndex.vue";
import Exercise3ProductsShow from "./views/exercise3/ProductsShow.vue";
import Exercise3ProductsNew from "./views/exercise3/ProductsNew.vue";
import Exercise3ProductsEdit from "./views/exercise3/ProductsEdit.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/fdsleiwoiefjw",
      component: Exercise1App,
      children: [
        {
          path: "",
          component: Exercise1ProductsIndex,
          name: "exercise1-home"
        },
        {
          path: "products",
          component: Exercise1ProductsIndex,
          name: "exercise1-products-index"
        },
        {
          path: "products/new",
          component: Exercise1ProductsNew,
          name: "exercise1-products-new"
        },
        {
          path: "products/:id",
          component: Exercise1ProductsShow,
          name: "exercise1-products-show"
        },
        {
          path: "products/:id/edit",
          component: Exercise1ProductsEdit,
          name: "exercise1-products-edit"
        }
      ]
    },
    {
      path: "/adafeafesf",
      component: Exercise2App,
      children: [
        {
          path: "",
          component: Exercise2ProductsIndex,
          name: "exercise2-home"
        },
        {
          path: "products",
          component: Exercise2ProductsIndex,
          name: "exercise2-products-index"
        },
        {
          path: "products/new",
          component: Exercise2ProductsNew,
          name: "exercise2-products-new"
        },
        {
          path: "products/:id",
          component: Exercise2ProductsShow,
          name: "exercise2-products-show"
        },
        {
          path: "products/:id/edit",
          component: Exercise2ProductsEdit,
          name: "exercise2-products-edit"
        }
      ]
    },
    {
      path: "/qwerewr",
      component: Exercise3App,
      children: [
        {
          path: "",
          component: Exercise3ProductsIndex,
          name: "exercise3-home"
        },
        {
          path: "products",
          component: Exercise3ProductsIndex,
          name: "exercise3-products-index"
        },
        {
          path: "products/new",
          component: Exercise3ProductsNew,
          name: "exercise3-products-new"
        },
        {
          path: "products/:id",
          component: Exercise3ProductsShow,
          name: "exercise3-products-show"
        },
        {
          path: "products/:id/edit",
          component: Exercise3ProductsEdit,
          name: "exercise3-products-edit"
        }
      ]
    }
  ]
});
