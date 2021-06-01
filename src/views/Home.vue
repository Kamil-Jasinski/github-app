<template>
   <div class="home">
      <div class="home-title-wrapper">
         <h2 class="home-title">Hello there!</h2>
         <p class="home-subtitle">
            <span class="el">Search </span>
            <span class="el">for </span>
            <span class="el">github </span>
            <span class="el">users </span>
            <span class="el">repositories </span>
            <span class="el">by </span>
            <span class="el">their </span>
            <span class="el">nick </span>
            <span class="el">name</span>
            <span class="el">.</span>
         </p>
      </div>

      <SearchBar id="home-searchbar" />
   </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SearchBar from "@/components/SearchBar.vue"; // @ is an alias to /src
import gsap from "gsap";
import CSSPlugin from "gsap/CSSPlugin";

@Component({
   components: {
      SearchBar,
   },
})
export default class Home extends Vue {
   get isInit() {
      return this.$store.getters.isInit;
   }

   animateHomePage():void {
      gsap.registerPlugin(CSSPlugin);
      const homeTimeline = gsap.timeline();
      const homeSubtitleElements = document.querySelectorAll(".el");

      homeTimeline
         .fromTo(
            ".home-title",
            { y: 250, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8 }
         )
         .fromTo(
            homeSubtitleElements,
            { autoAlpha: 0, x: -150 },
            { autoAlpha: 1, x: 0, stagger: 0.1, duration: 1.3 }
         )
         .fromTo(
            "#home-searchbar",
            { autoAlpha: 0, y: 100 },
            { autoAlpha: 1, y: 0, duration: 1 },
            "-=.3"
         );

         // Show animation only once
           this.$store.commit("SET_IS_INIT", {
               isInit: false,
         });
   }

   mounted():void {
      if(this.isInit) {
         this.animateHomePage();
      }
   }
}
</script>

<style lang="scss">
.home {
   display: flex;
   width: 1200px;
   justify-content: center;
   align-items: center;
   margin: auto auto;
   flex-direction: column;
   .home-title-wrapper {
      margin-bottom: 100px;
      text-align: center;
      font-weight: normal;
      .home-title {
         color: $third-app-color-dark;
         letter-spacing: 5px;
         text-transform: capitalize;
         font-size: 7rem;
         font-weight: 300;
      }
      .home-subtitle {
         font-size: 2rem;
         letter-spacing: 2px;
         font-weight: 300;
      }
   }
}
</style>
