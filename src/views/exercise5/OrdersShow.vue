<template>
  <div class="home">
    <a class="btn btn-outline-info m-3 float-right" data-toggle="collapse" href="#collapseDebugInfo" role="button" aria-expanded="false" aria-controls="collapseDebugInfo">
      &#9432;
    </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p><strong>Data from</strong>: GET {{appConfig.domain}}{{appConfig.ordersUrl}}/{{$route.params.id}}</p>
        <p><strong>Data shape</strong>: <span v-html="wordifiedSchema"></span></p>
      </div>
    </div>
    <div class="container">
      <h1>Order #{{order.id}}</h1>
      <hr>
      <div v-for="cartedProduct in order.cartedProducts">
        <p>
          {{cartedProduct.quantity}} x
          <span v-if="cartedProduct.product">{{cartedProduct.product.name}}</span>
          <span v-else>Product id {{cartedProduct.product_id}}</span>
        </p>
      </div>
      <hr>
      <p>Subtotal: {{order.subtotal}}</p>
      <p>Tax: {{order.tax}}</p>
      <p>Total: {{order.total}}</p>
      <router-link :to="{ name: 'exercise5-products-index' }" class="btn btn-primary">Back to all products</router-link>
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
import { validateAndFormatData } from "../../helpers.js";

export default {
  data: function() {
    return {
      order: { id: 0, product: {} },
      wordifiedSchema: "",
      orderSchema: {
        type: "object",
        properties: {
          ordersIdKey: {
            alias: "id",
            type: "integer"
          },
          ordersSubtotalKey: {
            alias: "subtotal",
            type: "number"
          },
          ordersTaxKey: {
            alias: "tax",
            type: "number"
          },
          ordersTotalKey: {
            alias: "total",
            type: "number"
          },
          ordersCartedProductsKey: {
            alias: "cartedProducts",
            type: "array",
            items: {
              type: "object",
              properties: {
                cartedProductsQuantityKey: {
                  alias: "quantity",
                  type: "integer"
                },
                cartedProductsProductKey: {
                  alias: "product",
                  type: "object",
                  properties: {
                    productsNameKey: {
                      alias: "name",
                      type: "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  },
  props: ["appConfig"],
  created: function() {
    axios
      .get(
        this.appConfig.domain +
          this.appConfig.ordersUrl +
          "/" +
          this.$route.params.id
      )
      .then(response => {
        this.order = this.formatOrderResponse(response.data);
        console.log("ORDER", this.order);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          this.$router.push({ name: "exercise5-login" });
          return;
        }
        this.$emit("showError", ["domain", "ordersUrl"]);
      });
  },
  methods: {
    formatOrderResponse: function(data) {
      console.log("formatOrderResponse", data, this.orderSchema);
      let {
        invalidKeys,
        formattedData,
        wordifiedSchema
      } = validateAndFormatData(data, this.orderSchema, this.appConfig);
      if (invalidKeys.length > 0) {
        this.$emit("showError", invalidKeys);
        return this.order;
      } else {
        this.wordifiedSchema = wordifiedSchema;
        return formattedData;
      }
    },
    deleteProduct: function(product) {
      console.log("delete", product);
      axios
        .delete(
          this.appConfig.domain + this.appConfig.productsUrl + "/" + product.id
        )
        .then(response => {
          $("#deleteModal").modal("hide");
          this.$router.push({
            name: "exercise5-products-index"
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
      axios
        .post(this.appConfig.domain + this.appConfig.ordersUrl, params)
        .then(response => {
          this.quantity = null;
          this.$router.push({ name: "exercise5-orders-show" });
        });
    }
  }
};
</script>
