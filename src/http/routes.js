import {lazy} from 'react'

const Login = lazy(() => import("../pages/Login"))
const Home = lazy(() => import("../pages/Home"))
const Applications = lazy(() => import("../views/administration/applications/Applications"))
const Modules = lazy(() => import("../views/administration/modules/Modules"))
const Groups = lazy(() => import("../views/administration/groups/Groups"))

export const routes = {
    guest: [
        {
            name: 'Auth Login',
            element: <Login />,
            url: '/auth/login'
        }
    ],
    protected: [
        {
            name: 'Dashboard',
            element: <Home />,
            url: '/'
        },
        {
            name: 'Applications',
            element: <Applications />,
            url: '/administration/applications'
        },
        {
            name: 'Modules',
            element: <Modules />,
            url: '/administration/modules'
        },
        {
            name: 'Groups',
            element: <Groups />,
            url: '/administration/groups'
        },
    ]
}