<template>
   <Portal to="app-loader">
      <div class="loader-wrapper">
         <div class="loader"></div>
      </div>
   </Portal>
</template>

<style lang="scss" scoped>
.loader-wrapper {
   display: flex;
   justify-content: center;
   align-items: center;
   min-width: 100%;
   min-height: 100%;
   position: fixed;
   top: 50%;
   left: 50%;
   background-color: rgba(0, 0, 0, 0.2);
   transform: translate(-50%, -50%);
   z-index: 10000;

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