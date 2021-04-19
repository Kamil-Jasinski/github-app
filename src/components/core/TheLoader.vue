<template>
   <div class="loader-wrapper">
      <div class="loader"></div>
   </div>
</template>

<style lang="scss" scoped>
.loader-wrapper {
   margin: auto auto;
   display: flex;
   justify-content: center;
   align-items: center;

   .loader {
      width: 120px;
      height: 120px;
      border: 10px solid $third-app-color-light;
      border-right-color: $third-app-color-dark;
      border-radius: 50%;
      animation: spin 2s linear infinite;
   }
}

@keyframes spin {
   0% {
      transform: rotate(0deg);
   }
   100% {
      transform: rotate(360deg);
   }
}
</style>