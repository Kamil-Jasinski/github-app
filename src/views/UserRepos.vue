<template>
   <div class="wrapper">
      
      <TheNav />
      <!-- SEARCH -->
      <TheContainer
         :width="'max-content'"
         :margin="'40px auto'"
         :borderRadius="'25px'"
         :bgColor="'transparent'"
         :borderColor="'transparent'"
         :boxShadow="'none'"
         class="searchBar"
      >
         <SearchBar
            :placeholder="this.userLogin"
            :isHomepage="false"
            @clicked="loadData"
         />
      </TheContainer>

      <div class="userRepos">
         <!-- USER CARD -->
         <section class="repos-owner" ref="reposOwner">
            <TheContainer
               width="95%"
               :bgColor="'#2C445C'"
               :bg="'linear-gradient(20deg, #2C445C 60%, #8396A8 100%)'"
            >
               <div class="owner-card">
                  <div
                     class="avatar"
                     @mouseover="animateAvatar(true)"
                     @mouseleave="animateAvatar(false)"
                  >
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
                        <span class="bold">{{
                           userData.public_repos ? userData.public_repos : "0"
                        }}</span>
                     </p>
                     <p name="followers-number">
                        Followed by
                        <span class="bold">{{
                           userData.followers ? userData.followers : "0"
                        }}</span>
                        github users.
                     </p>
                     <p name="following-number">
                        Following
                        <span class="bold">{{
                           userData.following ? userData.following : "0"
                        }}</span>
                        github users.
                     </p>
                     <p v-if="userData.email" name="email">
                        <font-awesome-icon icon="at" /> {{ userData.email }}
                     </p>
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

            <!-- Repos List -->
            <TheRepo
               v-for="repo in repos"
               :key="repo.id"
               :userLogin="userLogin"
               :repoName="repo.name"
               class="repoContainer"
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
                     <span class="bold">Github Url:</span> {{ repo.svn_url }}
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

      <TheModal
         v-if="showErrorModal"
         @close="
            closeErrorModal();
            handleError();
         "
      >
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
               Go Home
            </button>
         </p>
      </TheModal>
   </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import TheTitle from "@/components/core/TheTitle.vue";
import SearchBar from "@/components/SearchBar.vue";
import TheRepo from "@/components/core/TheRepo.vue";
import UserService from "@/services/UserService";
import gsap from "gsap";
import CSSPlugin from "gsap/CSSPlugin";

@Component({
   components: {
      TheTitle,
      SearchBar,
      TheRepo,
   },
})
export default class UserRepos extends Vue {
   goToPage = 1;
   repos:any = [];
   userData:[] = [];
   reposLoaded = false;
   userDataLoaded = false;
   pagerAnim = false;
   get userLogin():string {
      return this.$route.params.user;
   }
   get isLoading():boolean {
      return this.$store.getters.isLoading;
   }

   goToUserPage():void {
      this.$router.push({ name: "UserPage", params: { user: this.userLogin } });
   }

   handleError():void {
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

   // PAGER & FILTER
   get order():string {
      return this.$store.getters.searchOrder;
   }
   get sorting():string {
      return this.$store.getters.searchSorting;
   }
   get perPage():number {
      return this.$store.getters.currentPerPage;
   }

   async pager():Promise<void> {
      try {
         const repos = await UserService.getReposPerPage(this.userLogin, this.goToPage, this.perPage)

         //Store user repos
         this.repos = repos;
         console.log(repos);

         //Store current page
         this.$store.commit("SET_CURRENT_PAGE", {
            currentPage: this.goToPage,
         });

         //Allow animation
         this.pagerAnim = true;
      } catch (err) {
         console.warn(err.message);
      }
   }
   get currentPage():number {
      return this.$store.getters.currentPage;
   }
   get userMaxReposPages():number {
      return this.$store.getters.userMaxReposPages;
   }
   // ERROR MODAL
   get showErrorModal():boolean {
      return this.$store.getters.showErrorModal;
   }
   closeErrorModal():void {
      this.$store.commit("SET_SHOW_ERROR_MODAL", {
         showErrorModal: false,
      });
   }
   get errorMessage():string {
      return this.$store.getters.errorMessage;
   }

   // CHANGE PAGE CONTENT ON USER CHANGE
   @Watch("userLogin")
   resetPage():void {
      this.goToPage = 1;
   }
   @Watch("userLogin")
   async loadData():Promise<any> {
      if (this.userLogin) {
         // GET REPOS
         this.getRepos();
         //  GET USER
         this.getUser();
      }

      //Store current page
      this.$store.commit("SET_CURRENT_PAGE", {
         currentPage: this.goToPage,
      });

      //SET_CURRENT_USER_LOGIN; to compare with user from input (if it is same page will not reload)
      this.$store.commit("SET_CURRENT_USER_LOGIN", {
         login: this.userLogin,
      });
   }

   async getRepos():Promise<any> {
      this.setLoader(true);
      try {
         let repos;
         // GET REPOS
         repos = await UserService.getUserRepos(
            this.userLogin,
            this.sorting,
            this.order,
            this.perPage,
            this.goToPage
         );
         this.repos = repos!.data;

         //Loading Off
         this.setLoader(false);

         this.reposLoaded = true;
      } catch (err) {
         this.setLoader(false);
         console.warn(err.message);
         this.$store.commit("SET_ERROR_MESSAGE", {
            errorMessage: err.message,
         });
         this.$store.commit("SET_SHOW_ERROR_MODAL", {
            showErrorModal: true,
         });
      }
   }

   async getUser():Promise<void> {
      let userResponse;
      let userMaxReposPages:number;
      this.setLoader(true);
      try {
         userResponse = await UserService.getUser(this.userLogin);
         this.userData = userResponse!.data;

         //Store user repos max page
         const userReposNumber = userResponse!.data.public_repos;
         if (this.perPage) {
            userMaxReposPages = Math.ceil(userReposNumber / this.perPage);
         } else {
            userMaxReposPages = 1;
         }
         this.$store.commit("SET_USER_MAX_REPOS_PAGES", {
            userMaxReposPages: userMaxReposPages,
         });
         this.setLoader(false);
         this.userDataLoaded = true;
      } catch (err) {
         console.warn(err.message);
         this.$store.commit("SET_ERROR_MESSAGE", {
            errorMessage: err.message,
         });
         this.$store.commit("SET_SHOW_ERROR_MODAL", {
            showErrorModal: true,
         });
         this.setLoader(false);
      }
   }

   setLoader(mode:boolean):void {
      if (mode) {
         //Loading Off
         this.$store.commit("SET_IS_LOADING", {
            isLoading: true,
         });
      } else if (!mode) {
         //Loading Off
         this.$store.commit("SET_IS_LOADING", {
            isLoading: false,
         });
      }
   }

   //ANIMATIONS
   animateUserReposPage():void {
      gsap.registerPlugin(CSSPlugin);
      const repoContainers = document.querySelectorAll(".repoContainer");
      const searchBar = document.getElementsByClassName("searchBar");
      const reposOwner = this.$refs.reposOwner;

      const userReposTimeline = gsap.timeline();

      if (this.reposLoaded && this.userDataLoaded) {
         userReposTimeline
            .fromTo(
               [searchBar, ".main-nav"],
               { autoAlpha: 0, y: 100, scale: 0.6 },
               { autoAlpha: 1, duration: 0.8, delay: 0.3, y: 0, scale: 1 }
            )
            .fromTo(
               reposOwner,
               { autoAlpha: 0, y: "-50px", scale: 1 },
               {
                  autoAlpha: 1,
                  duration: 0.8,
                  y: 0,
                  scale: 1,
                  ease: "back.out(0.5)",
               },
               "-=.2"
            )
            .fromTo(
               [".pager", ".core-title-container"],
               { xPercent: "-120", autoAlpha: 0 },
               { xPercent: 0, autoAlpha: 1, duration: 0.6 },
               "-=.2"
            )
            .fromTo(
               repoContainers,
               { xPercent: "-120", autoAlpha: 0 },
               { xPercent: 0, autoAlpha: 1, stagger: 0.2, duration: 0.6 }
            )
            .fromTo(
               ".avatar",
               { scale: 0.95 },
               { scale: 1, duration: 1.5, ease: "elastic.out(5.5, 0.7)" }
            );

         this.userDataLoaded = false;
         this.reposLoaded = false;
      }
   }
   animateOnlyRepos():void {
      gsap.registerPlugin(CSSPlugin);
      const repoContainers = document.querySelectorAll(".repoContainer");

      const userReposTimeline = gsap.timeline();

      if (this.pagerAnim) {
         userReposTimeline.fromTo(
            repoContainers,
            { xPercent: "-120", autoAlpha: 0 },
            { xPercent: 0, autoAlpha: 1, stagger: 0.2, duration: 0.6 }
         );

         // Lock animation
         this.pagerAnim = false;
      }
   }
   animateAvatar(animate:boolean):void {
      const avatarTimeline = gsap.timeline();

      if (animate) {
         avatarTimeline.to(".avatar", {
            scale: 1.1,
            ease: "ease-in-out",
         });
      } else if (!animate) {
         avatarTimeline.to(".avatar", {
            scale: 1,
            ease: "ease-in-out",
         });
      }
   }

   // Life Cycle
   created():void {
      this.loadData();
   }

   updated():void {
      this.animateUserReposPage();
      this.animateOnlyRepos();
   }

   beforeDestroy():void {
      // Clean Repo []
      this.repos = [];

      // Reset current user
      this.$store.commit("SET_CURRENT_USER_LOGIN", {
         login: "",
      });
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

// For GSAP
.repos-owner,
.searchBar,
.repoContainer,
.pager,
.core-title-container,
.main-nav {
   visibility: hidden;
}

.repos-owner {
   display: flex;
   justify-content: center;
   width: 45%;

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
