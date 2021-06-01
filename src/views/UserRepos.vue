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
               :bg="'linear-gradient(20deg, rgb(45 50 56) 60%, rgb(52 65 78) 100%)'"
                class="sticky"
            >
               <div class="owner-card">
                  <div
                     class="avatar"
                     @mouseover="animateAvatar(true)"
                     @mouseleave="animateAvatar(false)"
                     v-tooltip.bottom-end="'Go to ' + (userData.name?userData.name:null) + ' user page.'"
                  >
                     <img
                        
                        @click="goToUserPage"
                        v-if="userData.avatar_url"
                        :src="userData.avatar_url"
                        alt="User Avatar"
                     />
                     <img
                        @click="goToUserPage"
                        v-else
                        src="@/assets/logo.png"
                        alt=""
                     />
                  </div>
                  <div class="details">
                     <h2 @click="goToUserPage" v-if="userData.name" class="align-self-center name">
                        {{ userData.name }}
                     </h2>
                     <h3
                        @click="goToUserPage"
                        v-if="userLogin && userData.name"
                        name="login"
                        class="align-self-center login"
                     >
                        ({{ userLogin }})
                     </h3>
                     <h2
                        @click="goToUserPage"   
                        v-else-if="!userData.name"
                        name="login"
                        class="align-self-center name"
                     >
                        {{ userLogin }}
                     </h2>
                     <h2 @click="goToUserPage" v-else name="login" class="align-self-center name">
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
                        <span v-tooltip="followedByUsersTooltip" @click="userData.followers !== 0 ? getFollowers() : log('No need to connect with API, result gonna be empty.')" class="bold underline clickable">{{
                           userData.followers ? userData.followers : "0"
                        }}</span>
                        github users.
                     </p>
                     <p name="following-number">
                        Following
                        <span v-tooltip="followingUsersTooltip" @click="userData.following !== 0 ? getFollowedUsers() : log('No need to connect with API, result gonna be empty.')" class="bold underline clickable">{{
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
                  <template slot="fork"
                     ><span class="bold">Fork:</span>
                    
                        <font-awesome-icon v-tooltip="'You can fork to this repo.'" v-if="repo.fork" class="icon icon--true" icon="check-circle" />
                        <font-awesome-icon v-tooltip="'You can\'t fork to this repo.'" v-else class="icon icon--false" icon="times-circle" />
                     
                  </template
                  >
                   <template slot="has_issues"
                     ><span class="bold">Has Issues:</span>
                    
                        <font-awesome-icon v-tooltip="'The repo has some issues.'" v-if="repo.has_issues" class="icon icon--true" icon="check-circle" />
                        <font-awesome-icon v-tooltip="'The repo have not any issues.'" v-else class="icon icon--false" icon="times-circle" />
                     
                  </template
                  >
                   <template slot="has_pages"
                     ><span class="bold">Has Pages:</span>
                    
                        <font-awesome-icon v-tooltip="'The repo has some pages.'" v-if="repo.has_pages" class="icon icon--true" icon="check-circle" />
                        <font-awesome-icon v-tooltip="'The repo have not any pages.'" v-else class="icon icon--false" icon="times-circle" />
                     
                  </template
                  >
                   <template slot="has_wiki"
                     ><span class="bold">Has Wiki:</span>
                    
                        <font-awesome-icon v-tooltip="'The repo has wiki.'" v-if="repo.has_wiki" class="icon icon--true" icon="check-circle" />
                        <font-awesome-icon v-tooltip="'The repo have not any wiki.'" v-else class="icon icon--false" icon="times-circle" />
                     
                  </template
                  >
                   <template slot="has_downloads"
                     ><span class="bold">Has Downloads:</span>
                    
                        <font-awesome-icon v-tooltip="'The repo have some downloads.'" v-if="repo.has_downloads" class="icon icon--true" icon="check-circle" />
                        <font-awesome-icon v-tooltip="'The repo have not any downloads.'" v-else class="icon icon--false" icon="times-circle" />
                     
                  </template
                  >
                  <template slot="githubUrl">
                     <span class="bold">Github Url:</span> <a v-tooltip="'This link gonna take you away from this site to the repository page on github page.'" :href="repo.svn_url" target="blank">{{ repo.svn_url }}</a>
                  </template>

                  <template slot="cloneUrl">
                     <span class="bold">Clone Url:</span>
                     <span v-tooltip="'Copy this link to clone this repository.'"> {{ repo.clone_url }}</span>
                  </template>

                  <template slot="createdAt">
                     <span class="bold">Created at:</span>
                     {{ $luxon(repo.created_at) }}
                  </template>
               </template>
            </TheRepo>
         </section>
      </div>

      <!-- Followers -->
      <TheModal
         v-if="openFollowersModal && followers && followers.length > 0"
         @close="openFollowersModal = false"
      >
         <template #header>Followers:</template>

         <template #body>
            <ul v-if="followers.length > 0">
               <li v-for="item in followers" :key="item.id">
                  <UserCard
                     :userLogin="item.login"
                     :userAvatarUrl="item.avatar_url"
                  />
               </li>
            </ul>

               <!-- Pager -->
            <div v-if="followers.length > 0" class="pager">
               <p class="__details">
                  Followers Page:
                  <span class="bold"
                     >{{ followersPager[0] }} / {{ Math.ceil(userData.followers / followersPager[1]) }}</span
                  >
               </p>
               <div class="__page-form">
                  <div>
                     <button :disabled="!(followersPager[0] >= 2)" @click="getFollowers('prev')">Prev. Page</button>
                     <button :disabled="followers.length < followersPager[1]" @click="getFollowers('next')">Next Page</button>
                  </div>
               </div>
            </div>
            <div v-if="followers.length <= 0">There is no more to show</div>
         </template>

         <template #footer>
            <button
               class="modal-default-button"
               @click="openFollowersModal = false"
            >
               OK
            </button>
         </template>
      </TheModal>

       <!-- Followed Users -->
      <TheModal
      v-if="openFollowedUsersModal && followedUsers && followedUsers.length > 0"
       
         @close="openFollowedUsersModal = false"
      >
         <template #header>Followed Users:</template>

         <template #body>
            <ul v-if="followedUsers.length > 0">
               <li v-for="item in followedUsers" :key="item.id">
                  <UserCard
                     :userLogin="item.login"
                     :userAvatarUrl="item.avatar_url"
                  />
               </li>
            </ul>

               <!-- Pager -->
            <div v-if="followedUsers.length > 0" class="pager">
               <p class="__details">
                  Followed Users Page:
                  <span class="bold"
                     >{{ followedPager[0] }} / {{ Math.ceil(userData.following / followedPager[1]) }}</span
                  >
               </p>
               <div class="__page-form">
                  <div>
                     <button :disabled="!(followedPager[0] >= 2)" @click="getFollowers('prev')">Prev. Page</button>
                     <button :disabled="followedUsers.length < followedPager[1]" @click="getFollowedUsers('next')">Next Page</button>
                  </div>
               </div>
            </div>
            <div v-if="followedUsers.length <= 0">There is no more to show</div>
         </template>

         <template #footer>
            <button
               class="modal-default-button"
               @click="openFollowedUsersModal = false; followedPager[0] = 1"
            >
               OK
            </button>
         </template>
      </TheModal>
      <TheLoader
         v-if="
            openFollowedUsersModal && followedUsers.length === 0 && OPL ||
            openFollowersModal && followers.length === 0 && OPL
         "
      />

      <!-- Errors -->
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
import UserCard from "@/components/core/UserCard.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import TheTitle from "@/components/core/TheTitle.vue";
import SearchBar from "@/components/SearchBar.vue";
import TheRepo from "@/components/core/TheRepo.vue";
// import UserService, {reposPerPage} from "@/services/UserService";
import UserService from "@/services/UserService";
import gsap from "gsap";
import CSSPlugin from "gsap/CSSPlugin";

@Component({
   components: {
      TheTitle,
      SearchBar,
      TheRepo,
      UserCard
   },
})
export default class UserRepos extends Vue {
   goToPage = 1;
   // repos: reposPerPage = {
   //       id: 0,
   //      node_id: '',
   //      name: '',
   //      full_name: '',
   //      private: false,
   //      owner: {
   //          login: '',
   //          id: 0,
   //          node_id: '',
   //          avatar_url: '',
   //          gravatar_id: '',
   //          url: '',
   //          html_url: '',
   //          followers_url: '',
   //          following_url: '',
   //          gists_url: '',
   //          starred_url: '',
   //          subscriptions_url: '',
   //          organizations_url: '',
   //          repos_url: '',
   //          events_url: '',
   //          received_events_url: '',
   //          type: '',
   //          site_admin: false
   //      },
   //      html_url: '',
   //      description: '',
   //      fork: false,
   //      url: '',
   //      forks_url: '',
   //      keys_url: '',
   //      collaborators_url: '',
   //      teams_url: '',
   //      hooks_url: '',
   //      issue_events_url: '',
   //      events_url: '',
   //      assignees_url: '',
   //      branches_url: '',
   //      tags_url: '',
   //      blobs_url: '',
   //      git_tags_url: '',
   //      git_refs_url: '',
   //      trees_url: '',
   //      statuses_url: '',
   //      languages_url: '',
   //      stargazers_url: '',
   //      contributors_url: '',
   //      subscribers_url: '',
   //      subscription_url: '',
   //      commits_url: '',
   //      git_commits_url: '',
   //      comments_url: '',
   //      issue_comment_url: '',
   //      contents_url: '',
   //      compare_url: '',
   //      merges_url: '',
   //      archive_url: '',
   //      downloads_url: '',
   //      issues_url: '',
   //      pulls_url: '',
   //      milestones_url: '',
   //      notifications_url: '',
   //      labels_url: '',
   //      releases_url: '',
   //      deployments_url: '',
   //      created_at: new Date,
   //      updated_at: new Date,
   //      pushed_at: new Date,
   //      git_url: '',
   //      ssh_url: '',
   //      clone_url: '',
   //      svn_url: '',
   //      homepage: null,
   //      size: 0,
   //      stargazers_count: 0,
   //      watchers_count: 0,
   //      language: '',
   //      has_issues: false,
   //      has_projects: false,
   //      has_downloads: false,
   //      has_wiki: false,
   //      has_pages: false,
   //      forks_count: 0,
   //      mirror_url: null,
   //      archived: false,
   //      disabled: false,
   //      open_issues_count: 0,
   //      license: null,
   //      forks: 0,
   //      open_issues: 0,
   //      watchers: 0,
   //      default_branch: ''
   // };
   userData:any = [];
   repos: any[] = [];
   reposLoaded = false;
   userDataLoaded = false;
   pagerAnim = false;
   //Followers
   openFollowersModal = false;
   followersPager = [1,5] // [page / perPage]
   followers = [];
   //Following
   openFollowedUsersModal = false;
   followedPager = [1,5] // [page / perPage]
   followedUsers = [];
   nts = 'Nothing to show.';
   
   // Loader - OPL (Open Loader ?)
   get OPL() {
      return this.$store.getters.OPL
   }


   // Tooltips
   get followedByUsersTooltip():string {
      if (this.userData.followers > 0) {
         return  `Click to see users following ${this.userLogin?this.userLogin:this.userData.name}`;
         } else {return this.nts}
   }
   // @Watch("loadData")
   get followingUsersTooltip():string {
         if (this.userData.following > 0) {
            return `Click to see users followed by ${this.userLogin?this.userLogin:this.userData.name}`;
         } else {return this.nts}
   }




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
   //Get Followers
    async getFollowers(mode:string):Promise<void> {
       this.openFollowersModal = true;
        if (mode === 'next' && mode != null) {
             this.followersPager[0]++;
         } else if (mode === 'prev'){
            this.followersPager[0] >= 2 ? this.followersPager[0]-- : this.followersPager[0] = 1;
         } else {
            //Do nothing
         }
      try {
         this.followers = await UserService.getFollowers(this.userLogin, this.openFollowersModal, this.followersPager[0], this.followersPager[1]);
      } catch (err) {
         console.warn(err.message);
      }
   }
   //Get Followed Users
   async getFollowedUsers(mode:string):Promise<void> {
      this.openFollowedUsersModal = true;
      if (mode === 'next' && mode != null) {
            this.followedPager[0]++;
      } else if (mode === 'prev'){
         this.followedPager[0] >= 2 ? this.followedPager[0]-- : this.followedPager[0] = 1;
      } else {
         //Do nothing
      }
   try {
      this.followedUsers = await UserService.getFollowedUsers(this.userLogin, this.openFollowedUsersModal, this.followedPager[0], this.followedPager[1]);
   } catch (err) {
      console.warn(err.message);
   }
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
         this.repos = await UserService.getReposPerPage(this.userLogin, this.goToPage, this.perPage);

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
         this.repos = repos?.data;

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
         this.userData = userResponse?.data;

         //Store user repos max page
         const userReposNumber = userResponse?.data.public_repos;
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

   //Other
   log(text:string) {
      console.warn(text);
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
               { scale: 1, duration: 1.5, ease: "elastic.out(5.5, 0.7)"}, "<"
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
   .sticky {
      position: sticky;
      top: 20px;
   }
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
            text-shadow: 2px 2px 30px #24292e;
            cursor: pointer;
            transition: all .3s ease;
            &:hover {
               text-decoration: underline;
               transform: translateY(-10px);
            }
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
</style>
