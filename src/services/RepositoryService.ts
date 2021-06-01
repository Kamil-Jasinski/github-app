import Vue from "vue";

// interface commits {
//   userLogin:string,
//   repoName:string,
//   openCommitsModal:boolean
// }

export default new (class RepositoryService {
  async getCommits(userLogin:string, repoName:string, openCommitsModal:boolean, page:number ,perPage:number) {
    if (openCommitsModal) {
      const commits = await Vue.axios.get(
        `https://api.github.com/repos/${userLogin}/${repoName}/commits?page=${page}&per_page=${perPage}`
      );
      return commits.data;
    }
  }

  async getContributors(userLogin:string, repoName:string, openContributorsModal:boolean, page:number ,perPage:number) {
    if (openContributorsModal) {
      const contributors = await Vue.axios.get(
        `https://api.github.com/repos/${userLogin}/${repoName}/contributors?page=${page}&per_page=${perPage}`
      );
      return contributors.data;
    }
  }
})();
