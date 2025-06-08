import LandingPage from "../components/pages/Landingpage";
import Login from "../components/pages/LoginPage/LoginPage.jsx";
import RegisterForm from "components/pages/RegisterPage/RegisterPage";
import Schedule from "components/pages/SchedulePage/Schedule";
import DefaultLayout from "../components/layouts/DefaultLayout/DefaultLayout.jsx";
import ProfileSettings from "components/pages/ProfilePage/ProfilePage";
import NotificationsPage from "components/pages/NotificationPage/NotificationPage";
import BlogListPage from "components/pages/BlogPage/BlogPage";
import BlogEditorPage from "components/pages/BlogEditor/Blogeditor";
import ChatPage from "components/pages/ChatPage/ChatPage";
import DoctorBookingPage from "components/pages/BookingPage";
import AdminDashboard from "components/pages/DashBoard/DashBoard";
import PatientRequestsManager from "components/pages/PatientRequest/PatientRequest";
import ForgotPasswordForm from "components/pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordForm from "components/pages/ForgotPasswordPage/ResetPasswordPage";
import BlogDetail from "components/pages/BlogDetail/BlogDetail";
import DashboardContent from "components/pages/DashBoard/DashBoard";
<<<<<<< HEAD
import NotFound from "components/pages/NotFoundPage";

let publicRoute = [];
const role = localStorage.getItem("role");


if (role === "CUSTOMER") {
    publicRoute = [
        { path: "/patient-request", component: PatientRequestsManager, layout: DefaultLayout },
        { path: "/reset-password", component: ResetPasswordForm, layout: null },
        { path: "/blog/1", component: BlogDetail, layout: null },
        { path: "/schedule", component: Schedule, layout: DefaultLayout },
        { path: "/profile", component: ProfileSettings, layout: DefaultLayout },
        { path: "/notify", component: NotificationsPage, layout: DefaultLayout },
        { path: "/blog", component: BlogListPage, layout: DefaultLayout },
        { path: "/blogeditor", component: BlogEditorPage, layout: DefaultLayout },
        { path: "/chat", component: ChatPage, layout: DefaultLayout },
        { path: "/book", component: DoctorBookingPage, layout: DefaultLayout },
        { path: "/login", component: Login, layout: null },
        { path: "*", component: NotFound, layout: null },
    ]
} else if (role === "DOCTOR") {
    publicRoute = [
        { path: "/dashboard", component: AdminDashboard, layout: DefaultLayout },
        { path: "/patient-request", component: PatientRequestsManager, layout: DefaultLayout },
        { path: "/forgot-password", component: ForgotPasswordForm, layout: null },
        { path: "/reset-password", component: ResetPasswordForm, layout: null },
        { path: "/blog/1", component: BlogDetail, layout: null },
        { path: "/schedule", component: Schedule, layout: DefaultLayout },
        { path: "/profile", component: ProfileSettings, layout: DefaultLayout },
        { path: "/notify", component: NotificationsPage, layout: DefaultLayout },
        { path: "/blog", component: BlogListPage, layout: DefaultLayout },
        { path: "/blogeditor", component: BlogEditorPage, layout: DefaultLayout },
        { path: "/chat", component: ChatPage, layout: DefaultLayout },
        { path: "/login", component: Login, layout: null },
        { path: "*", component: NotFound, layout: null },
    ]
} else if (role === "ADMIN") {
    publicRoute = [
        { path: "/schedule", component: Schedule, layout: DefaultLayout },
        { path: "/profile", component: ProfileSettings, layout: DefaultLayout },
        { path: "/blog", component: BlogListPage, layout: DefaultLayout },
        { path: "/blogeditor", component: BlogEditorPage, layout: DefaultLayout },
        { path: "/dashboard", component: DashboardContent, layout: DefaultLayout },
        { path: "/login", component: Login, layout: null },
        { path: "*", component: NotFound, layout: null },
    ]
} else {
    publicRoute = [
        { path: "/", component: LandingPage, layout: null },
        { path: "/login", component: Login, layout: null },
        { path: "/register", component: RegisterForm, layout: null },
        { path: "/forgot-password", component: ForgotPasswordForm, layout: null },
        { path: "/reset-password", component: ResetPasswordForm, layout: null },
        { path: "/blog/1", component: BlogDetail, layout: null },
        { path: "/blog", component: BlogListPage, layout: DefaultLayout },
        { path: "*", component: NotFound, layout: null },
    ]
};


=======
import AdminLayout from "components/layouts/AdminLayout/AdminLayout";
import DoctorLayout from "components/layouts/DoctorLayout/DoctorLayout";
import AccountManagement from "components/pages/AccountManagement/AccountManagement";
import DoctorDegreeForm from "components/pages/DoctorDegreeForm/DoctorDegreeForm";


const publicRoute = [
    { path: "/", component: LandingPage, layout: null },
    { path: "/login", component: Login, layout: null },
    { path: "/register", component: RegisterForm, layout: null },
    { path: "/schedule", component: Schedule, layout: DefaultLayout },
    { path: "/profile", component: ProfileSettings, layout: DefaultLayout },
    { path: "/notify", component: NotificationsPage, layout: DefaultLayout },
    { path: "/blog", component: BlogListPage, layout: DefaultLayout },
    { path: "/blogeditor", component: BlogEditorPage, layout: DefaultLayout },
    { path: "/chat", component: ChatPage, layout: DefaultLayout },
    { path: "/book", component: DoctorBookingPage, layout: DefaultLayout },
    { path: "/forgot-password", component: ForgotPasswordForm, layout: null },
    { path: "/reset-password", component: ResetPasswordForm, layout: null },
    { path: "/blog/1", component: BlogDetail, layout: null },


    { path: "/admin/dashboard", component: DashboardContent, layout: AdminLayout },
    { path: "/admin/notify", component: NotificationsPage, layout: AdminLayout },
    { path: "/admin/profile", component: ProfileSettings, layout: AdminLayout },
    { path: "/admin/accounts", component: AccountManagement, layout: AdminLayout },

    { path: "/doctor/patient-request", component: PatientRequestsManager, layout: DoctorLayout },
    { path: "/doctor/notify", component: NotificationsPage, layout: DoctorLayout },
    { path: "/doctor/profile", component: ProfileSettings, layout: DoctorLayout },
    { path: "/doctor/degree", component: DoctorDegreeForm, layout: null },


];
>>>>>>> 9113404d289e1d2be9074724d2cec74d15aa833d
const privateRoute = [];

export { publicRoute, privateRoute };