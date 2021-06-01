<template>
   <div class="search-bar">
      <form>
         <span>
            <!-- User Name Input  -->
            <input
               type="text"
               @focus="showNotify = false"
               :placeholder="placeholder"
               v-model="userName"
               :style="showNotify ? 'border: 3px solid red;' : null"
            />
            <button
               @click.prevent="
                  goToUserReposPage();
                  $emit('clicked');
               "
               type="submit"
            >
               Search
            </button>
         </span>

         <section class="filters-container">
            <!-- Sort by -->
            <div class="options-container">
               <p>Sort By:</p>
               <select class="filter select-css" v-model="sorting">
                  <option selected value="">select</option>
                  <option value="full_name">Full Name</option>
                  <option value="pushed">Pushed</option>
                  <option value="created">Created</option>
                  <option value="updated">Updated</option>
               </select>
            </div>

            <!-- Order by -->
            <div class="options-container">
               <p>Order By:</p>
               <select class="filter select-css" v-model="order">
                  <option selected value="">select</option>
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
               </select>
            </div>

            <!-- Pager -->
            <div class="options-container">
               <p>Per Page:</p>
               <select class="filter select-css" v-model="perPage">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
               </select>
            </div>
         </section>

         <p class="search-notify" v-if="showNotify">{{ notify }}</p>
      </form>
   </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
   components: {},
})
export default class SearchBar extends Vue {
   @Prop({ default: true }) isHomepage!:boolean;
   @Prop({ default: "User name..." }) placeholder?:string | null;

   userName = ''; // from input to route @param
   notify!:string;

   perPage = this.$store.getters.currentPerPage;
   sorting:string = this.$store.getters.searchSorting;
   order:string = this.$store.getters.searchOrder;

   showNotify = false;

   async goToUserReposPage():Promise<any> {
      const currentUserLogin = this.$store.getters.userLogin;
      this.showNotify = false;

      // Go to user repos page - changes route only if currently searched user is defferent from userName from input
      if (this.userName !== currentUserLogin && this.userName !== "") {
         this.$router.push({
            name: "UserRepos",
            params: { user: this.userName },
         });
      }
      if (this.userName === "" && this.isHomepage) {
         this.showNotify = true;
         this.notify = "Hold your horses, you have a input field to fill.";
      }
   }

   @Watch("perPage")
   updatePerPageValue():void {
      this.$store.commit("SET_CURRENT_PER_PAGE", {
         currentPerPage: parseInt(this.perPage),
      });
   }

   @Watch("order")
   updateOrderValue():void {
      this.$store.commit("SET_SEARCH_ORDER", {
         order: this.order,
      });
   }
   @Watch("sorting")
   updateSortingValue():void {
      this.$store.commit("SET_SEARCH_SORTING", {
         sorting: this.sorting,
      });
   }
}
</script>

<style lang="scss">
.search-bar {
   display: flex;
   justify-content: center;
   width: 100%;

   form {
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
   }

   button[type="submit"],
   input,
   .select-css {
      padding: 20px;
      border-radius: 25px;
      border: 1px solid $main-app-color-dark;
      outline: none;
      background-color: #ffffff;
      font-size: 2rem;
      color: $main-app-color-light;
   }
   input {
      margin-right: 30px;
   }

   button[type="submit"] {
      background-color: $third-app-color-light;
      border-color: $main-app-color-dark;
      color: $main-app-color-dark;
      cursor: pointer;
      transition: background-color 0.35s ease-out;
      &:hover {
         background-color: $third-app-color-dark;
      }
   }
}

.filters-container {
   display: flex;
   justify-content: row;
}
.options-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   min-width: max-content;
   max-width: max-content;
   margin-top: 10px;
   p {
      margin-bottom: 5px;
   }
}

// SELECT

.select-css {
   color: $main-app-color-light;
   min-width: max-content;
   max-width: max-content;
   margin: 20px;
}
.filter {
   margin: 0 20px;
}

.search-notify {
   padding: 10px;
   color: red;
   background-color: $main-app-color-light;
   margin: 25px 0;
   letter-spacing: 2px;
   text-transform: uppercase;
}

/* Hover title border */
.select-css:hover {
   border-color: $main-app-color-dark;
}
/* Focus style style*/
.select-css:focus {
   border-color: $main-app-color-light;
   outline: none;
}

/* Set options to normal weight */
.select-css option {
   font-weight: normal;
   background-color: $main-app-color-light;
}

/* Disabled styles */
.select-css:disabled,
.select-css[aria-disabled="true"] {
   color: gray;
}

.select-css:disabled:hover,
.select-css[aria-disabled="true"] {
   border-color: #aaa;
}
</style>
