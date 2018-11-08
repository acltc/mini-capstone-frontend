<template>
  <div class="home">
    <a class="btn btn-outline-info m-3 float-right" data-toggle="collapse" href="#collapseDebugInfo" role="button" aria-expanded="false" aria-controls="collapseDebugInfo">
      &#9432;
    </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p><strong>Data from</strong>: GET {{appConfig.domain}}{{appConfig.cartedProductsUrl}}</p>
        <p><strong>Using keys</strong>: {{appConfig.cartedProductsIdKey}}, {{appConfig.cartedProductsQuantityKey}}, {{appConfig.cartedProductsProductKey}} (an object with keys of name, price)</p>
      </div>
    </div>
    <div class="container">
      <h1>Shopping Cart</h1>
      <div v-if="cartedProducts.length === 0">
        <p>Nothing in shopping cart!</p>
        <router-link :to="{ name: 'exercise5-products-index'}" class="btn btn-primary">All products</router-link>
      </div>
      <div v-else>
        <div v-for="cartedProduct in cartedProducts">
          <h2>Product: {{cartedProduct.product.name}}</h2>
          <p>Quantity: {{cartedProduct.quantity}}</p>
          <p>Price: {{cartedProduct.product.price}}</p>
        </div>
        <router-link :to="{ name: 'exercise5-products-index'}" class="btn btn-primary mr-3">Continue shopping</router-link>
        <button v-on:click="createOrder()" class="btn btn-success">Buy now!</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      cartedProducts: []
    };
  },
  props: ["appConfig"],
  created: function() {
    this.requestCartedProducts();
  },
  methods: {
    requestCartedProducts: function() {
      axios
        .get(this.appConfig.domain + this.appConfig.cartedProductsUrl)
        .then(response => {
          this.cartedProducts = this.formatCartedProductsResponse(
            response.data
          );
          console.log("formatCartedProductsResponse", this.cartedProducts);
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            this.$router.push({ name: "exercise5-login" });
            return;
          }
          this.$emit("showError", [
            this.appConfig.domain,
            this.appConfig.cartedProductsUrl
          ]);
        });
    },
    formatCartedProductsResponse: function(data) {
      if (data === undefined || data.length === 0) {
        return [];
      }
      var missingKeys = [];
      var requiredKeys = [
        this.appConfig.cartedProductsIdKey,
        this.appConfig.cartedProductsQuantityKey,
        this.appConfig.cartedProductsProductKey
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
      return data.map(cartedProduct => {
        return {
          id: cartedProduct[this.appConfig.cartedProductsIdKey],
          quantity: cartedProduct[this.appConfig.cartedProductsQuantityKey],
          product: cartedProduct[this.appConfig.cartedProductsProductKey]
        };
      });
      // for (var i = 0; i < data.length; i++) {
      //   var product = data[i][this.appConfig.ordersProductKey];
      //   if (product[this.appConfig.productsNameKey] === undefined) {
      //     missingKeys.push(this.appConfig.productsNameKey);
      //     this.$emit("showError", missingKeys);
      //     return [];
      //   }
      // }
      // return data.map(order => {
      //   return {
      //     id: order[this.appConfig.ordersIdKey],
      //     quantity: order[this.appConfig.ordersQuantityKey],
      //     subtotal: order[this.appConfig.ordersSubtotalKey],
      //     tax: order[this.appConfig.ordersTaxKey],
      //     total: order[this.appConfig.ordersTotalKey],
      //     product: order[this.appConfig.ordersProductKey]
      //   };
      // });
    },
    createOrder: function() {
      axios
        .post(this.appConfig.domain + this.appConfig.ordersUrl)
        .then(response => {
          this.$router.push({
            name: "exercise5-orders-show",
            params: { id: response.data.id }
          });
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            this.$router.push({ name: "exercise5-login" });
            return;
          }
        });
    }
  }
};
</script>
