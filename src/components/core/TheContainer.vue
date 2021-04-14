<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<style lang="scss">
$main-app-color-light: #2d3238;
$main-app-color-dark: #24292e;
$main-app-shadow: #1b1e22;

.container {
  width: 75%;
  height: min-content;
  display: flex;
  flex-direction: column;
  background-color: $main-app-color-light;
  border-radius: 10px;
  border: 4px solid $main-app-color-dark;
  padding: 20px;
  -webkit-box-shadow: 0px 3px 30px -1px $main-app-shadow;
  box-shadow: 0px 3px 30px -1px $main-app-shadow;
}
</style>