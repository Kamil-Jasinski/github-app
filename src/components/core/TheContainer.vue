<template>
   <div
      class="core-container"
      :style="{
         width: width,
         minWidth: minWidth,
         margin: margin,
         backgroundColor: bgColor,
         borderColor: borderColor,
         borderRadius: borderRadius,
         boxShadow: boxShadow,
         background: bg,
      }"
   >
      <slot></slot>
   </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TheContainer extends Vue {
   @Prop({ default: "auto" }) width:string;
   @Prop({ default: "auto" }) minWidth:string;
   @Prop({ default: "10px" }) margin:string;
   @Prop({ default: null }) bgColor:string;
   @Prop({ default: null }) borderColor:string;
   @Prop({ default: "15px" }) borderRadius:string;
   @Prop({ default: null }) boxShadow:string;
   @Prop({ default: null }) bg:string;
}
</script>
<style lang="scss" >
.core-container {
   height: min-content;

   background-color: $main-app-color-light;
   border-radius: 10px;
   border: 4px solid $main-app-color-dark;
   padding: 20px;
   -webkit-box-shadow: 0px 3px 30px -1px $main-app-shadow-color;
   box-shadow: 0px 3px 30px -1px $main-app-shadow-color;
}
</style>