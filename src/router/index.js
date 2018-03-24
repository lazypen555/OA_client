import Index from '../components/Index'
import IndexContent from '../components/Index/Index'
import Users from '../components/User/Users'
import User_e from '../components/User/User_e'
import Roles from '../components/Role/Roles'
import Role_e from '../components/Role/Role_e'
import Prisoners from '../components/Prisoner/Prisoners'
import Prisoner_e from '../components/Prisoner/Prisoner_e'
import Questions from '../components/Question/Questions'
import Answers from '../components/Answer/Answers'
import Answer_e from '../components/Answer/Answer_e'
import Units from '../components/Unit/Units'
import Unit_e from '../components/Unit/Unit_e'
import CallBacks from '../components/Reports/Callback/CallBacks'
import CallBack_e from '../components/Reports/Callback/CallBack_e'
import Login from '../components/Auth/Login'


const routers = [
    {
        path: '/',// 默认地址为登
        name: 'index',
        component: Index,
        meta:{
            title:'首页',
            requiresAuth: true,
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta:{
            title:'登录'
        }
    },
    {
        path: '/index',
        name: 'index',
        component: Index,
        meta: {
            requiresAuth: true,
            title:'首页'
        },
        children:[
            {
                path: 'content',
                component: IndexContent,
                meta: {
                    requiresAuth: true,
                    title:'首页'
                }
            },
            {
                path: 'users',
                component: Users,
                meta: {
                    requiresAuth: true,
                    title:'操作员'
                }
            },
            {
                path: 'users/:id',
                component: User_e,
                meta: {
                    requiresAuth: true,
                    title:'操作员编辑'
                }
            },
            {
                path: 'roles',
                component: Roles,
                meta: {
                    requiresAuth: true,
                    title:'角色'
                }
            },
            {
                path: 'roles/:id',
                component: Role_e,
                meta: {
                    requiresAuth: true,
                    title:'角色编辑'
                }
            },
            {
                path: 'prisoners',
                component: Prisoners,
                meta: {
                    requiresAuth: true,
                    title:'戒员'
                }
            },
            {
                path: 'prisoners/:id',
                component: Prisoner_e,
                meta: {
                    requiresAuth: true,
                    title:'戒员编辑'
                }
            },
            {
                path: 'questions',
                component: Questions,
                meta: {
                    requiresAuth: true,
                    title:'回访问题'
                }
            },
            {
                path: 'answers',
                component: Answers,
                meta: {
                    requiresAuth: true,
                    title:'回访'

                }
            },
            {
                path: 'answers/:id',
                component: Answer_e,
                meta: {
                    requiresAuth: true,
                    title:'回访答题'
                }
            },
            {
                path: 'units',
                component: Units,
                meta: {
                    requiresAuth: true,
                    title:'组织管理'
                }
            },
            {
                path: 'units/:id',
                component: Unit_e,
                meta: {
                    requiresAuth: true,
                    title:'组织管理编辑'
                }
            },
            {
                path: 'reports/callbacks',
                component: CallBacks,
                meta: {
                    requiresAuth: true,
                    title:'回访记录'
                }
            },
            {
                path: 'reports/callbacks/:id',
                component: CallBack_e,
                meta: {
                    requiresAuth: true,
                    title:'回访记录明细'
                }
            },
        ]
    }
];
export default routers;