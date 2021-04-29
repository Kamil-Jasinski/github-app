import Vue from "vue";

export default new (class UserService {
  async getUser(userLogin:string) {
    let user;

    if (userLogin) {
      user = await Vue.axios.get("https://api.github.com/users/" + userLogin);
    }

    return user;
  }

  async getUserRepos(userLogin:string, sorting:string, order:string, perPage:number, goToPage:number) {
    let repos;

    if (userLogin) {
      repos = await Vue.axios.get(
        `https://api.github.com/users/${userLogin}/repos?sort=${sorting}&direction=${order}&per_page=${perPage}&page=${goToPage}`
      );
    }

    return repos;
  }
})();
