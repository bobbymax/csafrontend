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
const Seatings = lazy(() => import("../views/inventory/seatings/Seatings"))
const Stocks = lazy(() => import("../views/inventory/stocks/Stocks"))
const CUStocks = lazy(() => import("../views/inventory/stocks/CUStocks"))
const StockItems = lazy(() => import("../views/inventory/items/StockItems"))
const CUStockItem = lazy(() => import("../views/inventory/items/CUStockItem"))
const StockDependencies = lazy(() => import("../views/inventory/dependencies/StockDependencies"))
const Supplies = lazy(() => import("../views/inventory/supplies/Supplies"))
const GenerateMRV = lazy(() => import("../views/inventory/supplies/GenerateMRV"))
const PrintMRV = lazy(() => import("../views/inventory/supplies/PrintMRV"))

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
const Assign = lazy(() => import("../views/operations/tasks/Assign"))

// Requests
const Imports = lazy(() => import("../views/administration/imports/Imports"))
const LogisiticsRequests = lazy(() => import("../views/operations/reservations/LogisticsRequests"))
const MakeBooking = lazy(() => import("../views/operations/reservations/MakeBooking"))
const Reservations = lazy(() => import("../views/logistics/Reservations"))
const Reservation = lazy(() => import("../views/operations/reservations/Reservation"))
const Flights = lazy(() => import("../views/operations/reservations/Flights"))
const Hotels = lazy(() => import("../views/operations/reservations/Hotels"))
const ManageBooking = lazy(() => import("../views/logistics/ManageBooking"))
const MeetingRooms = lazy(() => import('../views/operations/rooms/MeetingRooms'))
const ScheduleMeeting = lazy(() => import("../views/operations/rooms/ScheduleMeeting"))
const ViewMeetingSchedule = lazy(() => import("../views/operations/rooms/ViewMeetingSchedule"))
const HandleMeetingSchedule = lazy(() => import("../views/operations/schedules/HandleMeetingSchedule"))
const AddSchedule = lazy(() => import("../views/operations/schedules/AddSchedule"))
const Furnitures = lazy(() => import("../views/operations/furnitures/Furnitures"))


// Helpdesk
const IncidentCategories = lazy(() => import("../views/see-something/incidents/IncidentCategories"))
const Issues = lazy(() => import("../views/see-something/issues/Issues"))
const Tickets = lazy(() => import("../views/helpdesk/tickets/Tickets"))
const Incidents = lazy(() => import("../views/operations/incidents/Incidents"))

// Vehicle Request
const VehicleRequest = lazy(() => import("../views/fleetmgt/vehicle-request/VehicleRequest"))

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
            name: 'Stock Dependencies',
            element: <StockDependencies />,
            url: '/inventory/stock/dependencies'
        },
        {
            name: 'Hall Categories',
            element: <HallCategories />,
            url: '/inventory/hall/categories'
        },
        {
            name: 'Wings',
            element: <Wings />,
            url: '/inventory/wings'
        },
        {
            name: 'Supplies',
            element: <Supplies />,
            url: '/inventory/supplies'
        },
        {
            name: 'Generate MRV',
            element: <GenerateMRV />,
            url: '/inventory/generate/mrv'
        },
        {
            name: 'Print MRV',
            element: <PrintMRV />,
            url: '/inventory/mrv/print'
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
            name: 'Reservations',
            element: <Reservations />,
            url: '/logistics/reservations'
        },
        {
            name: 'Reservation',
            element: <Reservation />,
            url: '/requests/reservation/details'
        },
        {
            name: 'Flights Reservation',
            element: <Flights />,
            url: '/logistics/flight/reservations'
        },
        {
            name: 'Hotel Booking',
            element: <Hotels />,
            url: '/logistics/hotel/bookings'
        },
        {
            name: 'Manage Booking',
            element: <ManageBooking />,
            url: '/logistics/manage/reservations'
        },
        {
            name: 'Meeting Rooms',
            element: <MeetingRooms />,
            url: '/requests/meeting/rooms'
        },
        {
            name: 'Schedule Meeting',
            element: <ScheduleMeeting />,
            url: '/requests/schedule/meeting'
        },
        {
            name: 'Handle Schedule Request',
            element: <AddSchedule />,
            url: '/operations/schedule/meeting'
        },
        {
            name: 'View Meeting Schedule',
            element: <ViewMeetingSchedule />,
            url: '/view/meeting/schedule'
        },
        {
            name: 'Handle Meeting Schedule Request',
            element: <HandleMeetingSchedule />,
            url: '/operations/handle/schedule/request'
        },
        {
            name: 'Furniture Requests',
            element: <Furnitures />,
            url: '/requests/furnitures'
        },
        {
            name: 'Incident Reporting',
            element: <Incidents />,
            url: '/requests/incidents'
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
            url: '/requests/requisitions'
        },
        {
            name: 'Requisition Items',
            element: <RequisitionItems />,
            url: '/requests/make/requisition'
        },
        {
            name: 'Update Requisitions',
            element: <RequisitionItems />,
            url: '/requests/update/requisition'
        },
        {
            name: "Logistics Requests",
            element: <LogisiticsRequests />,
            url: "/requests/make/booking"
        },
        {
            name: "Make Logisitics Booking",
            element: <MakeBooking />,
            url: "/requests/reserve/booking"
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
            url: '/requests/view/requisition'
        },
        {
            name: 'Approve Requisitions',
            element: <ApproveRequisitions />,
            url: '/requests/approve/requisitions'
        },
        {
            name: 'Handle Requisition',
            element: <Requisition />,
            url: '/inventory/treat/requisition/:code'
        },
        {
            name: 'Tasks',
            element: <Tasks />,
            url: '/tasks/my/tasks'
        },
        {
            name: 'Assign Tasks',
            element: <Assign />,
            url: '/tasks/assign/task'
        },
        // Helpdesk
        {
            name: 'Incident Categories',
            element: <IncidentCategories />,
            url: '/helpdesk/incident-categories'
        },
        {
            name: 'Issues',
            element: <Issues />,
            url: '/helpdesk/issues'
        },
        {
            name: 'Tickets',
            element: <Tickets />,
            url: '/requests/tickets'
        },

        // Vehicle Request
        {
            name: 'Vehicle Request',
            element: <VehicleRequest />,
            url: '/fleets/vehicle-request'
        },

    ]
}