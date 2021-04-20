import Vue from "vue";
import store from "../store/index";

export default new (class ErrorService extends Vue {
  handleError() {
    this.$store.commit("SET_IS_LOADING", {
      showErrorModal: false,
    });
    this.$store.commit("SET_SHOW_ERROR_MODAL", {
      showErrorModal: false,
    });
    this.$store.commit("SET_CURRENT_USER_LOGIN", {
      login: "",
    });
    this.$router.push({ name: "Home" });
  }
})();
