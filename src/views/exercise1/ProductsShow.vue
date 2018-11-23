<template>
  <div class="home">
    <a class="btn btn-outline-info m-3 float-right" data-toggle="collapse" href="#collapseDebugInfo" role="button" aria-expanded="false" aria-controls="collapseDebugInfo"> &#9432; </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p><strong>Data from</strong>: GET {{ appConfig.domain }}{{ appConfig.productsUrl }}/{{ $route.params.id }}</p>
        <p><strong>Data shape</strong>: <span v-html="wordifiedSchema"></span></p>
      </div>
    </div>
    <div class="container">
      <ul>
        <li class="text-danger" v-for="error in errors">{{ error }}</li>
      </ul>
      <div class="row">
        <div class="col-3"><img :src="product.image_url" alt="" class="w-100" /></div>
        <div class="col-9">
          <h1>{{ product.name }}</h1>
          <p class="lead">{{ product.description }}</p>
          <table class="table table-hover">
            <tbody>
              <tr v-for="(value, key) in originalProductData">
                <td>
                  <small>{{ key }}</small>
                </td>
                <td>
                  <small>{{ value }}</small>
                </td>
              </tr>
            </tbody>
          </table>
          <router-link :to="{ name: 'exercise1-products-edit', params: { id: product.id } }" class="btn btn-primary mr-1">Edit product</router-link>
          <button type="button" class="btn btn-warning mr-1" data-toggle="modal" data-target="#deleteModal">Delete product</button>
          <router-link :to="{ name: 'exercise1-products-index' }" class="btn btn-light">Back to all products</router-link>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Confirm delete</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          </div>
          <div class="modal-body">Are you sure you want to delete this product? This action cannot be undone.</div>
          <div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button> <button @click="deleteProduct(product);" type="button" class="btn btn-primary">Delete</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import axios from "axios";
import SchemaValidator from "../../mixins/SchemaValidator.js";

export default {
  mixins: [SchemaValidator],
  props: ["appConfig"],
  data: function() {
    return {
      product: { id: 0 },
      wordifiedSchema: "",
      schema: {
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
      },
      originalProductData: {},
      errors: []
    };
  },
  created: function() {
    axios
      .get(this.appConfig.domain + this.appConfig.productsUrl + "/" + this.$route.params.id)
      .then(response => {
        this.product = this.formatDataToSchema(response.data) || this.product;
        this.originalProductData = response.data;
      })
      .catch(error => {
        this.$emit("showError", ["domain", "productsUrl"], error.request.status);
      });
  },
  methods: {
    deleteProduct: function(product) {
      axios
        .delete(this.appConfig.domain + this.appConfig.productsUrl + "/" + product.id)
        .then(response => {
          $("#deleteModal").modal("hide");
          this.$router.push({ name: "exercise1-products-index" });
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    }
  }
};
</script>
