import LandingPage from "../components/pages/Landingpage";
import Login from "../components/pages/LoginPage/LoginPage.jsx";
const role = localStorage.getItem("userRole");

const publicRoute=[
    { path: "/", component: LandingPage, layout: null},
    { path: "/login", component: Login , layout: null},
];
const privateRoute = [];
export { publicRoute, privateRoute };