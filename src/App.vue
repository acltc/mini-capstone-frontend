<template>
  <div id="app"><router-view /></div>
</template>

<style>
#nprogress {
  pointer-events: none;
}

#nprogress .bar {
  background: #29d;
  position: fixed;
  z-index: 1031;
  top: 56px;
  left: 0;
  width: 100%;
  height: 5px;
}

#nprogress .peg {
  display: block;
  position: absolute;
  right: 0px;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 10px #29d, 0 0 5px #29d;
  opacity: 1;
}
</style>

<script>
import axios from "axios";
import NProgress from "nprogress";

axios.interceptors.request.use(
  function(config) {
    NProgress.start();
    return config;
  },
  function(error) {
    NProgress.done();
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    NProgress.done();
    return response;
  },
  function(error) {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default {};
</script>
