<template>
  <div class="home">
    <a class="btn btn-outline-info m-3 float-right" data-toggle="collapse" href="#collapseDebugInfo" role="button" aria-expanded="false" aria-controls="collapseDebugInfo"> &#9432; </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p><strong>Data from</strong>: GET {{ appConfig.domain }}{{ appConfig.ordersUrl }}</p>
        <p><strong>Data shape</strong>: <span v-html="wordifiedSchema"></span></p>
      </div>
    </div>
    <div class="container">
      <h1>Orders</h1>
      <p v-if="orders.length === 0">No orders placed yet!</p>
      <div v-for="order in orders">
        <h4>Order #{{ order.id }}</h4>
        <hr />
        <div v-for="cartedProduct in order.cartedProducts">
          <p>
            {{ cartedProduct.quantity }} x <span v-if="cartedProduct.product">{{ cartedProduct.product.name }}</span> <span v-else>Product id {{ cartedProduct.product_id }}</span>
          </p>
        </div>
        <hr />
        <p>Subtotal: {{ order.subtotal }}</p>
        <p>Tax: {{ order.tax }}</p>
        <p>Total: {{ order.total }}</p>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SchemaValidator from "../../mixins/SchemaValidator.js";

export default {
  mixins: [SchemaValidator],
  props: ["appConfig"],
  data: function() {
    return {
      orders: [],
      schema: {
        type: "array",
        items: {
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
      }
    };
  },
  created: function() {
    this.requestOrders();
  },
  methods: {
    requestOrders: function() {
      axios
        .get(this.appConfig.domain + this.appConfig.ordersUrl)
        .then(response => {
          this.orders = this.formatDataToSchema(response.data) || this.orders;
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            this.$router.push({ name: "exercise5-login" });
            return;
          }
          this.$emit("showError", ["domain", "ordersUrl"], error.request.status);
        });
    }
  }
};
</script>
