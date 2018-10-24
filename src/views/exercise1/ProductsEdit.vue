<template>
  <div class="home">
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
      appBaseUrl: "http://localhost:3000/api",
      appProductUrl: "/products",
      appProductNameKey: "name",
      appProductPriceKey: "price",
      appProductImageUrlKey: "image_url",
      appProductDescriptionKey: "description",
      product: {},
      errors: []
    };
  },
  created: function() {
    axios
      .get(this.appBaseUrl + this.appProductUrl + "/" + this.$route.params.id)
      .then(response => {
        this.product = this.formatProductResponse(response.data);
      });
  },
  methods: {
    formatProductResponse: function(data) {
      return {
        id: data["id"],
        name: data[this.appProductNameKey],
        price: data[this.appProductPriceKey],
        image_url: data[this.appProductImageUrlKey],
        description: data[this.appProductDescriptionKey]
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
          this.appBaseUrl + this.appProductUrl + "/" + this.$route.params.id,
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
