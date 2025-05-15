import LandingPage from "../components/pages/Landingpage";
import Login from "../components/pages/LoginPage/LoginPage.jsx";
import RegisterForm from "components/pages/RegisterPage/RegisterPage";
import Schedule from "components/pages/SchedulePage/Schedule";
import DefaultLayout from "../components/layouts/DefaultLayout/index.jsx";
const role = localStorage.getItem("userRole");

const publicRoute=[
    { path: "/", component: LandingPage, layout: null},
    { path: "/login", component: Login , layout: null},
    { path: "/register", component: RegisterForm , layout: null},
    { path: "/schedule", component: Schedule , layout: DefaultLayout},
];
const privateRoute = [];
export { publicRoute, privateRoute };