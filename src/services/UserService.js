import Vue from 'vue';

export default new class UserService
{
    
   async getUser(userLogin) {          
      try {
         let user;

         if (userLogin) {
            user =  await Vue.axios.get(
               "https://api.github.com/users/" + userLogin
            );
         }
         
         return user;
      } catch (error) {
         console.warn(error.message);
      }
   }

}