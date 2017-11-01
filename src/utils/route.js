import Login from '../pages/login'

import Index from '../pages/index/index'
import User from '../pages/index/user'

import Conf from '../pages/conf/index'
import ConfTag from '../pages/conf/tag'
import ConfList from '../pages/conf/config'

import Cron from '../pages/cron/index'
import CronTag from '../pages/cron/tag'
import CronNode from '../pages/cron/node'
import CronList from '../pages/cron/crontab'

const routes = [
    {
        path: '/login', component: Login
    },
    {path: '/', redirect: '/user'},
    {path: '/conf', redirect: '/conf/tag'},
    {path: '/cron', redirect: '/cron/tag'},
    {
        path: '/', component: Index, meta: {requireAuth: true},
        children: [
            {path: 'user', component: User, meta: {requireAuth: true}},
        ]
    },
    {
        path: '/conf', component: Conf, meta: {requireAuth: true},
        children: [
            {path: 'tag', component: ConfTag, meta: {requireAuth: true}},
            {path: 'config', component: ConfList, meta: {requireAuth: true}},
            {path: 'key', component: ConfList, meta: {requireAuth: true}}

        ]
    },
    {
        path: '/cron', component: Cron, meta: {requireAuth: true},
        children: [
          {path: 'tag', component: CronTag, meta: {requireAuth: true}},
          {path: 'node', component: CronNode, meta: {requireAuth: true}},
            {path: 'crontab', component: CronList, meta: {requireAuth: true}}
        ]
    },
    {
        path: '*', redirect: {path: '/'}
    }
]

export default routes

