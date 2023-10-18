import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/index.css'
import axios from './axios'
import VueDOMPurifyHTML from 'vue-dompurify-html';

Vue.use(VueDOMPurifyHTML);

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
