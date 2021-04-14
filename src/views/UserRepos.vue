<template>
  <div class="userRepos">
    <section class="repos-owner">
      <div class="owner-card">
        <div class="avatar">
          <img :src="userAvatarUrl" alt="" />
        </div>
        <div class="details">
          <h2 class="name">{{ userName }}</h2>
          <hr class="separator" />
          <p name="public-repos-number">
            Public repositories
            <span class="bold">{{ user.public_repos }}</span>
          </p>
          <p name="followers-number">
            Followed by <span class="bold">{{ user.followers }}</span> github
            users.
          </p>
          <p name="following-number">
            Following <span class="bold">{{ user.following }}</span> github
            users.
          </p>
          <p name="email">{{ user.email }}</p>
        </div>
      </div>
    </section>

    <section class="user-repos-list">
      <the-container>
        <!-- repos tables goes here -->
        <h2>Repos:</h2>
      </the-container>
    </section>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import TheContainer from "@/components/core/TheContainer.vue";

@Component({
  components: {
    TheContainer,
  },
})
export default class Dashboard extends Vue {
  userName = this.$route.params.userName;

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
    // console.log(this.user);
  }

  beforeMount() {
    if (this.repos.length === 0) {
      this.$router.push({ name: "Home" });
      console.log("brak repo - cofnij do wyszukiwarki");
    }
  }
}
</script>

<style lang="scss" scoped>
$main-app-color-light: #2d3238;
$main-app-color-dark: #24292e;
$main-app-shadow: #1b1e22;

.userRepos {
  display: flex;
  min-height: 800px;
  width: 1400px;
  margin: auto auto;
}

.bold {
  font-weight: bold;
}
hr.separator {
  border-top: 1px solid #1c2024;
  border: 1px solid $main-app-color-dark;
  margin: 10px 0 40px 0;
}
.repos-owner {
  display: flex;
  justify-content: center;
  width: 50%;
  align-self: right;

  .owner-card {
    width: 75%;
    height: min-content;
    display: flex;
    flex-direction: column;
    background-color: $main-app-color-light;
    border-radius: 10px;
    border: 4px solid $main-app-color-dark;
    padding: 20px;
    -webkit-box-shadow: 0px 3px 30px -1px $main-app-shadow;
    box-shadow: 0px 3px 30px -1px $main-app-shadow;

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
        max-width: 100%;
      }
    }

    .details {
      display: flex;
      flex-direction: column;
      .name {
        align-self: center;
        font-size: 3rem;
        margin-top: 20px;
      }

      p {
        font-size: 1.5rem;
        padding: 10px;
      }
    }
  }
}

.user-repos-list {
  width: 50%;
  align-self: left;
}
</style>
