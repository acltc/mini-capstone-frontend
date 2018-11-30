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
        <div class="col-md-3">
          <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
              <li v-for="(image, index) in product.images" data-target="#carouselExampleIndicators" :data-slide-to="index" :class="{ active: index === 0 }"></li>
            </ol>
            <div class="carousel-inner">
              <div v-for="(image, index) in product.images" :class="{ 'carousel-item': true, active: index === 0 }"><div class="img" :style="`background-image:url(${image.url});`"></div></div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev"> <span class="carousel-control-prev-icon" aria-hidden="true"></span> <span class="sr-only">Previous</span> </a> <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next"> <span class="carousel-control-next-icon" aria-hidden="true"></span> <span class="sr-only">Next</span> </a>
          </div>
          <div class="card mt-4">
            <div class="card-body">
              <form v-on:submit.prevent="submit();" class="mb-4"><label>Quantity:</label> <input v-model="quantity" type="number" class="form-control" /> <input type="submit" class="btn btn-primary mt-2" value="Buy now!" /></form>
            </div>
          </div>
        </div>
        <div class="col-md-9">
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
          <router-link :to="{ name: 'exercise4-products-edit', params: { id: product.id } }" class="btn btn-primary mr-1">Edit product</router-link>
          <button type="button" class="btn btn-warning mr-1" data-toggle="modal" data-target="#deleteModal">Delete product</button>
          <router-link :to="{ name: 'exercise4-products-index' }" class="btn btn-light">Back to all products</router-link>
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

<style>
.img {
  position: relative;
  float: left;
  width: 100%;
  height: 300px;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>

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
      },
      originalProductData: {},
      quantity: null,
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
      console.log("delete", product);
      axios
        .delete(this.appConfig.domain + this.appConfig.productsUrl + "/" + product.id)
        .then(response => {
          $("#deleteModal").modal("hide");
          this.$router.push({
            name: "exercise4-products-index"
          });
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    submit: function() {
      var params = {
        product_id: this.$route.params.id,
        quantity: this.quantity
      };
      axios.post(this.appConfig.domain + this.appConfig.ordersUrl, params).then(response => {
        this.quantity = null;
        this.$router.push({ name: "exercise4-orders-show", params: { id: response.data.id } });
      });
    }
  }
};
</script>
