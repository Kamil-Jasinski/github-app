<template>
   <div
      class="core-repo-container"
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
      <h2 class="repo-name">
         <slot name="header">
            <!-- default header -->
            Repo Name
         </slot>
      </h2>

      <hr class="separator" />

      <div class="details">
         <!-- default body  -->
         <ul>
            <li class="__detail"><slot name="description">-</slot></li>
            <li class="__detail"><slot name="forks">0</slot></li>
            <li class="__detail"><slot name="githubUrl">-</slot></li>
            <li class="__detail"><slot name="cloneUrl">-</slot></li>
            <li class="__detail"><slot name="createdAt">-</slot></li>
            <li class="__detail"><slot name="fork">-</slot></li>
            <li class="__detail"><slot name="has_issues">-</slot></li>
            <li class="__detail"><slot name="has_pages">-</slot></li>
            <li class="__detail"><slot name="has_wiki">-</slot></li>
            <li class="__detail"><slot name="has_downloads">-</slot></li>
         </ul>
         <p v-if="showNotify" class="notify">{{ notify }}</p>
      </div>

      <slot name="footer">
         <section class="footer">
            <!-- default footer -->
            <button class="card-button" @click="openCommitsModal = true">
               Commits
            </button>
            <button class="card-button" @click="openContributorsModal = true">
               Contributors
            </button>
         </section>
      </slot>

      <!-- COMMITS -->
      <TheModal
         v-if="openCommitsModal && commits.length > 0"
         @close="openCommitsModal = false"
      >

         <template #header>Commits for: {{ repoName }}</template>

         <template #body>
            <ul>
               <li v-for="item in commits" :key="item.node_id">
                  <div class="commit-body">
                     <div>
                        <p class="__author bold">
                           {{ item.commit.author.name }}
                        </p>
                        <p class="__date">
                           {{ $luxon(item.commit.author.date) }}
                        </p>
                     </div>
                     <p class="__message">{{ item.commit.message }}</p>
                  </div>
               </li>
            </ul>

             <!-- Pager -->
            <div class="pager">
               <p class="__details">
                  Commits Page:
                  <span class="bold"
                     >{{ currCommitsPage }}</span
                  >
               </p>
               <div class="__page-form">
                  <div>
                     <button :disabled="!(currCommitsPage >= 2)" @click="getCommits('prev')">Prev. Page</button>
                     <button :disabled="commits.length < commitsPerPage" @click="getCommits('next')">Next Page</button>
                  </div>
               </div>
            </div>
         </template>

         <template #footer>
            <button
               class="modal-default-button"
               @click="
                  openCommitsModal = false;
                  commits = [];
               "
            >
               OK
            </button>
         </template>
      </TheModal>
      <TheLoader v-if="openCommitsModal && commits.length === 0" />

      <!-- CONTRIBUTORS -->
      <TheModal
         v-if="openContributorsModal && contributors && contributors.length > 0"
         @close="openContributorsModal = false"
      >
         <template #header>Contributors for: {{ repoName }}</template>

         <template #body>
            <ul>
               <li v-for="item in contributors" :key="item.id">
                  <UserCard
                     :userLogin="item.login"
                     :userAvatarUrl="item.avatar_url"
                     :contributions="item.contributions"
                  />
               </li>
            </ul>

             <!-- Pager -->
            <div class="pager">
               <p class="__details">
                  Commits Page:
                  <span class="bold"
                     >{{ currContributorsPage }}</span
                  >
               </p>
               <div class="__page-form">
                  <div>
                     <button :disabled="!(currContributorsPage >= 2)" @click="getContributors('prev')">Prev. Page</button>
                     <button :disabled="contributors.length < contributorsPerPage" @click="getContributors('next')">Next Page</button>
                  </div>
               </div>
            </div>
         </template>

         <template #footer>
            <button
               class="modal-default-button"
               @click="openContributorsModal = false"
            >
               OK
            </button>
         </template>
      </TheModal>
      <TheLoader
         v-if="
            openContributorsModal && contributors && contributors.length === 0
         "
      />
   </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import TheModal from "@/components/core/TheModal.vue";
import UserCard from "@/components/core/UserCard.vue";
import RepositoryService from "@/services/RepositoryService";

@Component({
   components: {
      TheModal,
      UserCard,
   },
})
export default class TheRepo extends Vue {
   @Prop({ default: "auto" }) width?:string | null;
   @Prop({ default: "auto" }) minWidth?:string | null;
   @Prop({ default: "25px 10px" }) margin?:string | null;
   @Prop({ default: null }) bgColor?:string | null;
   @Prop({ default: null }) borderColor?:string | null;
   @Prop({ default: "15px" }) borderRadius?:string | null;
   @Prop({ default: null }) boxShadow?:string | null;
   @Prop({ default: null }) bg?:string | null;
   @Prop({ default: null }) userLogin!:string;
   @Prop({ default: null }) repoName!:string;
   @Prop({ default: "master" }) branch!:string;

   openCommitsModal = false;
   openContributorsModal = false;
   showNotify = false;
   commits:string[] = [];
   contributors:[] = [];
   notify!:string;
   commitsPerPage = 20;
   currCommitsPage = 1;
   contributorsPerPage = 5;
   currContributorsPage = 1;

   
   @Watch("openCommitsModal")
   async getCommits(mode:string):Promise<void> {
      
      if (mode === 'next' && mode != null) {
             this.currCommitsPage++;
         } else if (mode === 'prev'){
            this.currCommitsPage >= 2 ? this.currCommitsPage-- : this.currCommitsPage = 1;
         } else {
            //Do nothing
         }

      try {
         this.commits = await RepositoryService.getCommits(
            this.userLogin,
            this.repoName,
            this.openCommitsModal,
            this.currCommitsPage,
            this.commitsPerPage
         );
      } catch (err) {
         console.warn(err.message);
         this.$store.commit("SET_ERROR_MESSAGE", {
            errorMessage: err.message,
         });
         this.$store.commit("SET_SHOW_ERROR_MODAL", {
            showErrorModal: true,
         });
      } finally {
         if (this.commits && this.commits.length === 0) {
            this.openCommitsModal = false;
            this.showNotify = true;
            if (mode === 'next' ) {
            this.notify = "No more commits to show.";
            } else {
               this.notify = "This repository has no commits to show.";
            }
         this.currCommitsPage = 1;
            setTimeout(() => {
               this.showNotify = false;
               this.notify = "";
            }, 2500);
         }
      }
   }

   @Watch("openContributorsModal")
   async getContributors(mode:string):Promise<any> {
       
      if (mode === 'next' && mode != null) {
             this.currContributorsPage++;
         } else if (mode === 'prev'){
            this.currContributorsPage >= 2 ? this.currContributorsPage-- : this.currContributorsPage = 1;
         } else {
            //Do nothing
         }
      try {
         this.contributors = await RepositoryService.getContributors(
            this.userLogin,
            this.repoName,
            this.openContributorsModal,
            this.currContributorsPage,
            this.contributorsPerPage
         );
      } catch (err) {
         console.warn(err.message);
         this.$store.commit("SET_ERROR_MESSAGE", {
            errorMessage: err.message,
         });
         this.$store.commit("SET_SHOW_ERROR_MODAL", {
            showErrorModal: true,
         });
      } finally {
         if (this.contributors && this.contributors.length === 0) {
            this.openContributorsModal = false;
            this.showNotify = true;
            if (mode === 'next' ) {
               this.notify = "No more contributors to show.";
            } else {
                this.notify = "This repository has no contributors to show.";
            }
            setTimeout(() => {
               this.showNotify = false;
               this.notify = "";
            }, 2500);
         }
      }
   }
}
</script>

<style lang="scss">
.core-repo-container {
   height: min-content;

   background-color: $main-app-color-light;
   border-radius: 10px;
   border: 4px solid $main-app-color-dark;
   padding: 20px;
   -webkit-box-shadow: 0px 3px 30px -1px $main-app-shadow-color;
   box-shadow: 0px 3px 30px -1px $main-app-shadow-color;
}
.repo-name {
   color: $third-app-color-dark;
   text-transform: capitalize;
}
.details {
   .__detail {
      border-left: 3px solid $third-app-color-dark;
      margin: 5px 0;
      padding-left: 10px;
      .icon {
         margin-left: 10px;
         &--true path{
            fill: #73ff73;
         }
          &--false path{
            fill: #ff8181;
         }
   }
   }

   .notify {
      padding: 10px;
      color: red;
      background-color: $main-app-color-dark;
      margin: 25px 0;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-align: center;
   }
}

.footer {
   display: flex;
   justify-content: flex-end;
   margin-top: 50px;

   .card-button {
      padding: 5px;
      background-color: transparent;
      margin: 5px;
      color: #fff;
      font-size: 0.8rem;
      font-weight: bold;
      letter-spacing: 0.05rem;
      outline: none;
      border: none;
      position: relative;
      &:hover {
         cursor: pointer;
         &::after {
            width: 100%;
            background-color: $third-app-color-dark;
         }
      }
      &::after {
         position: absolute;
         left: 50%;
         bottom: -5px;
         transform: translateX(-50%);
         content: "";
         height: 1px;
         width: 15px;
         transition: all 0.3s ease;

         background-color: $third-app-color-light;
      }
   }
}
.commit-body {
   display: flex;
   flex-direction: row;
   border-left: 3px solid $third-app-color-dark;
   margin: 25px 0;
   width: 700px;
   .__author {
      width: 20%;
      min-width: 200px;
      padding: 5px 5px 5px 15px;
      color: $third-app-color-light;
   }
   .__date {
      padding: 5px 5px 5px 15px;
      color: $third-app-color-light;
      font-size: 0.7rem;
   }
   .__message {
      width: 80%;
      min-width: 500px;
      padding: 5px;
      color: $secondary-app-color-light;
      line-height: 1.8rem;
      overflow-wrap: break-word;
   }
}


</style>