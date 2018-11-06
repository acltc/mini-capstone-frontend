<template>
  <div class="home">
    <a class="btn btn-outline-info m-3 float-right" data-toggle="collapse" href="#collapseDebugInfo" role="button" aria-expanded="false" aria-controls="collapseDebugInfo">
      &#9432;
    </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p><strong>Data from</strong>: GET {{appConfig.domain}}{{appConfig.productsUrl}}</p>
        <p><strong>Using keys</strong>: {{appConfig.productsIdKey}}, {{appConfig.productsNameKey}}, {{appConfig.productsPriceKey}}, {{appConfig.productsImagesKey}} (an array of hashes with keys of {{this.appConfig.imagesUrlKey}}), {{appConfig.productsDescriptionKey}}</p>
      </div>
    </div>
    <div class="container">
      <h1>Products</h1>
      <a href="/"></a>
      <router-link :to="{ name: 'exercise5-products-index', query: {sort: 'price', sort_order: 'asc'}}" append class="btn btn-light">Sort by lowest price</router-link>
      <router-link :to="{ name: 'exercise5-products-index', query: {sort: 'price', sort_order: 'desc'}}" append class="btn btn-light">Sort by highest price</router-link>
      <router-link :to="{ name: 'exercise5-products-index', query: {discount: true}}" append class="btn btn-light">Show only discounted</router-link>
      <router-link :to="{ name: 'exercise5-products-index'}" append class="btn btn-light">Show all</router-link>
      <div class="card-columns">
        <div v-for="product in products" class="card">
          <img class="card-img-top" v-bind:src="getPrimaryImage(product)" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <router-link
              v-for="category in product.categories"
              :to="{ name: 'exercise5-products-index', query: {category: category.name}}"
              append
              class="d-inline-block mr-2 mb-3"
            >
              {{category.name}}
            </router-link>
            <h6>{{ product.price }}</h6>
            <p class="card-text">{{ product.description | truncate }}</p>
            <router-link :to="{ name: 'exercise5-products-show', params: {id: product.id}}" append class="btn btn-info">More info</router-link>
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
    this.requestProducts();
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.requestProducts();
  },
  methods: {
    requestProducts: function() {
      var queryString =
        this.$route.fullPath.split("?").length > 1
          ? "?" + this.$route.fullPath.split("?")[1]
          : "";
      axios
        .get(this.appConfig.domain + this.appConfig.productsUrl + queryString)
        .then(response => {
          this.products = this.formatProductResponse(response.data);
        })
        .catch(error => {
          console.log(error);
          this.$emit("showError", [
            this.appConfig.domain,
            this.appConfig.productsUrl
          ]);
        });
    },
    formatProductResponse: function(data) {
      if (data.length === 0) {
        return;
      }
      var missingKeys = [];
      var requiredKeys = [
        this.appConfig.productsIdKey,
        this.appConfig.productsNameKey,
        this.appConfig.productsPriceKey,
        this.appConfig.productsImagesKey,
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
      for (var i = 0; i < data.length; i++) {
        var images = data[i][this.appConfig.productsImagesKey];
        for (var j = 0; j < images.length; j++) {
          if (images[j][this.appConfig.imagesUrlKey] === undefined) {
            missingKeys.push(this.appConfig.imagesUrlKey);
            this.$emit("showError", missingKeys);
            return;
          }
        }
      }
      var validCategories = true;
      for (i = 0; i < data.length; i++) {
        var categories = data[i]["categories"];
        if (categories === undefined) {
          validCategories = false;
          break;
        } else {
          for (j = 0; j < categories.length; j++) {
            if (categories[j]["name"] === undefined) {
              validCategories = false;
              break;
            }
          }
        }
      }
      return data.map(product => {
        return {
          id: product[this.appConfig.productsIdKey],
          name: product[this.appConfig.productsNameKey],
          price: product[this.appConfig.productsPriceKey],
          images: product[this.appConfig.productsImagesKey].map(image => {
            return {
              id: image[this.appConfig.imagesIdKey],
              url: image[this.appConfig.imagesUrlKey]
            };
          }),
          description: product[this.appConfig.productsDescriptionKey],
          categories: validCategories ? product["categories"] : []
        };
      });
    },
    getPrimaryImage: function(product) {
      return product.images.length > 0
        ? product.images[0].url
        : "http://www.pinnacleeducations.in/wp-content/uploads/2017/05/no-image.jpg";
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
