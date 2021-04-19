<template>
   <div class="wrapper">
      <!-- SEARCH -->
      <TheContainer
         :width="'max-content'"
         :margin="'40px auto'"
         :borderRadius="'25px'"
         :bgColor="'transparent'"
         :borderColor="'transparent'"
         :boxShadow="'none'"
         v-if="!isLoading"
      >
         <SearchBar
            :placeholder="this.userLogin"
            :isHomepage="false"
            @clicked="setContent"
         />
      </TheContainer>

      <div v-if="!isLoading" class="userRepos">
         <!-- USER CARD -->
         <section class="repos-owner">
            <TheContainer
               width="95%"
               :bgColor="'#2C445C'"
               :bg="'linear-gradient(20deg, #2C445C 60%, #8396A8 100%)'"
            >
               <div class="owner-card">
                  <div class="avatar">
                     <img
                        @click="goToUserPage"
                        v-if="userData.avatar_url"
                        :src="userData.avatar_url"
                        alt=""
                     />
                     <img
                        @click="goToUserPage"
                        v-else
                        src="@/assets/logo.png"
                        alt=""
                     />
                  </div>
                  <div class="details">
                     <h2 v-if="userData.name" class="align-self-center name">
                        {{ userData.name }}
                     </h2>
                     <h3
                        v-if="userLogin && userData.name"
                        name="login"
                        class="align-self-center login"
                     >
                        ({{ userLogin }})
                     </h3>
                     <h2
                        v-else-if="!userData.name"
                        name="login"
                        class="align-self-center name"
                     >
                        {{ userLogin }}
                     </h2>
                     <h2 v-else name="login" class="align-self-center name">
                        User
                     </h2>
                     <hr class="separator" />
                     <p name="public-repos-number">
                        Public repositories
                        <span class="bold">{{ userData.public_repos }}</span>
                     </p>
                     <p name="followers-number">
                        Followed by
                        <span class="bold">{{ userData.followers }}</span>
                        github users.
                     </p>
                     <p name="following-number">
                        Following
                        <span class="bold">{{ userData.following }}</span>
                        github users.
                     </p>
                     <p name="email">{{ userData.email }}</p>
                  </div>
               </div>
            </TheContainer>
         </section>

         <!-- USER REPOS -->
         <section class="user-repos-list">
            <!-- Header -->
            <TheTitle v-if="repos.length > 0"
               >{{
                  userData.name ? userData.name : userData.login
               }}
               repositories</TheTitle
            >
            <TheTitle v-else
               >{{ userData.name ? userData.name : userData.login }} have no
               repositories to show</TheTitle
            >
            <!-- Pager -->
            <div v-if="repos.length > 0" class="pager">
               <p class="__details">
                  Current Page:
                  <span class="bold"
                     >{{ currentPage }} / {{ userMaxReposPages }}</span
                  >
               </p>
               <form class="__page-form" @submit.prevent="pager">
                  <div>
                     Page:
                     <input
                        type="number"
                        v-model.number="goToPage"
                        :max="userMaxReposPages"
                        min="1"
                     />
                     <button type="submit">GO</button>
                  </div>
               </form>
            </div>

            <!-- Repos -->
            <TheRepo
               v-for="repo in repos"
               :key="repo.id"
               :userLogin="userLogin"
               :repoName="repo.name"
            >
               <template>
                  <template slot="header">{{ repo.name }}</template>

                  <template slot="description">
                     <span class="bold">Description:</span>
                     {{ repo.description ? repo.description : "-" }}
                  </template>

                  <template slot="forks"
                     ><span class="bold">Forks:</span>
                     {{ repo.forks }}</template
                  >
                  <template slot="githubUrl">
                     <span class="bold">Github Url:</span> {{ repo.url }}
                  </template>

                  <template slot="cloneUrl">
                     <span class="bold">Clone Url:</span>
                     {{ repo.clone_url }}
                  </template>

                  <template slot="createdAt">
                     <span class="bold">Created at:</span>
                     {{ $luxon(repo.created_at) }}
                  </template>
               </template>
            </TheRepo>
         </section>
      </div>

      <TheModal v-if="showErrorModal" @close="closeErrorModal">
         <h3 slot="header">Error</h3>
         <p slot="body">{{ errorMessage }}</p>
         <p slot="footer">
            <button
               class="modal-default-button"
               @click="
                  $emit('close');
                  handleError();
               "
            >
               Close
            </button>
         </p>
      </TheModal>
   </div>
</template>

<script>
import { Component, Vue, Watch } from "vue-property-decorator";
import TheContainer from "@/components/core/TheContainer.vue";
import TheTitle from "@/components/core/TheTitle.vue";
import SearchBar from "@/components/SearchBar.vue";
import TheModal from "@/components/core/TheModal.vue";
import TheRepo from "@/components/core/TheRepo.vue";
import RepositoryService from "@/services/RepositoryService";
import UserService from "@/services/UserService";
import ErrorService from "@/services/ErrorService";

@Component({
   components: {
      TheContainer,
      TheTitle,
      SearchBar,
      TheModal,
      TheRepo,
   },
})
export default class UserRepos extends Vue {
   goToPage = 1;
   repos = [];
   userData = [];
   get userLogin() {
      return this.$route.params.user;
   }

   async goToUserPage() {
      this.$router.push({ name: "UserPage", params: { user: this.userLogin } });
   }

   handleError() {
      this.$store.commit("SET_IS_LOADING", {
         showErrorModal: false,
      });
      this.$store.commit("SET_SHOW_ERROR_MODAL", {
         showErrorModal: false,
      });
      this.$store.commit("SET_CURRENT_USER_LOGIN", {
         login: "",
      });
      this.$router.push({ name: "Home" });
   }

   get isLoading() {
      return this.$store.getters.isLoading;
   }

   // PAGER & FILTER
   get order() {
      return this.$store.getters.searchOrder;
   }
   get sorting() {
      return this.$store.getters.searchSorting;
   }
   get perPage() {
      return this.$store.getters.currentPerPage;
   }
   async pager() {
      try {
         const repos = await Vue.axios.get(
            `https://api.github.com/users/${this.userLogin}/repos?page=${this.goToPage}&per_page=${this.perPage}`
         );

         //Store user repos
         this.repos = repos.data;

         //Store current page
         this.$store.commit("SET_CURRENT_PAGE", {
            currentPage: this.goToPage,
         });
      } catch (err) {
         console.warn(err.message);
      }
   }
   get currentPage() {
      return this.$store.getters.currentPage;
   }
   get userMaxReposPages() {
      return this.$store.getters.userMaxReposPages;
   }
   // ERROR MODAL
   get showErrorModal() {
      return this.$store.getters.showErrorModal;
   }
   closeErrorModal() {
      this.$store.commit("SET_SHOW_ERROR_MODAL", {
         showErrorModal: false,
      });
   }
   get errorMessage() {
      return this.$store.getters.errorMessage;
   }

   // CHANGE PAGE CONTENT ON USER CHANGE
   @Watch("userLogin")
   resetPage() {
      this.goToPage = 1;
   }
   @Watch("userLogin")
   async setContent() {
      let userMaxReposPages;
      this.$store.commit("SET_IS_LOADING", {
         isLoading: true,
      });
      try {
         let userResponse;
         let repos;
         if (this.userLogin) {
            // GET REPOS
            repos = await RepositoryService.getRepos(
               this.userLogin,
               this.sorting,
               this.order,
               this.perPage,
               this.goToPage
            );

            //  GET USER
            userResponse = await UserService.getUser(this.userLogin);
         }

         //Save user repos
         this.repos = repos.data;
         //Save userData
         this.userData = userResponse.data;

         //Store current page
         this.$store.commit("SET_CURRENT_PAGE", {
            currentPage: this.goToPage,
         });

         //Store user repos max page
         const userReposNumber = userResponse.data.public_repos;
         if (this.perPage) {
            userMaxReposPages = Math.ceil(userReposNumber / this.perPage);
         } else {
            userMaxReposPages = 1;
         }
         this.$store.commit("SET_USER_MAX_REPOS_PAGES", {
            userMaxReposPages: userMaxReposPages,
         });

         //SET_CURRENT_USER_LOGIN; to compare with user from input (if it is same page will not reload)
         this.$store.commit("SET_CURRENT_USER_LOGIN", {
            login: this.userLogin,
         });

         //Loading Off
         this.$store.commit("SET_IS_LOADING", {
            isLoading: false,
         });
      } catch (error) {
         console.warn(error.message);
         this.$store.commit("SET_ERROR_MESSAGE", {
            errorMessage: error.message,
         });
         this.$store.commit("SET_SHOW_ERROR_MODAL", {
            showErrorModal: true,
         });
      }
   }

   beforeMount() {
      this.setContent();
   }

   beforeDestroy() {
      // Clean Repo []
      this.repos = [];
   }
}
</script>

<style lang="scss" scoped>
.userRepos {
   display: flex;
   flex-direction: row;
   margin: auto auto;
}
.wrapper {
   min-height: 800px;
   width: 1400px;
   margin: auto auto;
}

.repos-owner {
   display: flex;
   justify-content: center;
   width: 45%;

   position: -webkit-sticky;
   position: sticky;
   top: 0;

   .owner-card {
      display: flex;
      flex-direction: column;

      .avatar {
         align-self: center;
         border-radius: 50%;
         overflow: hidden;
         width: 250px;
         height: 250px;
         margin: 50px 0;
         border: 2px solid $main-app-color-dark;
         background-color: $main-app-color-dark;
         cursor: pointer;
         box-shadow: 2px 2px 10px 1px #000;
         &:hover {
            transform: scale(1.05);
         }
         img {
            min-width: 100%;
            max-width: 100%;
         }
      }

      .details {
         display: flex;
         flex-direction: column;
         .name {
            font-size: 3rem;
            margin-top: 20px;
            color: $third-app-color-dark;
         }
         .login {
            font-size: 2rem;
            color: $third-app-color-light;
         }

         p {
            font-size: 1.5rem;
            padding: 10px;
         }
      }
   }
}

.user-repos-list {
   width: 55%;
   overflow: hidden;

   .repos-list {
      display: flex;
      flex-direction: column;
      .repo-item {
         display: flex;
         flex-direction: row;
         .repo-el {
            display: block;
            margin: 10px 20px;
         }
      }
   }
}

.pager {
   display: flex;
   padding: 0 10px;
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
   .__page-form {
      input,
      button {
         padding: 5px;
         background-color: #ffffff20;
         color: #fff;
         border: none;
         outline: none;
      }
      input {
         width: 50px;
      }
      button {
         margin-left: 5px;
         transition: background-color 0.3s ease-out;
         &:hover {
            background-color: $third-app-color-dark;
            cursor: pointer;
         }
      }
   }
}
</style>
