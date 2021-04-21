<template>
   <div class="wrapper">
      <!-- NAV -->
      <TheNav
         :routeName="'UserRepos'"
         :user="userLogin"
         :navText="'repositories'"
         :paramUserLogin="userLogin"
      />

      <!-- USER CARD -->
      <section v-if="!isLoading" class="repos-owner">
         <TheContainer
            width="95%"
            :bgColor="'#2C445C'"
            :bg="'linear-gradient(20deg, #2C445C 60%, #8396A8 100%)'"
         >
            <div class="owner-card">
               <div class="card-header">
                  <div class="avatar" ref="avatar">
                     <img v-if="userAvatarUrl" :src="userAvatarUrl" alt="" />
                     <img v-else src="@/assets/logo.png" alt="" />
                  </div>

                  <div class="git-info">
                     <p name="public-repos-number" class="git-info-el">
                        Public repositories
                        <span class="bold">{{ user.public_repos }}</span>
                     </p>
                     <p name="followers-number" class="git-info-el">
                        Followed by
                        <span class="bold">{{ user.followers }}</span> github
                        users
                     </p>
                     <p name="following-number" class="git-info-el">
                        Following
                        <span class="bold">{{ user.following }}</span> github
                        users
                     </p>
                     <p
                        v-if="user.hireable"
                        name="looking-for-work"
                        class="git-info-el"
                     >
                        <span class="bold"
                           >{{ userName ? userName : userLogin }}
                        </span>
                        {{ user.hireable ? "is looking for work" : null }}
                     </p>
                  </div>
               </div>

               <div class="details">
                  <h2
                     v-if="userName"
                     ref="userName"
                     class="align-self-center name"
                  >
                     <TheTitle
                        v-if="userName"
                        :color="'#6CA7E1'"
                        :margin="'0'"
                        :padding="'20px 0'"
                        >{{ userName }}</TheTitle
                     >
                  </h2>
                  <h3
                     v-if="userLogin && userName"
                     name="login"
                     ref="userLogin"
                     class="align-self-center login"
                  >
                     ({{ userLogin }})
                  </h3>
                  <h2
                     v-else-if="!userName"
                     name="login"
                     class="align-self-center name"
                     ref="userLoginAsName"
                  >
                     <TheTitle
                        v-if="userLogin"
                        :color="'#6CA7E1'"
                        :margin="'0'"
                        :padding="'20px 0'"
                        >{{ userLogin }}</TheTitle
                     >
                  </h2>
                  <h2 v-else name="login" class="align-self-center name">
                     User
                  </h2>

                  <hr class="separator" />
                  <div class="additionalInfo" ref="additionalInfo">
                     <!-- BIO -->
                     <div
                        v-if="user.bio"
                        class="text-line-wrapper additional-info-el"
                        name="bio"
                     >
                        <font-awesome-icon class="user-card-icon" icon="user" />
                        <p><span class="bold">Bio:</span> {{ user.bio }}</p>
                     </div>

                     <!-- LOCATION -->
                     <div
                        v-if="user.location"
                        class="text-line-wrapper additional-info-el"
                        name="location"
                     >
                        <font-awesome-icon
                           class="user-card-icon"
                           icon="map-marker-alt"
                        />
                        <p>
                           <span class="bold">From:</span> {{ user.location }}
                        </p>
                     </div>

                     <!-- BLOG -->
                     <div
                        v-if="user.blog"
                        class="text-line-wrapper additional-info-el"
                        name="blog"
                     >
                        <font-awesome-icon
                           class="user-card-icon"
                           icon="file-word"
                        />
                        <p>
                           <span class="bold">Blog:</span>
                           {{ user.blog }}
                        </p>
                     </div>

                     <!-- TWITTER -->
                     <div
                        v-if="user.twitter_username"
                        class="text-line-wrapper additional-info-el"
                        name="twitter_username"
                     >
                        <font-awesome-icon
                           class="user-card-icon"
                           :icon="['fab', 'twitter']"
                        />
                        <p>
                           <span class="bold">Twitter:</span>
                           {{ user.twitter_username }}
                        </p>
                     </div>

                     <!-- CREATED AT -->
                     <div
                        v-if="user.created_at"
                        class="text-line-wrapper additional-info-el"
                        name="created"
                     >
                        <font-awesome-icon
                           class="user-card-icon"
                           icon="user-clock"
                        />
                        <p>
                           <span class="bold">Joined:</span>
                           {{ $luxon(user.created_at) }}
                        </p>
                     </div>

                     <!-- EMAIL -->
                     <div
                        v-if="user.email"
                        class="text-line-wrapper additional-info-el"
                        name="email"
                     >
                        <font-awesome-icon class="user-card-icon" icon="at" />
                        <p>
                           {{ user.email }}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </TheContainer>
      </section>

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
import { Component, Vue } from "vue-property-decorator";
import TheContainer from "@/components/core/TheContainer.vue";
import TheTitle from "@/components/core/TheTitle.vue";
import TheModal from "@/components/core/TheModal.vue";
import TheRepo from "@/components/core/TheRepo.vue";
import UserService from "@/services/UserService.js";
import gsap from "gsap";
import CSSPlugin from "gsap/CSSPlugin";

@Component({
   components: {
      TheContainer,
      TheTitle,
      TheModal,
      TheRepo,
   },
})
export default class UserPage extends Vue {
   userAvatarUrl = "";
   userName = "";
   user = [];

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

   get userLogin() {
      return this.$route.params.user;
   }

   async getUser() {
      this.setLoader(true);
      try {
         let user;
         user = await UserService.getUser(this.userLogin);
         this.user = user.data;
         this.userName = this.user.name;
         this.userAvatarUrl = this.user.avatar_url;
         this.setLoader(false);
      } catch (error) {
         this.setLoader(false);
         console.warn(error.message);
         this.$store.commit("SET_ERROR_MESSAGE", {
            errorMessage: error.message,
         });
         this.$store.commit("SET_SHOW_ERROR_MODAL", {
            showErrorModal: true,
         });
      }
   }

   setLoader(mode) {
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

   beforeMount() {
      this.getUser();
   }

   // ANIMATIONS

   animateUserPage() {
      const img = this.$refs.avatar;
      const userName = this.$refs.userName;
      const userLoginAsName = this.$refs.userLoginAsName;
      const userLogin = this.$refs.userLogin;
      const gitInfoElements = document.querySelectorAll(".git-info-el");
      const additionalInfoElements = document.querySelectorAll(
         ".additional-info-el"
      );

      gsap.registerPlugin(CSSPlugin);
      const userPageTimeline = gsap.timeline();
      userPageTimeline
         .fromTo(img, { x: -150 }, { x: 0, duration: 0.4 })
         .fromTo(
            gitInfoElements,
            { autoAlpha: 0 },
            { autoAlpha: 1, stagger: 0.1 }
         )
         .fromTo(
            userName ? userName : userLoginAsName,
            { autoAlpha: 0, scale: 0.4 },
            { autoAlpha: 1, duration: 0.3, scale: 1 }
         )
         .fromTo(userLogin, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
         .fromTo(
            additionalInfoElements,
            { autoAlpha: 0, x: -150 },
            { autoAlpha: 1, x: 0, stagger: 0.15 }
         );
   }

   updated() {
      this.animateUserPage();
   }
}
</script>

<style lang="scss" scoped>
.wrapper {
   min-height: 800px;
   width: 1400px;
   margin: auto auto;
}

.repos-owner {
   display: flex;
   justify-content: center;
   width: 100%;

   .owner-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .card-header {
         display: flex;
         flex-direction: row;
         justify-content: center;
         align-items: center;
         .git-info {
            font-size: 1.5rem;
            line-height: 3rem;
            letter-spacing: 0.1rem;
            border-left: 2px solid $main-app-color-light;
            padding-left: 50px;
            p,
            p > * {
               color: $main-app-color-dark;
            }
         }
      }

      .avatar {
         align-self: center;
         border-radius: 50%;
         overflow: hidden;
         width: 250px;
         height: 250px;
         margin: 50px 50px;
         border: 2px solid $main-app-color-dark;
         background-color: $main-app-color-dark;
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

         .text-line-wrapper {
            display: flex;
            flex-direction: row;
            // align-items: center;
            padding: 10px;

            p {
               font-size: 1.5rem;
               align-self: flex-start;
            }
            .user-card-icon {
               margin-right: 10px;
               min-width: 50px;
               font-size: 1.8rem;
            }
            svg > path {
               color: $secondary-app-color-light;
            }
         }
      }
   }
}
</style>
