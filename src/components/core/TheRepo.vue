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
         </ul>
      </div>

      <slot name="footer">
         <!-- default footer -->
         <button class="card-button" @click="openCommitsModal = true">
            Commits
         </button>
         <button class="card-button" @click="openContributorsModal = true">
            Contributors
         </button>
      </slot>

      <TheModal v-if="openCommitsModal" @close="openCommitsModal = false">
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
         </template>
      </TheModal>

      <TheModal
         v-if="openContributorsModal"
         @close="openContributorsModal = false"
      >
         <template #header>Contributors for: {{ repoName }}</template>

         <template #body>
            <ul>
               <li v-for="item in contributors" :key="item.id">
                  <UserCard
                     :userLogin="item.login"
                     :userAvatarUrl="item.avatar_url"
                  />
               </li>
            </ul>
         </template>
      </TheModal>
   </div>
</template>

<script>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import TheModal from "@/components/core/TheModal.vue";
import UserCard from "@/components/core/UserCard.vue";

@Component({
   components: {
      TheModal,
      UserCard,
   },
})
export default class TheRepo extends Vue {
   @Prop({ default: "auto" }) width;
   @Prop({ default: "auto" }) minWidth;
   @Prop({ default: "25px 10px" }) margin;
   @Prop({ default: null }) bgColor;
   @Prop({ default: null }) borderColor;
   @Prop({ default: "15px" }) borderRadius;
   @Prop({ default: null }) boxShadow;
   @Prop({ default: null }) bg;
   @Prop({ default: null }) userLogin;
   @Prop({ default: null }) repoName;
   @Prop({ default: "master" }) branch;

   openCommitsModal = false;
   openContributorsModal = false;
   commits = [];
   contributors = [];

   @Watch("openCommitsModal")
   async getCommits() {
      if (this.openCommitsModal) {
         try {
            const commits = await Vue.axios.get(
               `https://api.github.com/repos/${this.userLogin}/${this.repoName}/commits`
            );
            this.commits = commits.data;
            console.log(this.commits);
         } finally {
            console.log();
         }
      }
   }

   @Watch("openContributorsModal")
   async getContributors() {
      if (this.openContributorsModal) {
         try {
            const contributors = await Vue.axios.get(
               `https://api.github.com/repos/${this.userLogin}/${this.repoName}/contributors`
            );
            this.contributors = contributors.data;
            console.log(this.contributors);
         } finally {
            console.log();
         }
      }
   }
}
</script>

<style lang="scss">
//style

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
.__detail {
   border-left: 3px solid $third-app-color-dark;
   margin: 5px 0;
   padding-left: 10px;
}
.card-button {
   padding: 5px;
   background-color: $third-app-color-dark;
   transition: background-color 0.3s ease-out;
   margin: 5px;
   color: $main-app-color-dark;
   font-size: 0.8rem;
   font-weight: bold;
   letter-spacing: 0.05rem;
   border-radius: 10px;
   outline: none;
   border: none;
   &:hover {
      background-color: $third-app-color-light;
      cursor: pointer;
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