import { lazy } from 'react'

const Login = lazy(() => import("../pages/Login"))
const Home = lazy(() => import("../pages/Home"))
const Applications = lazy(() => import("../views/administration/applications/Applications"))
const Modules = lazy(() => import("../views/administration/modules/Modules"))
const Groups = lazy(() => import("../views/administration/groups/Groups"))
const Locations = lazy(() => import('../views/administration/locations/Locations'))
const Floors = lazy(() => import('../views/administration/floors/Floors'))
const StaffTypes = lazy(() => import('../views/administration/staff/StaffTypes'))
const DepartmentTypes = lazy(() => import('../views/administration/ddds/DepartmentTypes'))

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
        {
            name: 'Locations',
            element: <Locations />,
            url: '/administration/locations'
        },
        {
            name: 'Floors',
            element: <Floors />,
            url: '/administration/floors'
        },
        {
            name: 'Staff Types',
            element: <StaffTypes />,
            url: '/administration/staff-types'
        },
        {
            name: 'DDD Types',
            element: <DepartmentTypes />,
            url: '/administration/department-types'
        },
    ]
}