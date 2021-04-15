<template>
  <div class="core-title-container" :style="{width: width, margin: margin, backgroundColor: bgColor, borderColor: borderColor}">
    
    <h2 class="core-title">
        <slot></slot>
    </h2>
  </div>
</template>

<script>
import { Component, Vue, Prop } from "vue-property-decorator";


@Component
export default class TheTitle extends Vue {
  @Prop({default: 'auto'}) width;
  @Prop({default: '10px'}) margin;
  @Prop({default: null}) bgColor;
  @Prop({default: null}) borderColor;

}
</script>
<style lang="scss">


.core-title-container {

padding: 40px;
    .core-title {
        margin: auto;
        position: relative;
        max-width: max-content;
        color: $secondary-app-color-light;
        text-transform: capitalize;
        letter-spacing: .2rem;
        &::before{
            content: '';
            display: block;
            width: 70px;
            height: 0.5px;
            background-color: $third-app-color-light;
            position: absolute;
            top: 50%;
            left: -90px;
            transform: translateY(-50%);
            
        }
         &::after{
            content: '';
            display: block;
            width: 70px;
            height: 0.5px;
            background-color: $third-app-color-light;
            position: absolute;
            top: 50%;
            right: -90px;
            transform: translateY(-50%);
            
        }
    }
}
</style>