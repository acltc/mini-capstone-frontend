<template>
  <div class="home">
    <a
      class="btn btn-outline-info m-3 float-right"
      data-toggle="collapse"
      href="#collapseDebugInfo"
      role="button"
      aria-expanded="false"
      aria-controls="collapseDebugInfo"
    >
      &#9432;
    </a>
    <div class="collapse" id="collapseDebugInfo">
      <div class="card card-body">
        <p>
          <strong>Data from</strong>: GET {{ appConfig.domain
          }}{{ appConfig.cartedProductsUrl }}
        </p>
        <p>
          <strong>Data shape</strong>: <span v-html="wordifiedSchema"></span>
        </p>
      </div>
    </div>
    <div class="container">
      <h1>Shopping Cart</h1>
      <div v-if="cartedProducts.length === 0">
        <p>Nothing in shopping cart!</p>
        <router-link
          :to="{ name: 'exercise5-products-index' }"
          class="btn btn-primary"
          >All products</router-link
        >
      </div>
      <div v-else>
        <div v-for="cartedProduct in cartedProducts">
          <h2>Product: {{ cartedProduct.product.name }}</h2>
          <p>Quantity: {{ cartedProduct.quantity }}</p>
          <p>Price: {{ cartedProduct.product.price }}</p>
        </div>
        <router-link
          :to="{ name: 'exercise5-products-index' }"
          class="btn btn-primary mr-3"
          >Continue shopping</router-link
        >
        <button v-on:click="createOrder();" class="btn btn-success">
          Buy now!
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { validateAndFormatData, wordifySchema } from "../../helpers.js";

export default {
  data: function() {
    return {
      cartedProducts: [],
      wordifiedSchema: "",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            cartedProductsIdKey: {
              alias: "id",
              type: "integer"
            },
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
    };
  },
  props: ["appConfig"],
  created: function() {
    this.wordifiedSchema = wordifySchema(this.schema, this.appConfig);
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
          this.$emit("showError", ["domain", "cartedProductsUrl"]);
        });
    },
    formatCartedProductsResponse: function(data) {
      let { invalidKeys, formattedData } = validateAndFormatData(
        data,
        this.schema,
        this.appConfig
      );
      if (invalidKeys.length > 0) {
        this.$emit("showError", invalidKeys);
        return this.cartedProducts;
      } else {
        return formattedData;
      }
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
