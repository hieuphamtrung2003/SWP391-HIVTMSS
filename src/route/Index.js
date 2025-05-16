import LandingPage from "../components/pages/Landingpage";
import Login from "../components/pages/LoginPage/LoginPage.jsx";
import RegisterForm from "components/pages/RegisterPage/RegisterPage";
import Schedule from "components/pages/SchedulePage/Schedule";
import DefaultLayout from "../components/layouts/DefaultLayout/index.jsx";
import ProfileSettings from "components/pages/ProfilePage/ProfilePage";
import NotificationsPage from "components/pages/NotificationPage/NotificationPage";
import BlogListPage from "components/pages/BlogPage/BlogPage";
import BlogEditorPage from "components/pages/BlogEditor/Blogeditor";
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
];
const privateRoute = [];
export { publicRoute, privateRoute };