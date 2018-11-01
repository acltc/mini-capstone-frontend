<template>
  <div class="home">
    <a class="btn btn-outline-info m-3 float-right" data-toggle="collapse" href="#collapseDebugInfo" role="button" aria-expanded="false" aria-controls="collapseDebugInfo">
      &#9432;
    </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p><strong>Data sending to</strong>: PATCH {{appConfig.domain}}{{appConfig.productsUrl}}/{{$route.params.id}}</p>
        <p><strong>Using params keys</strong>: name, price, image_url, description</p>
      </div>
    </div>
    <div class="container">
      <form v-on:submit.prevent="submit()">
        <h1>Edit product</h1>
        <ul>
          <li class="text-danger" v-for="error in errors">{{ error }}</li>
        </ul>
        <div class="form-group">
          <label>Name:</label> 
          <input type="text" class="form-control" v-model="product.name">
        </div>
        <div class="form-group">
          <label>Price:</label> 
          <input type="text" class="form-control" v-model="product.price">
        </div>
        <div class="form-group">
          <label>Image url:</label> 
          <input type="text" class="form-control" v-model="product.image_url">
        </div>
        <div class="form-group">
          <label>Description:</label> 
          <input type="text" class="form-control" v-model="product.description">
        </div>
        <input type="submit" class="btn btn-primary mr-1" value="Submit">
        <router-link :to="{ name: 'exercise1-products-show', params: {id: product.id} }" class="btn btn-secondary">Cancel</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      product: { id: 0 },
      errors: []
    };
  },
  props: ["appConfig"],
  created: function() {
    axios
      .get(
        this.appConfig.domain +
          this.appConfig.productsUrl +
          "/" +
          this.$route.params.id
      )
      .then(response => {
        this.product = this.formatProductResponse(response.data);
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
        if (data[requiredKey] === undefined) {
          missingKeys.push(requiredKey);
        }
      });
      if (missingKeys.length > 0) {
        this.$emit("showError", missingKeys);
        return;
      }
      return {
        id: data[this.appConfig.productsIdKey],
        name: data[this.appConfig.productsNameKey],
        price: data[this.appConfig.productsPriceKey],
        image_url: data[this.appConfig.productsImageUrlKey],
        description: data[this.appConfig.productsDescriptionKey]
      };
    },
    submit: function() {
      var params = {
        name: this.product.name,
        price: this.product.price,
        image_url: this.product.image_url,
        description: this.product.description
      };
      axios
        .patch(
          this.appConfig.domain +
            this.appConfig.productsUrl +
            "/" +
            this.$route.params.id,
          params
        )
        .then(response => {
          this.$router.push({
            name: "exercise1-products-show",
            params: { id: response.data.id }
          });
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    }
  }
};
</script>
