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

  async getReposPerPage(userLogin:string, goToPage:number, perPage:number) {
    const reposPerPage = await Vue.axios.get(
      `https://api.github.com/users/${userLogin}/repos?page=${goToPage}&per_page=${perPage}`
   );
      return reposPerPage.data;
    
  }

  async getFollowers(userLogin:string, openFollowersModal:boolean, page:number ,perPage:number) {
    if (openFollowersModal) {
      const followers = await Vue.axios.get(
        `https://api.github.com/users/${userLogin}/followers?page=${page}&per_page=${perPage}`
      );
      return followers.data;
    }
  }

  async getFollowedUsers(userLogin:string, openFollowersModal:boolean, page:number ,perPage:number) {
    if (openFollowersModal) {
      const followedUsers = await Vue.axios.get(
        `https://api.github.com/users/${userLogin}/following?page=${page}&per_page=${perPage}`
      );
      return followedUsers.data;
    }
  }
})();

export interface reposPerPage {
        id: number,
        node_id: string,
        name: string,
        full_name: string,
        private: boolean,
        owner: {
            login: string,
            id: number,
            node_id: string,
            avatar_url: string,
            gravatar_id: string,
            url: string,
            html_url: string,
            followers_url: string,
            following_url: string,
            gists_url: string,
            starred_url: string,
            subscriptions_url: string,
            organizations_url: string,
            repos_url: string,
            events_url: string,
            received_events_url: string,
            type: string,
            site_admin: boolean
        },
        html_url: string,
        description: string,
        fork: boolean,
        url: string,
        forks_url: string,
        keys_url: string,
        collaborators_url: string,
        teams_url: string,
        hooks_url: string,
        issue_events_url: string,
        events_url: string,
        assignees_url: string,
        branches_url: string,
        tags_url: string,
        blobs_url: string,
        git_tags_url: string,
        git_refs_url: string,
        trees_url: string,
        statuses_url: string,
        languages_url: string,
        stargazers_url: string,
        contributors_url: string,
        subscribers_url: string,
        subscription_url: string,
        commits_url: string,
        git_commits_url: string,
        comments_url: string,
        issue_comment_url: string,
        contents_url: string,
        compare_url: string,
        merges_url: string,
        archive_url: string,
        downloads_url: string,
        issues_url: string,
        pulls_url: string,
        milestones_url: string,
        notifications_url: string,
        labels_url: string,
        releases_url: string,
        deployments_url: string,
        created_at: Date,
        updated_at: Date,
        pushed_at: Date,
        git_url: string,
        ssh_url: string,
        clone_url: string,
        svn_url: string,
        homepage: any,
        size: number,
        stargazers_count: number,
        watchers_count: number,
        language: string,
        has_issues: boolean,
        has_projects: boolean,
        has_downloads: boolean,
        has_wiki: boolean,
        has_pages: boolean,
        forks_count: number,
        mirror_url: any,
        archived: boolean,
        disabled: boolean,
        open_issues_count: number,
        license: any,
        forks: number,
        open_issues: number,
        watchers: number,
        default_branch: string
}
