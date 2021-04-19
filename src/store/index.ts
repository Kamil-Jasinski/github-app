import Vue from "vue";
import Vuex from "vuex";



Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiKey: process.env.VUE_APP_API_KEY,

    
    userLogin: '',
    searchSorting: '',
    searchOrder: '',
    currentPage: 1,
    currentPerPage: 5,
    userMaxReposPages: 0,
    errorMessage: '',
    showErrorModal: false,
    isLoading: false
 
  },
  mutations: {
  
   
    SET_CURRENT_USER_LOGIN(state, payload) {
      state.userLogin = payload.login;
    },
    SET_SEARCH_SORTING(state, payload) {
      state.searchSorting = payload.sorting;
    },
    SET_SEARCH_ORDER(state, payload) {
      state.searchOrder = payload.order;
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
    SET_IS_LOADING(state, payload) {
      state.isLoading = payload.isLoading;
    },
  },
  actions: {},
  modules: {},
  getters: {
   
   
    userLogin: (state) => {
      return state.userLogin;
    },
    searchSorting: (state) => {
      return state.searchSorting;
    },
    searchOrder: (state) => {
      return state.searchOrder;
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
    isLoading: (state) => {
      return state.isLoading;
    },
  },
});
