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

export default {
  data: function() {
    return {
      orders: []
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
          this.$emit("showError", [
            this.appConfig.domain,
            this.appConfig.ordersUrl
          ]);
        });
    },
    formatOrderResponse: function(data) {
      if (data === undefined || data.length === 0) {
        return [];
      }
      var missingKeys = [];
      var requiredKeys = [
        this.appConfig.ordersIdKey,
        this.appConfig.ordersCartedProductsKey,
        this.appConfig.ordersSubtotalKey,
        this.appConfig.ordersTaxKey,
        this.appConfig.ordersTotalKey
      ];
      requiredKeys.forEach(requiredKey => {
        if (data[0][requiredKey] === undefined) {
          missingKeys.push(requiredKey);
        }
      });
      if (missingKeys.length > 0) {
        this.$emit("showError", missingKeys);
        return [];
      }
      return data.map(order => {
        return {
          id: order[this.appConfig.ordersIdKey],
          cartedProducts: order[this.appConfig.ordersCartedProductsKey],
          subtotal: order[this.appConfig.ordersSubtotalKey],
          tax: order[this.appConfig.ordersTaxKey],
          total: order[this.appConfig.ordersTotalKey]
        };
      });
    }
  }
};
</script>
