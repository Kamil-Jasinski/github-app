<template>
   <div>
      <nav v-if="!isLoading && menuType !== 'big'" class="main-nav">
         <button class="nav-button" type="button" @click="redirect">
            <font-awesome-icon class="nav-icon" icon="arrow-left" />
            <span class="__nav-icon-text">{{ user }} {{ navText }}</span>
         </button>
      </nav>
      <nav v-if="!isLoading && menuType === 'big'" class="main-nav">
         <button class="nav-button" type="button" @click="redirect">
            <font-awesome-icon class="nav-icon" icon="arrow-left" />
            <span class="__nav-icon-text">{{ user }} {{ navText }}</span>
         </button>
         <button
            class="nav-button"
            type="button"
            @click="$router.push({ name: 'Home' })"
         >
            <font-awesome-icon class="nav-icon" icon="home" />
            <span class="__nav-icon-text">Home</span>
         </button>
      </nav>
   </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TheNav extends Vue {
   @Prop({ default: "Home" }) routeName!:string;
   @Prop({ default: null }) paramUserLogin!:string;
   @Prop({ default: null }) user!:string;
   @Prop({ default: "Home" }) navText?:string|null;
   @Prop({ default: null }) menuType!:string;

   redirect():void {
      this.$router.push({
         name: this.routeName,
         params: { user: this.paramUserLogin },
      });
   }

   get isLoading():void {
      return this.$store.getters.isLoading;
   }
}
</script>

<style lang="scss" >
.main-nav {
   display: flex;
   justify-content: center;
   align-items: center;
   padding: 20px 0;
   visibility: hidden;

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