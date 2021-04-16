import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from 'axios';
import VueAxios from 'vue-axios'
import VueLuxon from "vue-luxon";

Vue.use(VueAxios, axios)
Vue.use(VueLuxon);


Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
