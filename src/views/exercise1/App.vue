<template>
  <div class="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link :to="{ name: 'exercise1-home'}" class="navbar-brand">{{ appName }}</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link :to="{ name: 'exercise1-products-index'}" class="nav-link">All products</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'exercise1-products-new' }" class="nav-link">New product</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view ></router-view>
  </div>
</template>

<style>
body {
  background: url("../../assets/gplaypattern.png");
}
</style>


<script>
export default {
  data: function() {
    return {
      appName: "Mini-capstone"
    };
  },
  created: function() {},
  methods: {},
  computed: {}
};
</script>
