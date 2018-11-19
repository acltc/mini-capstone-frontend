<template>
  <div class="home">
    <a class="btn btn-outline-info m-3 float-right" data-toggle="collapse" href="#collapseDebugInfo" role="button" aria-expanded="false" aria-controls="collapseDebugInfo">
      &#9432;
    </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p><strong>Data from</strong>: GET {{appConfig.domain}}{{appConfig.ordersUrl}}</p>
        <p><strong>Using keys</strong>: {{appConfig.ordersIdKey}}, {{appConfig.ordersQuantityKey}}, {{appConfig.ordersSubtotalKey}}, {{appConfig.ordersTaxKey}}, {{appConfig.ordersTotalKey}}, {{appConfig.ordersProductKey}} (an object with a key of {{appConfig.productsNameKey}})</p>
      </div>
    </div>
    <div class="container">
      <h1>Orders</h1>
      <p v-if="orders.length === 0">No orders placed yet!</p>
      <table v-else class="table table-hover">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Tax</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders">
            <td>{{order.product.name}}</td>
            <td>{{order.quantity}}</td>
            <td>{{order.subtotal}}</td>
            <td>{{order.tax}}</td>
            <td>{{order.total}}</td>
            <td>
              <router-link :to="{ name: 'exercise4-orders-show', params: {id: order.id}}" append class="btn btn-info">More info</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { validateAndFormatData } from "../../helpers.js";

export default {
  data: function() {
    return {
      orders: [],
      ordersSchema: {
        type: "array",
        items: {
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
      }
    };
  },
  props: ["appConfig"],
  created: function() {
    this.requestOrders();
  },
  methods: {
    requestOrders: function() {
      axios
        .get(this.appConfig.domain + this.appConfig.ordersUrl)
        .then(response => {
          this.orders = this.formatOrderResponse(response.data);
        })
        .catch(error => {
          console.log(error);
          this.$emit("showError", ["domain", "ordersUrl"]);
        });
    },
    formatOrderResponse: function(data) {
      let { invalidKeys, formattedData } = validateAndFormatData(
        data,
        this.ordersSchema,
        this.appConfig
      );
      if (invalidKeys.length > 0) {
        this.$emit("showError", invalidKeys);
        return this.orders;
      } else {
        return formattedData;
      }
    }
  }
};
</script>
