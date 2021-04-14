<template>
  <div class="search-bar">
    <form>
      <input type="text" placeholder="User Name..." v-model="userName" />
      <button @click.prevent="getUser" type="submit">Search</button>
    </form>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

@Component({
  components: {},
})
export default class SearchBar extends Vue {
  userName = "";

  async getUser() {
    let userName;

    if (!this.userName) {
      console.log("User Name nie może być pusty");
      return false;
    }

    try {
      const repos = await axios.get(
        "https://api.github.com/users/" + this.userName + "/repos"
      );
      const userResponse = await axios.get(
        "https://api.github.com/users/" + this.userName
      );

      //Store user
      this.$store.commit("SET_USER", { user: userResponse.data });

      //Store user repos
      let userAvatarUrl = userResponse.data.avatar_url;
      this.$store.commit("SET_USER_AVATAR_URL", { URL: userAvatarUrl });

      //Store user avatar URL
      this.$store.commit("SET_USER_REPOS", { repos: repos.data });

      //Name to be send in params
      if (userResponse.data.name) {
        userName = userResponse.data.name;
      } else {
        userName = userResponse.data.login;
      }

      // Go to user page
      this.$router.push({ name: "UserRepos", params: { userName: userName } });

      // console.log(userResponse.data);
    } finally {
      //  console.log(this.$store.getters.userRepo);
    }
  }
}
</script>

<style lang="scss">
.search-bar {
  button[type="submit"],
  input {
    padding: 20px;
    border-radius: 15px;
    border-color: #fff;
    border: 1px solid #fff;
    outline: none;
    background-color: transparent;
    font-size: 2rem;
    color: #fff;
  }
  input {
    margin-right: 10px;
  }

  button[type="submit"] {
    &:hover {
      border-color: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
