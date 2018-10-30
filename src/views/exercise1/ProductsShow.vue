<template>
  <div class="home">
    <div class="container">
      <h1>{{ product.name }}</h1>
      <ul>
        <li class="text-danger" v-for="error in errors">{{ error }}</li>
      </ul>
      <div class="row">
        <div class="col-3">
          <img :src="product.image_url" alt="" class="w-100">
        </div>
        <div class="col-9">
          <p>{{product.description}}</p>
          <router-link :to="{ name: 'exercise1-products-edit', params: {id: product.id} }" class="btn btn-primary mr-1">Edit product</router-link>
          <button type="button" class="btn btn-warning mr-1" data-toggle="modal" data-target="#deleteModal">
            Delete product
          </button>
          <router-link :to="{ name: 'exercise1-products-index' }" class="btn btn-light">Back to all products</router-link>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Confirm delete</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this product? This action cannot be undone.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button @click="deleteProduct(product)" type="button" class="btn btn-primary">Delete</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
/* global $ */

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
      product: { id: 0 },
      errors: []
    };
  },
  created: function() {
    axios
      .get(this.appBaseUrl + this.appProductUrl + "/" + this.$route.params.id)
      .then(response => {
        this.product = this.formatProductResponse(response.data);
        console.log("product", this.product);
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
    deleteProduct: function(product) {
      console.log("delete", product);
      axios
        .delete(this.appBaseUrl + this.appProductUrl + "/" + product.id)
        .then(response => {
          $("#deleteModal").modal("hide");
          this.$router.push({
            name: "exercise1-products-index"
          });
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    }
  }
};
</script>
