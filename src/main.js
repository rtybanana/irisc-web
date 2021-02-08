import Vue from 'vue'
import app from './app.vue'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import '@fortawesome/fontawesome-free/css/fontawesome'
// import '@fortawesome/fontawesome-free/css/solid'
// import '@fortawesome/fontawesome-free/css/regular'
// import '@fortawesome/fontawesome-free/css/brands'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false

new Vue({
  render: h => h(app),
}).$mount('#app')
