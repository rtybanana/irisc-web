import Vue from 'vue'
import app from './app.vue'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import vClickOutside  from 'v-click-outside';

import 'shepherd.js/dist/css/shepherd.css';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/css/all.css'

import './assets/prism-armv7';

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(vClickOutside);

Vue.config.productionTip = false

new Vue({
  render: h => h(app),
}).$mount('#app')
