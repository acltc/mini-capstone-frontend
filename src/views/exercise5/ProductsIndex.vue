<template>
  <div class="home">
    <a class="btn btn-outline-info m-3 float-right" data-toggle="collapse" href="#collapseDebugInfo" role="button" aria-expanded="false" aria-controls="collapseDebugInfo"> &#9432; </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p><strong>Data from</strong>: GET {{ appConfig.domain }}{{ appConfig.productsUrl }}</p>
        <p><strong>Data shape</strong>: <span v-html="wordifiedSchema"></span></p>
        <br />
        <p>Note: If a "categories" key exists (where each category has a key of "name"), it will be used to display category links for each product!</p>
      </div>
    </div>
    <div class="container">
      <h1>Products</h1>
      <a href="/"></a>
      <router-link :to="{ name: 'exercise5-products-index', query: { sort: 'price', sort_order: 'asc' } }" append class="btn btn-light">Sort by lowest price</router-link>
      <router-link :to="{ name: 'exercise5-products-index', query: { sort: 'price', sort_order: 'desc' } }" append class="btn btn-light">Sort by highest price</router-link>
      <router-link :to="{ name: 'exercise5-products-index', query: { discount: true } }" append class="btn btn-light">Show only discounted</router-link>
      <router-link :to="{ name: 'exercise5-products-index' }" append class="btn btn-light">Show all</router-link>
      <div class="card-columns">
        <div v-for="product in products" class="card">
          <img class="card-img-top" v-bind:src="getPrimaryImage(product)" alt="Card image cap" />
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <router-link v-for="category in product.categories" :to="{ name: 'exercise5-products-index', query: { category: category.name } }" append class="d-inline-block mr-2 mb-3"> {{ category.name }} </router-link>
            <h6>{{ product.price }}</h6>
            <p class="card-text">{{ product.description | truncate }}</p>
            <router-link :to="{ name: 'exercise5-products-show', params: { id: product.id } }" append class="btn btn-info">More info</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SchemaValidator from "../../mixins/SchemaValidator.js";

export default {
  mixins: [SchemaValidator],
  props: ["appConfig", "showError"],
  data: function() {
    return {
      products: [],
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            productsIdKey: {
              alias: "id",
              type: "integer"
            },
            productsNameKey: {
              alias: "name",
              type: "string"
            },
            productsPriceKey: {
              alias: "price",
              type: "number"
            },
            productsDescriptionKey: {
              alias: "description",
              type: "string"
            },
            productsImagesKey: {
              alias: "images",
              type: "array",
              items: {
                type: "object",
                properties: {
                  imagesUrlKey: {
                    alias: "url",
                    type: "string"
                  }
                }
              }
            }
          }
        }
      }
    };
  },
  created: function() {
    this.requestProducts();
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.requestProducts();
  },
  methods: {
    requestProducts: function() {
      var queryString = this.$route.fullPath.split("?").length > 1 ? "?" + this.$route.fullPath.split("?")[1] : "";
      axios
        .get(this.appConfig.domain + this.appConfig.productsUrl + queryString)
        .then(response => {
          this.products = this.formatDataToSchema(response.data) || this.products;
        })
        .catch(error => {
          this.$emit("showError", ["domain", "productsUrl"], error.request.status);
        });
    },
    getPrimaryImage: function(product) {
      return product.images.length > 0 ? product.images[0].url : "http://www.pinnacleeducations.in/wp-content/uploads/2017/05/no-image.jpg";
    }
  },
  filters: {
    truncate: function(text) {
      if (text === null) {
        return "(No description provided)";
      }
      var maxLength = 120;
      return text.length < maxLength ? text : text.substring(0, maxLength - 3) + "...";
    }
  }
};
</script>
