<template>
   <div id="app">
      <PortalTarget name="app-loader"></PortalTarget>
      <PortalTarget name="app-modal"></PortalTarget>
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

   &::-webkit-scrollbar {
      width: 10px;
      height: 5px;
   }
   &::-webkit-scrollbar-track {
      background-color: #ffffff25;
   }
   &::-webkit-scrollbar-thumb {
      background-color: $third-app-color-dark;
   }
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

ul {
   list-style: none;
}
</style>
