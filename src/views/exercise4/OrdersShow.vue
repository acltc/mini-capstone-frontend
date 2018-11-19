<template>
  <div class="home">
    <a class="btn btn-outline-info m-3 float-right" data-toggle="collapse" href="#collapseDebugInfo" role="button" aria-expanded="false" aria-controls="collapseDebugInfo">
      &#9432;
    </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p><strong>Data from</strong>: GET {{appConfig.domain}}{{appConfig.ordersUrl}}/{{$route.params.id}}</p>
        <p><strong>Using keys</strong>: {{appConfig.ordersIdKey}}, {{appConfig.ordersQuantityKey}}, {{appConfig.ordersSubtotalKey}}, {{appConfig.ordersTaxKey}}, {{appConfig.ordersTotalKey}}, {{appConfig.ordersProductKey}} (an object with a key of {{appConfig.productsNameKey}})</p>
      </div>
    </div>
    <div class="container">
      <h1>Order info</h1>
      <table class="table table-hover">
        <colgroup>
           <col span="1" style="width: 15%;">
           <col span="1" style="width: 85%;">
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">Product</th>
            <td>{{order.product.name}}</td>
          </tr>
          <tr>
            <th scope="row">Quantity</th>
            <td>{{order.quantity}}</td>
          </tr>
          <tr>
            <th scope="row">Subtotal</th>
            <td>{{order.subtotal}}</td>
          </tr>
          <tr>
            <th scope="row">Tax</th>
            <td>{{order.tax}}</td>
          </tr>
          <tr>
            <th scope="row">Total</th>
            <td>{{order.total}}</td>
          </tr>
        </tbody>
      </table>
      <router-link :to="{ name: 'exercise4-products-index' }" class="btn btn-primary">Back to all products</router-link>
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
      orderSchema: {
        type: "object",
        properties: {
          ordersIdKey: {
            alias: "id",
            type: "integer"
          },
          ordersQuantityKey: {
            alias: "quantity",
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
          ordersProductKey: {
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
      })
      .catch(error => {
        this.$emit("showError", ["domain", "ordersUrl"]);
      });
  },
  methods: {
    formatOrderResponse: function(data) {
      let { invalidKeys, formattedData } = validateAndFormatData(
        data,
        this.orderSchema,
        this.appConfig
      );
      if (invalidKeys.length > 0) {
        this.$emit("showError", invalidKeys);
        return this.order;
      } else {
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
      axios
        .post(this.appConfig.domain + this.appConfig.ordersUrl, params)
        .then(response => {
          this.quantity = null;
          this.$router.push({ name: "exercise4-orders-show" });
        });
    }
  }
};
</script>
