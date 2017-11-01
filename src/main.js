import Vue from 'vue'
import App from './App'
import VueRouter from "vue-router"
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView);
Vue.use(VueRouter)
import cookies from './utils/cookies'

Vue.config.productionTip = process.env.PROD_TIP

import routes from './utils/route'

const router = new VueRouter({
  // mode: 'history',
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (cookies.get('_token') !== undefined) {
      next();
    }
    else {
      // next();
      next({
        path: '/login',
      })
    }
  }
  else {
    next();
  }
})

new Vue({
  el: "#app",
  router: router,
  render: h => h(App)
})
