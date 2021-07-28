import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router/router";
import VueApexCharts from "vue-apexcharts";
import store from "./store";
import Vuex from "vuex";

Vue.use(Vuex);

Vue.use(VueApexCharts);

Vue.component("apexchart", VueApexCharts);

Vue.config.productionTip = false;

new Vue({
  store,
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
