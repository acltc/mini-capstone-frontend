<template>
  <div class="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link :to="{ name: 'exercise5-products-index' }" class="navbar-brand">{{ appConfig.name }}</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active"><router-link :to="{ name: 'exercise5-products-index' }" class="nav-link">All products</router-link></li>
          <li v-if="isAdmin()" class="nav-item"><router-link :to="{ name: 'exercise5-products-new' }" class="nav-link">New product</router-link></li>
          <li v-if="loggedIn()" class="nav-item"><span class="nav-link disabled"> | </span></li>
          <li v-if="loggedIn()" class="nav-item"><router-link :to="{ name: 'exercise5-carted-products-index' }" class="nav-link">Shopping Cart</router-link></li>
          <li v-if="loggedIn()" class="nav-item"><router-link :to="{ name: 'exercise5-orders-index' }" class="nav-link">Orders</router-link></li>
          <li class="nav-item"><span class="nav-link disabled"> | </span></li>
          <li v-if="!loggedIn()" class="nav-item"><router-link :to="{ name: 'exercise5-signup' }" class="nav-link">Signup</router-link></li>
          <li v-if="!loggedIn()" class="nav-item"><router-link :to="{ name: 'exercise5-login' }" class="nav-link">Login</router-link></li>
          <li v-if="loggedIn()" class="nav-item"><router-link :to="{ name: 'exercise5-logout' }" class="nav-link">Logout</router-link></li>
        </ul>

        <form v-on:submit.prevent="submitSearch();" class="form-inline my-2 my-lg-0"><input v-model="searchTerms" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" /> <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button></form>
      </div>
    </nav>
    <router-view v-bind:appConfig="appConfig" v-bind:isAdmin="isAdmin" v-on:showError="showError" />

    <div class="modal fade" id="errorModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Error: {{ errorMessage }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          </div>
          <div class="modal-body">
            <div v-for="(value, key) in appConfig" class="form-group row">
              <label :for="key" class="col-sm-6 col-form-label" v-bind:class="{ 'text-danger': missingKeys.includes(key) }">{{ key }}</label>
              <div class="col-sm-6"><input type="text" class="form-control" v-bind:class="{ 'is-invalid': missingKeys.includes(key) }" :id="key" v-model="appConfig[key]" /></div>
            </div>
          </div>
          <div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button @click="saveConfig" type="button" class="btn btn-primary">Save changes</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  background: url("../../assets/gplaypattern.png");
}
</style>

<script>
/* global $ */
export default {
  data: function() {
    return {
      appConfig: {
        name: "Mini-capstone",
        domain: "http://localhost:3000",
        productsUrl: "/api/products",
        productsIdKey: "id",
        productsNameKey: "name",
        productsPriceKey: "price",
        productsImagesKey: "images",
        productsDescriptionKey: "description",
        imagesUrl: "/api/images",
        imagesIdKey: "id",
        imagesUrlKey: "url",
        suppliersUrl: "/api/suppliers",
        suppliersIdKey: "id",
        suppliersNameKey: "name",
        cartedProductsUrl: "/api/carted_products",
        cartedProductsIdKey: "id",
        cartedProductsQuantityKey: "quantity",
        cartedProductsProductKey: "product",
        ordersUrl: "/api/orders",
        ordersIdKey: "id",
        ordersCartedProductsKey: "carted_products",
        ordersSubtotalKey: "subtotal",
        ordersTaxKey: "tax",
        ordersTotalKey: "total"
      },
      missingKeys: [],
      errorMessage: "",
      searchTerms: ""
    };
  },
  created: function() {
    this.configureFromLocalStorage();
  },
  methods: {
    configureFromLocalStorage: function() {
      Object.keys(this.appConfig).forEach(key => {
        var value = localStorage.getItem(key);
        if (value === null) {
          localStorage.setItem(key, this.appConfig[key]);
        } else {
          this.appConfig[key] = value;
        }
      });
    },
    showError: function(missingKeys, statusCode = 200) {
      const statusCodeErrorMessages = {
        0: "Failed to connect (check if server is running with CORS configured)",
        200: "JSON doesn't match (configure keys below)",
        401: "Unauthorized for this page",
        404: "Route does not exist",
        500: "Code is crashing on server"
      };
      this.errorMessage = statusCodeErrorMessages[statusCode] || "Unknown error";
      this.missingKeys = missingKeys;
      $("#errorModal").modal("show");
    },
    saveConfig: function() {
      Object.keys(this.appConfig).forEach(key => {
        localStorage.setItem(key, this.appConfig[key]);
      });
      location.reload();
    },
    submitSearch: function() {
      var searchTerms = this.searchTerms;
      this.searchTerms = "";
      this.$router.push({
        name: "exercise5-products-index",
        query: { search: searchTerms }
      });
    },
    loggedIn: function() {
      return localStorage.getItem("jwt") ? true : false;
    },
    isAdmin: function() {
      return localStorage.getItem("admin") === "true";
    }
  },
  computed: {}
};
</script>
