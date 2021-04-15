import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiKey: process.env.VUE_APP_API_KEY,
    user: [],
    userName: '',
    userLogin: '',
    userRepos: [],
    userAvatarUrl: '',
    currentPage: 1,
    currentPerPage: 5,
    userMaxReposPages: 0,
    errorMessage: '',
    showErrorModal: false
 
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload.user;
    },
    SET_USER_NAME(state, payload) {
      state.userName = payload.name;
    },
    SET_USER_LOGIN(state, payload) {
      state.userLogin = payload.login;
    },
    SET_USER_REPOS(state, payload) {
      state.userRepos = payload.repos;
    },
    SET_USER_AVATAR_URL(state, payload) {
      state.userAvatarUrl = payload.URL;
    },
    SET_CURRENT_PAGE(state, payload) {
      state.currentPage = payload.currentPage;
    },
    SET_CURRENT_PER_PAGE(state, payload) {
      state.currentPerPage = payload.currentPerPage;
    },
    SET_USER_MAX_REPOS_PAGES(state, payload) {
      state.userMaxReposPages = payload.userMaxReposPages;
    },
    SET_ERROR_MESSAGE(state, payload) {
      state.errorMessage = payload.errorMessage;
    },
    SET_SHOW_ERROR_MODAL(state, payload) {
      state.showErrorModal = payload.showErrorModal;
    },
  },
  actions: {},
  modules: {},
  getters: {
    user: (state) => {
      return state.user;
    },
    userName: (state) => {
      return state.userName;
    },
    userLogin: (state) => {
      return state.userLogin;
    },
    userRepos: (state) => {
      return state.userRepos;
    },
    userAvatarUrl: (state) => {
      return state.userAvatarUrl;
    },
    currentPage: (state) => {
      return state.currentPage;
    },
    currentPerPage: (state) => {
      return state.currentPerPage;
    },
    userMaxReposPages: (state) => {
      return state.userMaxReposPages;
    },
    errorMessage: (state) => {
      return state.errorMessage;
    },
    showErrorModal: (state) => {
      return state.showErrorModal;
    },
  },
});
