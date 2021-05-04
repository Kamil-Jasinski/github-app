<template>
   <div class="owner-card">
      <div class="avatar">
         <img
            v-if="userAvatarUrl"
            :src="userAvatarUrl"
            alt="User Avatar"
            @click="goToUserPage"
         />
         <img
            v-else
            src="@/assets/logo.png"
            alt="User Avatar"
            @click="goToUserPage"
         />
      </div>

      <div class="details">
         <h2 v-if="userName" class="name">
            {{ userName }}
         </h2>
         <h3 v-if="userLogin && userName" name="login" class="login">
            ({{ userLogin }})
         </h3>
         <h2 v-else-if="!userName" name="login" class="name">
            {{ userLogin }}
         </h2>
         <h2 v-else name="login" class="name">User</h2>
      </div>
   </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class UserCard extends Vue {
   @Prop({ default: null }) userAvatarUrl?:string | null;
   @Prop({ default: null }) userLogin!:string;
   @Prop({ default: null }) userName?:string | null;

   goToUserPage():void {
      // Go to USER PAGE
      this.$router.push({ name: "UserPage", params: { user: this.userLogin } });
   }
}
</script>


<style lang="scss" scoped>
.owner-card {
   display: flex;
   flex-direction: row;
   padding: 15px;
   margin: 20px auto;
   background-color: $main-app-color-light;
   width: 800px;

   .avatar {
      align-self: center;
      border-radius: 50%;
      overflow: hidden;
      min-width: 250px;
      min-height: 250px;
      max-width: 250px;
      max-height: 250px;
      margin: 50px 0;
      border: 2px solid $main-app-color-light;
      background-color: $main-app-color-dark;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      box-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.8);
      img {
         min-width: 100%;
         max-width: 100%;
         opacity: 0.8;
         &:hover {
            opacity: 1;
            transform: scale(1.05);
         }
      }
   }

   .details {
      display: flex;
      padding: 20px;
      width: 100%;
      max-width: 650px;
      justify-content: center;
      align-items: center;
      .name {
         font-size: 3rem;
         color: $third-app-color-light;
         overflow-wrap: break-word;
         word-wrap: break-word;
      }
      .login {
         font-size: 3rem;
         color: $third-app-color-light;
      }

      p {
         font-size: 1.5rem;
         padding: 10px;
      }
   }
}
</style>