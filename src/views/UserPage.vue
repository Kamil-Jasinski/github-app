<template>
   <div class="wrapper">
      <nav v-if="!isLoading" class="main-nav">
         <button
            v-if="hasHistory()"
            class="nav-button"
            type="button"
            @click="$router.go(-1)"
         >
            <font-awesome-icon class="nav-icon" icon="arrow-left" />
            <span class="__nav-icon-text">Go Back</span>
         </button>

         <button
            v-if="!hasHistory()"
            type="button"
            class="nav-button"
            @click="$router.push('/')"
         >
            <font-awesome-icon class="nav-icon" icon="home" />
            <span class="__nav-icon-text">Go Home</span>
         </button>
      </nav>

      <!-- USER CARD -->
      <section v-if="!isLoading" class="repos-owner">
         <TheContainer
            width="95%"
            :bgColor="'#2C445C'"
            :bg="'linear-gradient(20deg, #2C445C 60%, #8396A8 100%)'"
         >
            <div class="owner-card">
               <div class="card-header">
                  <div class="avatar">
                     <img v-if="userAvatarUrl" :src="userAvatarUrl" alt="" />
                     <img v-else src="@/assets/logo.png" alt="" />
                  </div>

                  <div class="git-info">
                     <p name="public-repos-number">
                        Public repositories
                        <span class="bold">{{ user.public_repos }}</span>
                     </p>
                     <p name="followers-number">
                        Followed by
                        <span class="bold">{{ user.followers }}</span> github
                        users
                     </p>
                     <p name="following-number">
                        Following
                        <span class="bold">{{ user.following }}</span> github
                        users
                     </p>
                     <p v-if="user.hireable" name="looking-for-work">
                        <span class="bold"
                           >{{ userName ? userName : userLogin }}
                        </span>
                        {{ user.hireable ? "is looking for work" : null }}
                     </p>
                  </div>
               </div>

               <div class="details">
                  <h2 v-if="userName" class="align-self-center name">
                     <TheTitle
                        :color="'#6CA7E1'"
                        :margin="'0'"
                        :padding="'20px 0'"
                        >{{ userName }}</TheTitle
                     >
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

                  <!-- BIO -->
                  <p v-if="user.bio" name="bio">
                     <font-awesome-icon class="user-card-icon" icon="user" />
                     <span class="bold">Bio:</span> {{ user.bio }}
                  </p>

                  <!-- LOCATION -->
                  <p v-if="user.location" name="location">
                     <font-awesome-icon
                        class="user-card-icon"
                        icon="map-marker-alt"
                     />
                     <span class="bold">From:</span> {{ user.location }}
                  </p>

                  <!-- BLOG -->
                  <p v-if="user.blog" name="blog">
                     <font-awesome-icon
                        class="user-card-icon"
                        icon="file-word"
                     />
                     <span class="bold">Blog:</span>
                     {{ user.blog }}
                  </p>

                  <!-- TWITTER -->
                  <p v-if="user.twitter_username" name="twitter_username">
                     <font-awesome-icon
                        class="user-card-icon"
                        :icon="['fab', 'twitter']"
                     />
                     <span class="bold">Twitter:</span>
                     {{ user.twitter_username }}
                  </p>

                  <!-- CREATED AT -->
                  <p v-if="user.created_at" name="created">
                     <font-awesome-icon
                        class="user-card-icon"
                        icon="user-clock"
                     />
                     <span class="bold">Joined:</span>
                     {{ $luxon(user.created_at) }}
                  </p>

                  <!-- EMAIL -->
                  <p v-if="user.email" name="email">
                     <font-awesome-icon class="user-card-icon" icon="at" />
                     {{ user.email }}
                  </p>
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

@Component({
   components: {
      TheContainer,
      TheTitle,
      TheModal,
      TheRepo,
   },
})
export default class UserPage extends Vue {
   userName = "";
   userAvatarUrl = "";
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

   hasHistory() {
      return window.history.length > 2;
   }

   get isLoading() {
      return this.$store.getters.isLoading;
   }

   get userLogin() {
      return this.$route.params.user;
   }

   async getUser() {
      let user;
      this.$store.commit("SET_IS_LOADING", {
         isLoading: true,
      });

      //  GET USER
      try {
         const userResponse = await Vue.axios.get(
            "https://api.github.com/users/" + this.userLogin
         );

         user = userResponse.data;
         this.userName = user.name;
         this.userAvatarUrl = user.avatar_url;
         this.user = user;

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
      this.getUser();
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

         p {
            font-size: 1.5rem;
            padding: 10px;
            .user-card-icon {
               margin-right: 10px;
               width: 50px;
               font-size: 1.3em;
            }
            svg > path {
               color: $secondary-app-color-light;
            }
         }
      }
   }
}

.main-nav {
   display: flex;
   justify-content: flex-start;
   align-items: center;

   .nav-button {
      display: flex;
      align-items: center;
      background-color: transparent;
      outline: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      &:hover {
         .nav-icon > path {
            color: $third-app-color-light !important;
         }
         .__nav-icon-text {
            transform: translateX(10px);
         }
      }
      .nav-icon {
         transition: color 0.2s ease-in;
      }
      .__nav-icon-text {
         margin-left: 10px;
         font-size: 1rem;
         text-transform: uppercase;
         letter-spacing: 2px;
         transition: transform 0.1s ease-in-out;
      }
   }
}
</style>
