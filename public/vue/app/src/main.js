// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import { Lazyload, InfiniteScroll, Header, Button } from 'mint-ui'

if (process.env.NODE_ENV === 'development') {
  require('mint-ui/lib/style.css')
}

Vue.component(Button.name, Button)
Vue.component(Header.name, Header)
Vue.use(Lazyload)
Vue.use(InfiniteScroll)

Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
