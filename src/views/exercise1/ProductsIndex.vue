<template>
  <div class="home">
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
      appBaseUrl: "http://localhost:3000/api",
      appProductUrl: "/products",
      appProductNameKey: "name",
      appProductPriceKey: "price",
      appProductImageUrlKey: "image_url",
      appProductDescriptionKey: "description",
      products: []
    };
  },
  created: function() {
    axios.get(this.appBaseUrl + this.appProductUrl).then(response => {
      this.products = this.formatProductResponse(response.data);
      console.log("products", this.products);
    });
  },
  methods: {
    formatProductResponse: function(data) {
      return data.map(product => {
        return {
          id: product["id"],
          name: product[this.appProductNameKey],
          price: product[this.appProductPriceKey],
          image_url: product[this.appProductImageUrlKey],
          description: product[this.appProductDescriptionKey]
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
