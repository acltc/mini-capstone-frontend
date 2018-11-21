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
          }}{{ appConfig.productsUrl }}/{{ $route.params.id }}
        </p>
        <p>
          <strong>Data shape</strong>: <span v-html="wordifiedSchema"></span>
        </p>
        <br />
        <p>
          <strong>Data sending to</strong>: PATCH {{ appConfig.domain
          }}{{ appConfig.productsUrl }}/{{ $route.params.id }}
        </p>
        <p>
          <strong>Using params</strong>: <strong>name</strong>,
          <strong>price</strong>, <strong>description</strong> (can't edit
          images or supplier)
        </p>
      </div>
    </div>
    <div class="container">
      <form v-on:submit.prevent="submit();">
        <h1>Edit product</h1>
        <ul>
          <li class="text-danger" v-for="error in errors">{{ error }}</li>
        </ul>
        <div class="form-group">
          <label>Name:</label>
          <input type="text" class="form-control" v-model="product.name" />
        </div>
        <div class="form-group">
          <label>Price:</label>
          <input type="text" class="form-control" v-model="product.price" />
        </div>
        <div class="form-group">
          <label>Description:</label>
          <input
            type="text"
            class="form-control"
            v-model="product.description"
          />
        </div>
        <input type="submit" class="btn btn-primary mr-1" value="Submit" />
        <router-link
          :to="{ name: 'exercise5-products-show', params: { id: product.id } }"
          class="btn btn-secondary"
          >Cancel</router-link
        >
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { validateAndFormatData, wordifySchema } from "../../helpers.js";

export default {
  data: function() {
    return {
      product: { id: 0 },
      wordifiedSchema: "",
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
          }
        }
      },
      errors: []
    };
  },
  props: ["appConfig", "isAdmin"],
  created: function() {
    this.wordifiedSchema = wordifySchema(this.schema, this.appConfig);
    if (!this.isAdmin()) {
      this.$router.push({ name: "exercise5-login" });
      return;
    }
    axios
      .get(
        this.appConfig.domain +
          this.appConfig.productsUrl +
          "/" +
          this.$route.params.id
      )
      .then(response => {
        this.product = this.formatProductResponse(response.data);
      })
      .catch(error => {
        this.$emit("showError", ["domain", "productsUrl"]);
      });
  },
  methods: {
    formatProductResponse: function(data) {
      let { invalidKeys, formattedData } = validateAndFormatData(
        data,
        this.schema,
        this.appConfig
      );
      if (invalidKeys.length > 0) {
        this.$emit("showError", invalidKeys);
        return this.product;
      } else {
        return formattedData;
      }
    },
    submit: function() {
      var params = {
        name: this.product.name,
        price: this.product.price,
        description: this.product.description
      };
      axios
        .patch(
          this.appConfig.domain +
            this.appConfig.productsUrl +
            "/" +
            this.$route.params.id,
          params
        )
        .then(response => {
          this.$router.push({
            name: "exercise5-products-show",
            params: { id: response.data.id }
          });
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    }
  }
};
</script>
