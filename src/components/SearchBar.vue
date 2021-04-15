<template>
   <div class="search-bar">
      <form>
         <span>
            <!-- User Name  -->
            <input type="text" placeholder="User Name..." v-model="userName" />
            <!-- <span>{{ selectedSorting }}</span> -->
            <button @click.prevent="getUserAndRepos" type="submit">
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
                  <option value="40">40</option>
                  <option value="">All</option>
               </select>
            </div>
         </section>
      </form>
   </div>
</template>

<script>
import { Component, Vue, Prop } from "vue-property-decorator";
import axios from "axios";

@Component({
   components: {},
})
export default class SearchBar extends Vue {
   @Prop({ default: false }) changeRoute;

   userName = "";
   sorting = "";
   page = 1;
   perPage = this.$store.getters.currentPerPage;
   order = "";

   async getUserAndRepos() {
      let userName;
      let currentUserLogin = this.$store.getters.userLogin;
      const currentUser = this.$store.getters.currentUser;
      let userMaxReposPages;

      //Check if user input is not empty
      if (!this.userName) {
         console.log("User Name nie może być pusty");
         return false;
      }

      try {
         // GET REPOS
         const repos = await axios.get(
            `https://api.github.com/users/${this.userName}/repos?sort=${this.sorting}&direction=${this.order}&per_page=${this.perPage}&page=${this.page}`
         );
         //  GET USER
         const userResponse = await axios.get(
            "https://api.github.com/users/" + this.userName
         );

         //Store user
         this.$store.commit("SET_USER", { user: userResponse.data });
         userName = userResponse.data.login;

         //Store User Name
         if (userResponse.data.name) {
            this.$store.commit("SET_USER_NAME", {
               name: userResponse.data.name,
            });
         } else {
            this.$store.commit("SET_USER_NAME", { name: "" });
         }

         //Store User Login
         if (userResponse.data.login) {
            this.$store.commit("SET_USER_LOGIN", {
               login: userResponse.data.login,
            });
         } else {
            this.$store.commit("SET_USER_LOGIN", { login: "" });
         }

         // Check is current user = user from input
         if (this.userName !== currentUserLogin) {
            this.$store.commit("SET_CURRENT_PAGE", {
               currentPage: 1,
            });
         }

         //Store user repos
         let userAvatarUrl = userResponse.data.avatar_url;
         this.$store.commit("SET_USER_AVATAR_URL", {
            URL: userAvatarUrl,
         });

         //Store current page
         this.$store.commit("SET_CURRENT_PAGE", {
            currentPage: this.page,
         });

         //Store user repos max page
         const userReposNumber = userResponse.data.public_repos;
         if (this.perPage) {
            userMaxReposPages = Math.ceil(userReposNumber / this.perPage);
         } else {
            console.log("ELSE");
            userMaxReposPages = 1;
         }

         this.$store.commit("SET_USER_MAX_REPOS_PAGES", {
            userMaxReposPages: userMaxReposPages,
         });

         //Store user avatar URL
         this.$store.commit("SET_USER_REPOS", { repos: repos.data });

         // Go to user repos page
         if (this.changeRoute) {
            this.$router.push({ name: "UserRepos" });
         }
      } catch (error) {
         console.log(error.message);
         this.$store.commit("SET_ERROR_MESSAGE", {
            errorMessage: error.message,
         });
         this.$store.commit("SET_SHOW_ERROR_MODAL", {
            showErrorModal: true,
         });
      } finally {
         //  console.log(this.$store.getters.userRepo);
      }
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
   margin-top: 0;
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
