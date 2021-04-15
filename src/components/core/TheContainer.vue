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

<script>
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TheContainer extends Vue {
   @Prop({ default: "auto" }) width;
   @Prop({ default: "auto" }) minWidth;
   @Prop({ default: "10px" }) margin;
   @Prop({ default: null }) bgColor;
   @Prop({ default: null }) borderColor;
   @Prop({ default: "15px" }) borderRadius;
   @Prop({ default: null }) boxShadow;
   @Prop({ default: null }) bg;
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