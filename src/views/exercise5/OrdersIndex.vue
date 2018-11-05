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
              <router-link :to="{ name: 'exercise5-orders-show', params: {id: order.id}}" append class="btn btn-info">More info</router-link>
            </td>
          </tr>
        </tbody>
      </table>
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
        this.appConfig.ordersQuantityKey,
        this.appConfig.ordersSubtotalKey,
        this.appConfig.ordersTaxKey,
        this.appConfig.ordersTotalKey,
        this.appConfig.ordersProductKey
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
      for (var i = 0; i < data.length; i++) {
        var product = data[i][this.appConfig.ordersProductKey];
        if (product[this.appConfig.productsNameKey] === undefined) {
          missingKeys.push(this.appConfig.productsNameKey);
          this.$emit("showError", missingKeys);
          return [];
        }
      }
      return data.map(order => {
        return {
          id: order[this.appConfig.ordersIdKey],
          quantity: order[this.appConfig.ordersQuantityKey],
          subtotal: order[this.appConfig.ordersSubtotalKey],
          tax: order[this.appConfig.ordersTaxKey],
          total: order[this.appConfig.ordersTotalKey],
          product: order[this.appConfig.ordersProductKey]
        };
      });
    }
  }
};
</script>
