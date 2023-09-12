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
const Seatings = lazy(() => import("../views/inventory/seatings/Seatings"))
const Brands = lazy(() => import("../views/inventory/brands/Brands"))
const Stocks = lazy(() => import("../views/inventory/stocks/Stocks"))
const CUStocks = lazy(() => import("../views/inventory/stocks/CUStocks"))
const StockItems = lazy(() => import("../views/inventory/items/StockItems"))
const CUStockItem = lazy(() => import("../views/inventory/items/CUStockItem"))

const Rooms = lazy(() => import("../views/inventory/rooms/Rooms"))
const HallCategories = lazy(() => import("../views/inventory/halls/HallCategories"))
const Wings = lazy(() => import("../views/inventory/wings/Wings"))

const MakeRequisition = lazy(() => import("../views/operations/requisitions/MakeRequisition"))
const RequisitionItems = lazy(() => import("../views/operations/requisitions/RequisitionItems"))
const Requisitions = lazy(() => import("../views/inventory/requisitions/Requisitions"))
const AssignRequisition = lazy(() => import("../views/inventory/requisitions/AssignRequisition"))
const ApproveRequisitions = lazy(() => import("../views/operations/requisitions/ApproveRequisitions"))
const ViewRequisition = lazy(() => import("../views/operations/requisitions/ViewRequisition"))
const Tasks = lazy(() => import("../views/operations/tasks/Tasks"))
const TreatRequisitions = lazy(() => import("../views/inventory/requisitions/TreatRequisitions"))
const Requisition = lazy(() => import("../views/inventory/requisitions/Requisition"))

// Requests
const Reservations = lazy(() => import("../views/operations/reservations/Reservations"))
const Imports = lazy(() => import("../views/administration/imports/Imports"))

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
            name: 'Imports',
            element: <Imports />,
            url: '/administration/imports'
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
            name: 'Hall Categories',
            element: <HallCategories />,
            url: '/inventory/hall/categories'
        },
        {
            name: 'Stock Types',
            element: <Tags />,
            url: '/inventory/tags'
        },
        {
            name: 'Wings',
            element: <Wings />,
            url: '/inventory/wings'
        },
        {
            name: 'Rooms',
            element: <Rooms />,
            url: '/inventory/rooms'
        },
        {
            name: 'Seating Arrangements',
            element: <Seatings />,
            url: '/inventory/seatings'
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
        {
            name: 'Make Requisition',
            element: <MakeRequisition />,
            url: '/operations/requisitions'
        },
        {
            name: 'Reservations',
            element: <Reservations />,
            url: '/operations/reservations'
        },
        {
            name: 'Requisition Items',
            element: <RequisitionItems />,
            url: '/operations/make/requisition'
        },
        {
            name: 'Update Requisitions',
            element: <RequisitionItems />,
            url: '/operations/update/requisition'
        },
        {
            name: 'Requisitions',
            element: <Requisitions />,
            url: '/inventory/requisitions'
        },
        {
            name: 'Assign Requisitions',
            element: <AssignRequisition />,
            url: '/inventory/assign/requisition'
        },
        {
            name: 'Treat Requisitions',
            element: <TreatRequisitions />,
            url: '/inventory/treat/requisitions'
        },
        {
            name: 'View Requisition',
            element: <ViewRequisition />,
            url: '/operations/view/requisition'
        },
        {
            name: 'Approve Requisitions',
            element: <ApproveRequisitions />,
            url: '/operations/approve/requisitions'
        },
        {
            name: 'Handle Requisition',
            element: <Requisition />,
            url: '/inventory/treat/requisition/:code'
        },
        {
            name: 'Tasks',
            element: <Tasks />,
            url: '/operations/tasks'
        },
    ]
}