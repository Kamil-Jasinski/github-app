<template>
   <transition name="modal">
      <section id="modal">
         <div class="modal-mask" @click="$emit('close')"></div>

         <div class="modal-container">
            <div class="modal-header">
               <h3>
                  <slot name="header">
                     <!-- default header -->
                  </slot>
               </h3>
            </div>

            <div class="modal-body">
               <slot name="body">
                  <!-- default body  -->
               </slot>
            </div>

            <div class="modal-footer">
               <slot name="footer">
                  <!-- default footer -->
                  <button class="modal-default-button" @click="$emit('close')">
                     OK
                  </button>
               </slot>
            </div>
         </div>
      </section>
   </transition>
</template>

<style lang="scss">
#modal {
   position: fixed;
   z-index: 9998;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   width: 100%;
   height: 100%;
   background-color: rgba(0, 0, 0, 0.5);
   display: flex;
   justify-content: center;
   align-items: center;
   transition: opacity 0.3s ease;
}
.modal-mask {
   position: absolute;
   top: 0;
   left: 0;
   bottom: 0;
   right: 0;
   background-color: rgba(0, 0, 0, 0.2);
}

.modal-container {
   position: relative;
   z-index: 9999;

   min-height: max-content;
   max-height: 75vh;

   width: min-content;
   min-width: 300px;
   // max-width: 800px;

   margin: 0px auto;
   padding: 20px 30px;
   background-color: $main-app-color-dark;
   border-radius: 2px;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
   transition: all 0.3s ease;
   overflow-y: auto;
   overflow-x: hidden;

   &::-webkit-scrollbar {
      width: 6px;
      height: 5px;
   }
   &::-webkit-scrollbar-track {
      background-color: #ffffff25;
   }
   &::-webkit-scrollbar-thumb {
      background-color: $secondary-app-color-dark;
      border-radius: 8px;
   }
}

.modal-header h3 {
   margin-top: 0;
   color: $third-app-color-dark;
   font-size: 2rem;
}

.modal-body {
   margin: 20px 0;
   width: 100%;
}

.modal-footer {
   display: flex;
   justify-content: flex-end;
   .modal-default-button {
      padding: 5px 10px;
      color: $main-app-color-dark;
      font-weight: bold;
      cursor: pointer;
   }
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
   opacity: 0;
}

.modal-leave-active {
   opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
   -webkit-transform: scale(1.1);
   transform: scale(1.1);
}
</style>