import Index from '../components/Index'
import Users from '../components/User/Users'
import User_e from '../components/User/User_e'
import Roles from '../components/Role/Roles'
import Role_e from '../components/Role/Role_e'
import Prisoners from '../components/Prisoner/Prisoners'
import Prisoner_e from '../components/Prisoner/Prisoner_e'
import Questions from '../components/Question/Questions'
import Answers from '../components/Answer/Answers'
import Answer_e from '../components/Answer/Answer_e'
import Depts from '../components/Answer/Depts'
import Dept_e from '../components/Answer/Dept_e'
import CallBacks from '../components/Reports/Callback/CallBacks'
import CallBack_e from '../components/Reports/Callback/CallBack_e'
import Login from '../components/Auth/Login'


const routers = [
    {
        path: '/',// 默认地址为登
        name: 'index',
        component: Index,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/index',
        name: 'index',
        component: Index,
        meta: {
            requiresAuth: true
        },
        children:[
            {
                path: 'users',
                component: Users,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'users/:id',
                component: User_e,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'roles',
                component: Roles,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'roles/:id',
                component: Role_e,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'prisoners',
                component: Prisoners,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'prisoners/:id',
                component: Prisoner_e,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'questions',
                component: Questions,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'answers',
                component: Answers,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'answers/:id',
                component: Answer_e,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'depts',
                component: Depts,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'depts/:id',
                component: Dept_e,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'reports/callbacks',
                component: CallBacks,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'reports/callbacks/:id',
                component: CallBack_e,
                meta: {
                    requiresAuth: true
                }
            },
        ]
    }
];
export default routers;