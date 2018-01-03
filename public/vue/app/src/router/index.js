import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Gallery from '@/components/Gallery'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    }, {
      path: '/gallery/:aid',
      name: 'Gallery',
      component: Gallery
    }
  ]
})
