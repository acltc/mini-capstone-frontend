<template>
  <div class="home">
    <div class="container">
      <form v-on:submit.prevent="submit()">
        <h1>New product</h1>
        <ul>
          <li class="text-danger" v-for="error in errors">{{ error }}</li>
        </ul>
        <div class="form-group">
          <label>Name:</label> 
          <input type="text" class="form-control" v-model="name">
        </div>
        <div class="form-group">
          <label>Price:</label> 
          <input type="text" class="form-control" v-model="price">
        </div>
        <div class="form-group">
          <label>Image url:</label> 
          <input type="text" class="form-control" v-model="image_url">
        </div>
        <div class="form-group">
          <label>Description:</label> 
          <input type="text" class="form-control" v-model="description">
        </div>
        <input type="submit" class="btn btn-primary mr-1" value="Submit">
        <router-link :to="{ name: 'exercise1-products-index' }" class="btn btn-secondary">Cancel</router-link>
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
      name: "",
      price: "",
      image_url: "",
      description: "",
      errors: []
    };
  },
  created: function() {},
  methods: {
    submit: function() {
      var params = {
        name: this.name,
        price: this.price,
        image_url: this.image_url,
        description: this.description
      };
      axios
        .post(this.appBaseUrl + this.appProductUrl, params)
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
