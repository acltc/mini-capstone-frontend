<template>
  <div class="home">
    <a class="btn btn-outline-info m-3 float-right" data-toggle="collapse" href="#collapseDebugInfo" role="button" aria-expanded="false" aria-controls="collapseDebugInfo">
      &#9432;
    </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p><strong>Data from</strong>: GET {{appConfig.domain}}{{appConfig.ordersUrl}}</p>
        <p><strong>Using keys</strong>: {{appConfig.ordersIdKey}}, {{appConfig.ordersSubtotalKey}}, {{appConfig.ordersTaxKey}}, {{appConfig.ordersTotalKey}}, {{appConfig.ordersCartedProductsKey}} (an array of objects with keys of quantity and product)</p>
      </div>
    </div>
    <div class="container">
      <h1>Orders</h1>
      <p v-if="orders.length === 0">No orders placed yet!</p>
      <div v-for="order in orders">
        <h4>Order #{{order.id}}</h4>
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
        <br>
      </div>
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
          if (error.response && error.response.status === 401) {
            this.$router.push({ name: "exercise5-login" });
            return;
          }
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
