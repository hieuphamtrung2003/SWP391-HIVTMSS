import LandingPage from "../components/pages/Landingpage";
import Login from "../components/pages/LoginPage/LoginPage.jsx";
import RegisterForm from "components/pages/RegisterPage/RegisterPage";
import Schedule from "components/pages/SchedulePage/Schedule";
import DefaultLayout from "../components/layouts/DefaultLayout/DefaultLayout.jsx";
import ProfileSettings from "components/pages/ProfilePage/ProfilePage";
import NotificationsPage from "components/pages/NotificationPage/NotificationPage";
import BlogManagementPage from "components/pages/BlogPage/BlogManagementPage";
import BlogEditorPage from "components/pages/BlogEditor/Blogeditor";
import ChatPage from "components/pages/ChatPage/ChatPage";
import DoctorBookingPage from "components/pages/BookingPage";
import AdminDashboard from "components/pages/DashBoard/DashBoard";
import PatientRequestsManager from "components/pages/PatientRequest/PatientRequest";
import ForgotPasswordForm from "components/pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordForm from "components/pages/ForgotPasswordPage/ResetPasswordPage";
import BlogDetail from "components/pages/BlogDetail/BlogDetail";
import DashboardContent from "components/pages/DashBoard/DashBoard";
import AdminLayout from "components/layouts/AdminLayout/AdminLayout";
import DoctorLayout from "components/layouts/DoctorLayout/DoctorLayout";
import AccountManagement from "components/pages/AccountManagement/AccountManagement";
import DoctorDegreeForm from "components/pages/DoctorDegreeForm/DoctorDegreeForm";
import NotFound from "components/pages/NotFoundPage";
import DoctorDiagnosisPage from "components/pages/TreatmentPage/DiagnosisPage";
import TestTypeManagement from "components/pages/TestTypeManagement/TestTypeManagement";
import EditBlogPage from "components/pages/BlogPage/EditBlogPage";
import DoctorScheduleList from "components/pages/DoctorPatientList/DoctorScheduleList";
import AppointmentTransferRequests from "components/pages/AppoimentChangePage/AppointmentChangePage";
import TreatmentRegimenManagement from "components/pages/TreatmentRegimenManagement/TreatmentRegimenManagement";
import DrugManagementPage from "components/pages/DrugManagement/DrugManagement";
import ManagerLayout from "components/layouts/ManagerLayout/ManagerLayout";
import BlogApprovalPage from "components/pages/BlogApproval/BlogApprovalPage";
import ApprovedBlogPage from "components/pages/ApprovedBlog/ApprovedBlogPage";
import AllAppointmentChanges from "components/pages/AppoimentChangePage/AllAppointmentChangePage";
import UserBlogDetail from "components/pages/BlogDetail/UserBlogDetail";
import BlogListPage from "components/pages/Blog/BlogListpage";
import ManagerAppointmentChanges from "components/pages/ManagerAppointmentChange/ManagerAppointmentChange";
import AppointmentListPage from "components/pages/DoctorPatientList/AppointmentListPage";


let publicRoute = [];
const role = localStorage.getItem("role");


if (role === "CUSTOMER") {
    publicRoute = [
        { path: "/patient-request", component: PatientRequestsManager, layout: DefaultLayout },
        { path: "/reset-password", component: ResetPasswordForm, layout: null },
        { path: "/my-blog/:blogId", component: UserBlogDetail, layout: DefaultLayout },
        { path: "/blog/:blogId", component: BlogDetail, layout: DefaultLayout },
        { path: "/schedule", component: Schedule, layout: DefaultLayout },
        { path: "/profile", component: ProfileSettings, layout: DefaultLayout },
        { path: "/notify", component: NotificationsPage, layout: DefaultLayout },
        { path: "/my-blog", component: BlogManagementPage, layout: DefaultLayout },
        { path: "/blogeditor", component: BlogEditorPage, layout: DefaultLayout },
        { path: "/chat", component: ChatPage, layout: DefaultLayout },
        { path: "/book", component: DoctorBookingPage, layout: DefaultLayout },
        { path: "/login", component: Login, layout: null },
        { path: "/my-blog/edit/:blogId", component: EditBlogPage, layout: DefaultLayout },
        { path: "/blog", component: BlogListPage, layout: DefaultLayout },
        { path: "*", component: NotFound, layout: null },

    ]
} else if (role === "DOCTOR") {
    publicRoute = [
        { path: "/patient-request", component: PatientRequestsManager, layout: DefaultLayout },
        { path: "/forgot-password", component: ForgotPasswordForm, layout: null },
        { path: "/reset-password", component: ResetPasswordForm, layout: null },
        { path: "/login", component: Login, layout: null },
        { path: "/doctor/patient-request", component: PatientRequestsManager, layout: DoctorLayout },
        { path: "/doctor/notify", component: NotificationsPage, layout: DoctorLayout },
        { path: "/doctor/profile", component: ProfileSettings, layout: DoctorLayout },
        { path: "/doctor/degree", component: DoctorDegreeForm, layout: null },
        { path: "/doctor/treatment/:appointmentId", component: DoctorDiagnosisPage, layout: DoctorLayout },
        { path: "/doctor/schedule-list", component: DoctorScheduleList, layout: DoctorLayout },
        { path: "/doctor/chat", component: ChatPage, layout: DoctorLayout },
        { path: "/doctor/appointment-change", component: AppointmentTransferRequests, layout: DoctorLayout },
        { path: "/doctor/patient-appointment-list", component: AppointmentListPage, layout: DoctorLayout },
        { path: "/blog", component: BlogListPage, layout: DoctorLayout },
        { path: "/blog/:blogId", component: BlogDetail, layout: DefaultLayout },
        { path: "*", component: NotFound, layout: null },


    ]
} else if (role === "ADMIN") {
    publicRoute = [

        { path: "/profile", component: ProfileSettings, layout: DefaultLayout },
        { path: "/blogeditor", component: BlogEditorPage, layout: DefaultLayout },
        { path: "/dashboard", component: DashboardContent, layout: AdminLayout },
        { path: "/login", component: Login, layout: null },
        { path: "/admin/dashboard", component: DashboardContent, layout: AdminLayout },
        { path: "/admin/notify", component: NotificationsPage, layout: AdminLayout },
        { path: "/admin/profile", component: ProfileSettings, layout: AdminLayout },
        { path: "/admin/accounts", component: AccountManagement, layout: AdminLayout },
        { path: "/admin/test-types", component: TestTypeManagement, layout: AdminLayout },
        { path: "/admin/treatment-regimen", component: TreatmentRegimenManagement, layout: AdminLayout },
        { path: "/admin/drugs", component: DrugManagementPage, layout: AdminLayout },
        { path: "/admin/appointment-changes", component: AllAppointmentChanges, layout: AdminLayout },
        { path: "/admin/patient-appointment-list", component: AppointmentListPage, layout: AdminLayout },
        { path: "*", component: NotFound, layout: null },
    ]
} else if (role === "MANAGER") {
    publicRoute = [
        { path: "/manager/profile", component: ProfileSettings, layout: ManagerLayout },
        { path: "/login", component: Login, layout: null },
        { path: "/manager/blog-approval", component: BlogApprovalPage, layout: ManagerLayout },
        { path: "/manager/approved-blogs", component: ApprovedBlogPage, layout: ManagerLayout },
        { path: "/manager/appointment-changes", component: ManagerAppointmentChanges, layout: ManagerLayout },
        { path: "/blog", component: BlogListPage, layout: ManagerLayout },
        { path: "/blog/:blogId", component: BlogDetail, layout: ManagerLayout },
        { path: "*", component: NotFound, layout: null },
    ]
} else {

    publicRoute = [
        { path: "/", component: LandingPage, layout: null },
        { path: "/login", component: Login, layout: null },
        { path: "/register", component: RegisterForm, layout: null },
        { path: "/forgot-password", component: ForgotPasswordForm, layout: null },
        { path: "/reset-password", component: ResetPasswordForm, layout: null },
        { path: "/blog/:blogId", component: BlogDetail, layout: null },
        { path: "/blog", component: BlogListPage, layout: null },
        { path: "/blog/:blogId", component: BlogDetail, layout: null },
        { path: "*", component: NotFound, layout: null },



    ]
};

const privateRoute = [];

export { publicRoute, privateRoute };