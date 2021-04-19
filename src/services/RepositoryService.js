import Vue from 'vue';

export default new class RepositoryService
{
    
   async getRepos(userLogin, sorting, order, perPage, goToPage) {          
      try {
         let repos;

         if (userLogin) {
            repos = await Vue.axios.get(
               `https://api.github.com/users/${userLogin}/repos?sort=${sorting}&direction=${order}&per_page=${perPage}&page=${goToPage}`
            );
         }
         
         return repos;
      } catch (error) {
         console.warn(error.message);
         
         
      }
   }

}