<template>
  <div class="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link :to="{ name: 'exercise1-products-index' }" class="navbar-brand">{{ appConfig.name }}</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active"><router-link :to="{ name: 'exercise1-products-index' }" class="nav-link">All products</router-link></li>
          <li class="nav-item"><router-link :to="{ name: 'exercise1-products-new' }" class="nav-link">New product</router-link></li>
        </ul>
      </div>
    </nav>
    <router-view v-bind:appConfig="appConfig" v-on:showError="showError" />

    <div class="modal fade" id="errorModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Error with app configuration</h5>
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
        productsImageUrlKey: "image_url",
        productsDescriptionKey: "description"
      },
      missingKeys: []
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
    showError: function(missingKeys) {
      this.missingKeys = missingKeys;
      $("#errorModal").modal("show");
    },
    saveConfig: function() {
      Object.keys(this.appConfig).forEach(key => {
        localStorage.setItem(key, this.appConfig[key]);
      });
      location.reload();
    }
  },
  computed: {}
};
</script>
