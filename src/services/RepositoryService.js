import Vue from "vue";

export default new (class RepositoryService {
  async getCommits(userLogin, repoName, openCommitsModal) {
    if (openCommitsModal) {
      const commits = await Vue.axios.get(
        `https://api.github.com/repos/${userLogin}/${repoName}/commits`
      );
      return commits.data;
    }
  }

  async getContributors(userLogin, repoName, openContributorsModal) {
    if (openContributorsModal) {
      const contributors = await Vue.axios.get(
        `https://api.github.com/repos/${userLogin}/${repoName}/contributors`
      );
      return contributors.data;
    }
  }
})();
