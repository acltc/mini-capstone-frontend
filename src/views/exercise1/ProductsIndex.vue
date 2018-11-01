<template>
  <div class="home">
    <a class="btn btn-outline-info m-3 float-right" data-toggle="collapse" href="#collapseDebugInfo" role="button" aria-expanded="false" aria-controls="collapseDebugInfo">
      &#9432;
    </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p><strong>Data from</strong>: GET {{appConfig.domain}}{{appConfig.productsUrl}}</p>
        <p><strong>Using keys</strong>: {{appConfig.productsIdKey}}, {{appConfig.productsNameKey}}, {{appConfig.productsPriceKey}}, {{appConfig.productsImageUrlKey}}, {{appConfig.productsDescriptionKey}}</p>
      </div>
    </div>
    <div class="container">
      <h1>Products</h1>
      <div class="card-columns">
        <div v-for="product in products" class="card">
          <img class="card-img-top" v-bind:src="product.image_url" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">{{ product.description | truncate }}</p>
            <router-link :to="{ name: 'exercise1-products-show', params: {id: product.id}}" append class="btn btn-info">More info</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      products: []
    };
  },
  props: ["appConfig"],
  created: function() {
    axios
      .get(this.appConfig.domain + this.appConfig.productsUrl)
      .then(response => {
        this.products = this.formatProductResponse(response.data);
      })
      .catch(error => {
        this.$emit("showError", [
          this.appConfig.domain,
          this.appConfig.productsUrl
        ]);
      });
  },
  methods: {
    formatProductResponse: function(data) {
      var missingKeys = [];
      var requiredKeys = [
        this.appConfig.productsIdKey,
        this.appConfig.productsNameKey,
        this.appConfig.productsPriceKey,
        this.appConfig.productsImageUrlKey,
        this.appConfig.productsDescriptionKey
      ];
      requiredKeys.forEach(requiredKey => {
        if (data[0][requiredKey] === undefined) {
          missingKeys.push(requiredKey);
        }
      });
      if (missingKeys.length > 0) {
        this.$emit("showError", missingKeys);
        return;
      }
      return data.map(product => {
        return {
          id: product[this.appConfig.productsIdKey],
          name: product[this.appConfig.productsNameKey],
          price: product[this.appConfig.productsPriceKey],
          image_url: product[this.appConfig.productsImageUrlKey],
          description: product[this.appConfig.productsDescriptionKey]
        };
      });
    }
  },
  filters: {
    truncate: function(text) {
      var maxLength = 120;
      return text.length < maxLength
        ? text
        : text.substring(0, maxLength - 3) + "...";
    }
  }
};
</script>
