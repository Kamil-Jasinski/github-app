import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import VueLuxon from "vue-luxon";
import PortalVue from "portal-vue";
import VTooltip from 'v-tooltip';



//////////////////////////////////////////////////
/////              Components
//////////////////////////////////////////////////

import TheNav from "@/components/core/TheNav.vue";
import TheLoader from "@/components/core/TheLoader.vue";
import TheModal from "@/components/core/TheModal.vue";
import TheContainer from "@/components/core/TheContainer.vue";

Vue.component("TheLoader", TheLoader);
Vue.component("TheNav", TheNav);
Vue.component("TheModal", TheModal);
Vue.component("TheContainer", TheContainer);

//////////////////////////////////////////////////
/////              Vue Use
//////////////////////////////////////////////////

Vue.use(VueAxios, axios);
Vue.use(VueLuxon);
Vue.use(PortalVue);
Vue.use(VTooltip)

//////////////////////////////////////////////////
/////              FONT AWESOME
//////////////////////////////////////////////////
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faUser,
  faUserClock,
  faMapMarkerAlt,
  faFileWord,
  faAt,
  faArrowLeft,
  faHome,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faUser,
  faUserClock,
  faMapMarkerAlt,
  faFileWord,
  faTwitter,
  faAt,
  faArrowLeft,
  faHome,
  faCheckCircle,
  faTimesCircle
);
Vue.component("font-awesome-icon", FontAwesomeIcon);


//////////////////////////////////////////////////
/////              Vue Config
//////////////////////////////////////////////////
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
