<template>
  <div class="home">
    <SearchBar />
   
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SearchBar from "@/components/SearchBar.vue"; // @ is an alias to /src


@Component({
  components: {
    SearchBar,
  
  },
})
export default class Home extends Vue {
}
</script>

<style lang="scss">
 .home {
    display: flex;
    min-height: 800px;
    width: 800px;
    justify-content: center;
    align-items: center;
    // background-color: #fff;
    margin: auto auto;
  }
</style>
