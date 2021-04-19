<template>
   <div id="app">
      <div id="logo-container">
         <img class="logo" alt="Vue logo" src="./assets/logo.png" />
      </div>
      <TheLoader v-if="isLoading" />
      <router-view />
   </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class app extends Vue {
   get isLoading() {
      return this.$store.getters.isLoading;
   }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap");

*,
html,
body {
   margin: 0;
   padding: 0;
   box-sizing: border-box;
   font-family: "Open Sans", sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   color: #fff;
}

body {
   background-color: #24292e;
}
#app {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-content: center;
   min-height: 100vh;
}

#logo-container {
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
   padding: 50px 0;
   img {
      width: 200px;
   }
}

ul {
   list-style: none;
}
</style>
