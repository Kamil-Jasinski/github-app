import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiKey: process.env.VUE_APP_API_KEY,
    user: [],
    userRepos: [],
    userAvatarUrl: ''
 
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload.user;
    },
    SET_USER_REPOS(state, payload) {
      state.userRepos = payload.repos;
    },
    SET_USER_AVATAR_URL(state, payload) {
      state.userAvatarUrl = payload.URL;
    },
  },
  actions: {},
  modules: {},
  getters: {
    user: (state) => {
      return state.user;
    },
    userRepos: (state) => {
      return state.userRepos;
    },
    userAvatarUrl: (state) => {
      return state.userAvatarUrl;
    }
  },
});
