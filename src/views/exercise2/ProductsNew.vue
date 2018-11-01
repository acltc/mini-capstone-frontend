<template>
  <div class="home">
    <a class="btn btn-outline-info m-3 float-right" data-toggle="collapse" href="#collapseDebugInfo" role="button" aria-expanded="false" aria-controls="collapseDebugInfo">
      &#9432;
    </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p><strong>Data sending to</strong>: POST {{appConfig.domain}}{{appConfig.productsUrl}}</p>
        <p><strong>Using params keys</strong>: name, price, image_url, description</p>
      </div>
    </div>
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
        <router-link :to="{ name: 'exercise2-products-index' }" class="btn btn-secondary">Cancel</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      name: "",
      price: "",
      image_url: "",
      description: "",
      errors: []
    };
  },
  props: ["appConfig"],
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
        .post(this.appConfig.domain + this.appConfig.productsUrl, params)
        .then(response => {
          this.$router.push({
            name: "exercise2-products-show",
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
