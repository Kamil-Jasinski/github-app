import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userLogin: "",
    searchSorting: "",
    searchOrder: "",
    currentPage: 1,
    currentPerPage: 5,
    userMaxReposPages: 0,
    errorMessage: "",
    showErrorModal: false,
    isLoading: false,
    isInit: true,
    OPL: true, // Open loader ?
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
    SET_IS_INIT(state, payload) {
      state.isInit = payload.isInit;
    },
    SET_OPL(state, payload) {
      state.OPL = payload.OPL;
    },
  },
  actions: {},
  modules: {},
  getters: {
    userLogin: (state):string => {
      return state.userLogin;
    },
    searchSorting: (state):string => {
      return state.searchSorting;
    },
    searchOrder: (state):string => {
      return state.searchOrder;
    },
    currentPage: (state):number => {
      return state.currentPage;
    },
    currentPerPage: (state):number => {
      return state.currentPerPage;
    },
    userMaxReposPages: (state):number => {
      return state.userMaxReposPages;
    },
    errorMessage: (state):string => {
      return state.errorMessage;
    },
    showErrorModal: (state):boolean => {
      return state.showErrorModal;
    },
    isLoading: (state):boolean => {
      return state.isLoading;
    },
    isInit: (state):boolean => {
      return state.isInit;
    },
    OPL: (state):boolean => {
      return state.OPL;
    },
  },
});
