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

import Exercise4App from "./views/exercise4/App.vue";
import Exercise4ProductsIndex from "./views/exercise4/ProductsIndex.vue";
import Exercise4ProductsShow from "./views/exercise4/ProductsShow.vue";
import Exercise4ProductsNew from "./views/exercise4/ProductsNew.vue";
import Exercise4ProductsEdit from "./views/exercise4/ProductsEdit.vue";
import Exercise4Signup from "./views/exercise4/Signup.vue";
import Exercise4Login from "./views/exercise4/Login.vue";
import Exercise4Logout from "./views/exercise4/Logout.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/restful-routes",
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
      path: "/active-record-queries",
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
      path: "/model-associations",
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
    },
    {
      path: "/authentication",
      component: Exercise4App,
      children: [
        {
          path: "",
          component: Exercise4ProductsIndex,
          name: "exercise4-home"
        },
        {
          path: "products",
          component: Exercise4ProductsIndex,
          name: "exercise4-products-index"
        },
        {
          path: "products/new",
          component: Exercise4ProductsNew,
          name: "exercise4-products-new"
        },
        {
          path: "products/:id",
          component: Exercise4ProductsShow,
          name: "exercise4-products-show"
        },
        {
          path: "products/:id/edit",
          component: Exercise4ProductsEdit,
          name: "exercise4-products-edit"
        },
        {
          path: "signup",
          component: Exercise4Signup,
          name: "exercise4-signup"
        },
        {
          path: "login",
          component: Exercise4Login,
          name: "exercise4-login"
        },
        {
          path: "logout",
          component: Exercise4Logout,
          name: "exercise4-logout"
        }
      ]
    }
  ]
});
