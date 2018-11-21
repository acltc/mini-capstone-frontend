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
          <strong>Data sending to</strong>: POST {{ appConfig.domain
          }}{{ appConfig.productsUrl }}
        </p>
        <p>
          <strong>Using params</strong>: <strong>name</strong>,
          <strong>price</strong>, <strong>image_url</strong>,
          <strong>description</strong>, <strong>supplier_id</strong>
        </p>
        <br />
        <p>
          Note: If GET {{ appConfig.domain
          }}{{ appConfig.suppliersUrl }} exists, it will be used to display
          suppliers as a dropdown using the
          {{ appConfig.suppliersNameKey }} key!
        </p>
      </div>
    </div>
    <div class="container">
      <form v-on:submit.prevent="submit();">
        <h1>New product</h1>
        <ul>
          <li class="text-danger" v-for="error in errors">{{ error }}</li>
        </ul>
        <div class="form-group">
          <label>Name:</label>
          <input type="text" class="form-control" v-model="name" />
        </div>
        <div class="form-group">
          <label>Price:</label>
          <input type="text" class="form-control" v-model="price" />
        </div>
        <div class="form-group">
          <label>Image url:</label>
          <input type="text" class="form-control" v-model="image_url" />
        </div>
        <div class="form-group">
          <label>Description:</label>
          <input type="text" class="form-control" v-model="description" />
        </div>
        <div v-if="suppliers.length > 0" class="form-group">
          <label>Supplier:</label>
          <select v-model="supplier_id" class="form-control">
            <option v-for="supplier in suppliers" :value="supplier.id">{{
              supplier.name
            }}</option>
          </select>
        </div>
        <div v-else class="form-group">
          <label>Supplier id:</label>
          <input
            type="number"
            min="1"
            class="form-control"
            v-model="supplier_id"
          />
        </div>
        <input type="submit" class="btn btn-primary mr-1" value="Submit" />
        <router-link
          :to="{ name: 'exercise5-products-index' }"
          class="btn btn-secondary"
          >Cancel</router-link
        >
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      name: "",
      price: "",
      image_url: "",
      description: "",
      supplier_id: "",
      suppliers: [],
      errors: []
    };
  },
  props: ["appConfig", "isAdmin"],
  created: function() {
    if (!this.isAdmin()) {
      this.$router.push({ name: "exercise5-login" });
      return;
    }
    this.requestSuppliers();
  },
  methods: {
    requestSuppliers: function() {
      axios
        .get(this.appConfig.domain + this.appConfig.suppliersUrl)
        .then(response => {
          var valid = true;
          response.data.forEach(supplier => {
            var id = supplier[this.appConfig.suppliersIdKey];
            var name = supplier[this.appConfig.suppliersNameKey];
            if (id === undefined || name === undefined) {
              valid = false;
            }
          });
          if (valid) {
            this.suppliers = response.data;
          }
        });
    },
    submit: function() {
      var params = {
        name: this.name,
        price: this.price,
        image_url: this.image_url,
        description: this.description,
        supplier_id: this.supplier_id
      };
      axios
        .post(this.appConfig.domain + this.appConfig.productsUrl, params)
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
