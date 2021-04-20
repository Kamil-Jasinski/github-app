<template>
   <nav v-if="!isLoading" class="main-nav">
      <button class="nav-button" type="button" @click="redirect">
         <font-awesome-icon class="nav-icon" icon="arrow-left" />
         <span class="__nav-icon-text">{{ user }} {{ navText }}</span>
      </button>
   </nav>
</template>

<script>
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TheNav extends Vue {
   @Prop({ default: "Home" }) routeName;
   @Prop({ default: null }) paramUserLogin;
   @Prop({ default: null }) user;
   @Prop({ default: "Home" }) navText;

   redirect() {
      this.$router.push({
         name: this.routeName,
         params: { user: this.paramUserLogin },
      });
      console.log("redirect");
   }

   get isLoading() {
      return this.$store.getters.isLoading;
   }
}
</script>

<style lang="scss" >
.main-nav {
   display: flex;
   justify-content: center;
   align-items: center;

   .nav-button {
      display: flex;
      align-items: center;
      background-color: transparent;
      outline: none;
      border: none;
      margin: 0 30px;
      font-size: 2rem;
      cursor: pointer;
      &:hover {
         .nav-icon > path {
            color: $third-app-color-light !important;
         }
         .__nav-icon-text {
            transform: translateX(10px);
         }
      }
      .nav-icon {
         transition: color 0.2s ease-in;
      }
      .__nav-icon-text {
         margin-left: 10px;
         font-size: 1rem;
         text-transform: uppercase;
         letter-spacing: 2px;
         transition: transform 0.1s ease-in-out;
      }
   }
}
</style>