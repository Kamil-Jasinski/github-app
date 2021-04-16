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
      >
         <SearchBar />
      </TheContainer>

      <div class="userRepos">
         <!-- USER CARD -->
         <section class="repos-owner">
            <TheContainer
               width="95%"
               :bgColor="'#2C445C'"
               :bg="'linear-gradient(20deg, #2C445C 60%, #8396A8 100%)'"
            >
               <div class="owner-card">
                  <div class="avatar">
                     <img v-if="userAvatarUrl" :src="userAvatarUrl" alt="" />
                     <img v-else src="@/assets/logo.png" alt="" />
                  </div>
                  <div class="details">
                     <h2 v-if="userName" class="align-self-center name">
                        {{ userName }}
                     </h2>
                     <h3
                        v-if="userLogin && userName"
                        name="login"
                        class="align-self-center login"
                     >
                        ({{ userLogin }})
                     </h3>
                     <h2
                        v-else-if="!userName"
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
                        <span class="bold">{{ user.public_repos }}</span>
                     </p>
                     <p name="followers-number">
                        Followed by
                        <span class="bold">{{ user.followers }}</span> github
                        users.
                     </p>
                     <p name="following-number">
                        Following
                        <span class="bold">{{ user.following }}</span> github
                        users.
                     </p>
                     <p name="email">{{ user.email }}</p>
                  </div>
               </div>
            </TheContainer>
         </section>

         <!-- USER REPOS -->
         <section class="user-repos-list">
            <!-- Header -->
            <TheTitle v-if="repos.length > 0"
               >{{ user.name ? user.name : user.login }} repositories</TheTitle
            >
            <TheTitle v-else
               >{{ user.name ? user.name : user.login }} have no repositories to
               show</TheTitle
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

               <TheModal v-if="showErrorModal" @close="setShowErrorModal">
                  <h3 slot="header">Error</h3>
                  <p slot="body">{{ errorMessage }}</p>
               </TheModal>
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
   </div>
</template>

<script>
import { Component, Vue, Watch } from "vue-property-decorator";
import TheContainer from "@/components/core/TheContainer.vue";
import TheTitle from "@/components/core/TheTitle.vue";
import SearchBar from "@/components/SearchBar.vue";
import TheModal from "@/components/core/TheModal.vue";
import TheRepo from "@/components/core/TheRepo.vue";

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
   get showErrorModal() {
      return this.$store.getters.showErrorModal;
   }

   setShowErrorModal() {
      this.$store.commit("SET_SHOW_ERROR_MODAL", {
         showErrorModal: false,
      });
   }

   get errorMessage() {
      return this.$store.getters.errorMessage;
   }
   @Watch("userLogin")
   resetPage() {
      this.goToPage = 1;
   }

   async pager() {
      // let userName;
      console.log("Go to page", this.goToPage);

      try {
         const repos = await Vue.axios.get(
            // `https://api.github.com/users/${this.userLogin}/repos?page=${this.goToPage}&per_page=${this.currentPerPage}`
            `https://api.github.com/users/${this.userLogin}/repos?page=${this.goToPage}&per_page=${this.currentPerPage}`
         );

         //Store user repos
         this.$store.commit("SET_USER_REPOS", { repos: repos.data });

         //Store current page
         this.$store.commit("SET_CURRENT_PAGE", {
            currentPage: this.goToPage,
         });
      } finally {
         //  console.log(this.$store.getters.userRepo);
      }
   }

   get userMaxReposPages() {
      return this.$store.getters.userMaxReposPages;
   }

   get currentPage() {
      return this.$store.getters.currentPage;
   }
   get currentPerPage() {
      return this.$store.getters.currentPerPage;
   }
   get currentUser() {
      return this.$route.params.userName;
   }

   get userLogin() {
      return this.$store.getters.userLogin;
   }

   get userName() {
      return this.$store.getters.userName;
   }

   get user() {
      return this.$store.getters.user;
   }

   get repos() {
      return this.$store.getters.userRepos;
   }
   get userAvatarUrl() {
      return this.$store.getters.userAvatarUrl;
   }

   mounted() {
      console.log(this.repos);
   }

   beforeMount() {
      // TODO: przerobić na ID użytkownika if id === null
      if (this.repos.length === 0) {
         this.$router.push({ name: "Home" });
         console.log("brak repo - cofnij do wyszukiwarki");
      }
   }
}
</script>

<style lang="scss" scoped>
.userRepos {
   display: flex;
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
         img {
            min-width: 100%;
            max-width: 100%;
         }
      }

      .details {
         display: flex;
         flex-direction: column;
         .name {
            // align-self: center;
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
