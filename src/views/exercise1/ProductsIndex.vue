<template>
  <div class="home">
    <a class="btn btn-outline-info m-3 float-right" data-toggle="collapse" href="#collapseDebugInfo" role="button" aria-expanded="false" aria-controls="collapseDebugInfo"> &#9432; </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p><strong>Data from</strong>: GET {{ appConfig.domain }}{{ appConfig.productsUrl }}</p>
        <p><strong>Data shape</strong>: <span v-html="wordifiedSchema"></span></p>
      </div>
    </div>
    <div class="container">
      <h1>Products</h1>
      <div class="card-columns">
        <div v-for="product in products" class="card">
          <img class="card-img-top" v-bind:src="product.image_url" alt="Card image cap" />
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">{{ product.description | truncate }}</p>
            <router-link :to="{ name: 'exercise1-products-show', params: { id: product.id } }" append class="btn btn-info">More info</router-link>
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
  props: ["appConfig"],
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
            productsImageUrlKey: {
              alias: "image_url",
              type: "string"
            }
          }
        }
      }
    };
  },
  created: function() {
    axios
      .get(this.appConfig.domain + this.appConfig.productsUrl)
      .then(response => {
        this.products = this.formatDataToSchema(response.data) || this.products;
      })
      .catch(error => {
        this.$emit("showError", ["domain", "productsUrl"], error.request.status);
      });
  },
  methods: {},
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
