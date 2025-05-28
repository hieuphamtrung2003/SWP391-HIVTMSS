import LandingPage from "../components/pages/Landingpage";
import Login from "../components/pages/LoginPage/LoginPage.jsx";
import RegisterForm from "components/pages/RegisterPage/RegisterPage";
import Schedule from "components/pages/SchedulePage/Schedule";
import DefaultLayout from "../components/layouts/DefaultLayout/index.jsx";
import ProfileSettings from "components/pages/ProfilePage/ProfilePage";
import NotificationsPage from "components/pages/NotificationPage/NotificationPage";
import BlogListPage from "components/pages/BlogPage/BlogPage";
import BlogEditorPage from "components/pages/BlogEditor/Blogeditor";
import ChatPage from "components/pages/ChatPage/ChatPage";
import DoctorBookingPage from "components/pages/BookingPage";
import ForgotPasswordForm from "components/pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordForm from "components/pages/ForgotPasswordPage/ResetPasswordPage";
import BlogDetail from "components/pages/BlogDetail/BlogDetail";
import DashboardContent from "components/pages/DashBoard/DashBoard";
import PatientRequestsManager from "components/pages/PatientRequest/PatientRequest";
const role = localStorage.getItem("userRole");

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
    { path: "/dashboard", component: DashboardContent, layout: DefaultLayout },
    { path: "/patient-request", component: PatientRequestsManager, layout: DefaultLayout },

];
const privateRoute = [];
export { publicRoute, privateRoute };