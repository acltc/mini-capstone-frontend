<template>
  <div class="home">
    <a
      class="btn btn-outline-info m-3 float-right"
      data-toggle="collapse"
      href="#collapseDebugInfo"
      role="button"
      aria-expanded="false"
      aria-controls="collapseDebugInfo"
    >
      &#9432;
    </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p>
          <strong>Data from</strong>: GET {{ appConfig.domain
          }}{{ appConfig.productsUrl }}
        </p>
        <p>
          <strong>Data shape</strong>: <span v-html="wordifiedSchema"></span>
        </p>
      </div>
    </div>
    <div class="container">
      <h1>Products</h1>
      <a href="/"></a>
      <router-link
        :to="{
          name: 'exercise2-products-index',
          query: { sort: 'price', sort_order: 'asc' }
        }"
        append
        class="btn btn-light"
        >Sort by lowest price</router-link
      >
      <router-link
        :to="{
          name: 'exercise2-products-index',
          query: { sort: 'price', sort_order: 'desc' }
        }"
        append
        class="btn btn-light"
        >Sort by highest price</router-link
      >
      <router-link
        :to="{ name: 'exercise2-products-index', query: { discount: true } }"
        append
        class="btn btn-light"
        >Show only discounted</router-link
      >
      <router-link
        :to="{ name: 'exercise2-products-index' }"
        append
        class="btn btn-light"
        >Show all</router-link
      >
      <div class="card-columns">
        <div v-for="product in products" class="card">
          <img
            class="card-img-top"
            v-bind:src="product.image_url"
            alt="Card image cap"
          />
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <h6>{{ product.price }}</h6>
            <p class="card-text">{{ product.description | truncate }}</p>
            <router-link
              :to="{
                name: 'exercise2-products-show',
                params: { id: product.id }
              }"
              append
              class="btn btn-info"
              >More info</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { validateAndFormatData } from "../../helpers.js";

export default {
  data: function() {
    return {
      products: [],
      wordifiedSchema: "",
      productsSchema: {
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
            productsImageUrlKey: {
              alias: "image_url",
              type: "string"
            }
          }
        }
      }
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
          this.$emit("showError", ["domain", "productsUrl"]);
        });
    },
    formatProductResponse: function(data) {
      let {
        invalidKeys,
        formattedData,
        wordifiedSchema
      } = validateAndFormatData(data, this.productsSchema, this.appConfig);
      if (invalidKeys.length > 0) {
        this.$emit("showError", invalidKeys);
        return this.products;
      } else {
        this.wordifiedSchema = wordifiedSchema;
        return formattedData;
      }
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
