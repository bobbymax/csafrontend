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
const Departments = lazy(() => import("../views/administration/departments/Departments"))
const GradeLevels = lazy(() => import("../views/administration/grade-levels/GradeLevels"))
const Availabilities = lazy(() => import("../views/administration/availabilities/Availabilities"))
const Vendors = lazy(() => import("../views/administration/vendors/Vendors"))

const Employees = lazy(() => import("../views/administration/employees/Employees"))
const ManageEmployee = lazy(() => import("../views/administration/employees/ManageEmployee"))

// Inventory
const InventoryCategories = lazy(() => import("../views/inventory/inventory-categories/InventoryCategories"))
const StockCategories = lazy(() => import("../views/inventory/stock-categories/StockCategories"))
const StockTypes = lazy(() => import("../views/inventory/stock-types/StockTypes"))
const Tags = lazy(() => import("../views/inventory/tags/Tags"))
const Brands = lazy(() => import("../views/inventory/brands/Brands"))
const Stocks = lazy(() => import("../views/inventory/stocks/Stocks"))
const CUStocks = lazy(() => import("../views/inventory/stocks/CUStocks"))
const StockItems = lazy(() => import("../views/inventory/items/StockItems"))
const CUStockItem = lazy(() => import("../views/inventory/items/CUStockItem"))

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
            name: 'Departments',
            element: <Departments />,
            url: '/administration/departments'
        },
        {
            name: 'DDD Types',
            element: <DepartmentTypes />,
            url: '/administration/department-types'
        },
        {
            name: 'Grade Levels',
            element: <GradeLevels />,
            url: '/administration/grade-levels'
        },
        {
            name: 'Availabilities',
            element: <Availabilities />,
            url: '/administration/availabilities'
        },
        {
            name: 'Vendors',
            element: <Vendors />,
            url: '/administration/vendors'
        },
        {
            name: 'Staff',
            element: <Employees />,
            url: '/administration/staff'
        },
        {
            name: 'Manage Staff',
            element: <ManageEmployee />,
            url: '/administration/manage/staff'
        },
        {
            name: 'Inventory Categories',
            element: <InventoryCategories />,
            url: '/inventory/parent/categories'
        },
        {
            name: 'Stock Categories',
            element: <StockCategories />,
            url: '/inventory/stock/categories'
        },
        {
            name: 'Stock Types',
            element: <StockTypes />,
            url: '/inventory/stock/types'
        },
        {
            name: 'Stock Types',
            element: <Tags />,
            url: '/inventory/tags'
        },
        {
            name: 'Brands',
            element: <Brands />,
            url: '/inventory/brands'
        },
        {
            name: 'Stocks',
            element: <Stocks />,
            url: '/inventory/stock'
        },
        {
            name: 'Create Stock',
            element: <CUStocks />,
            url: '/inventory/stock/add'
        },
        {
            name: 'Update Stock',
            element: <CUStocks />,
            url: '/inventory/stock/update'
        },
        {
            name: 'Stock Items',
            element: <StockItems />,
            url: '/inventory/stock/items'
        },
        {
            name: 'Add Stock Item',
            element: <CUStockItem />,
            url: '/inventory/stock/items/add'
        },
        {
            name: 'Update Stock Item',
            element: <CUStockItem />,
            url: '/inventory/stock/items/update'
        },
    ]
}