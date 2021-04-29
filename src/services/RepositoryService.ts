import Vue from "vue";

export default new (class RepositoryService {
  async getCommits(userLogin:string, repoName:string, openCommitsModal:boolean) {
    if (openCommitsModal) {
      const commits = await Vue.axios.get(
        `https://api.github.com/repos/${userLogin}/${repoName}/commits`
      );
      return commits.data;
    }
  }

  async getContributors(userLogin:string, repoName:string, openContributorsModal:boolean) {
    if (openContributorsModal) {
      const contributors = await Vue.axios.get(
        `https://api.github.com/repos/${userLogin}/${repoName}/contributors`
      );
      return contributors.data;
    }
  }
})();
