import DefaultLayout from "../src/components/layouts/DefaultLayout/DefaultLayout";
import { Fragment } from "react";
import { publicRoute } from "./route/Index";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "components/layouts/AdminLayout/AdminLayout";
import DoctorLayout from "components/layouts/DoctorLayout/DoctorLayout";
function App() {
  return (
    <div className="App">
      <Router>
        <div className="App">
          <Routes>
            {publicRoute.map((route, index) => {
              const Page = route.component;
              let Layout = DefaultLayout;
              if (route.layout == AdminLayout) {
                Layout = AdminLayout;
              }
              if (route.layout == DoctorLayout) {
                Layout = DoctorLayout;
              }
              if (route.layout === null) {
                Layout = Fragment;
              }
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        stacked
      />
    </div>
  );
}

export default App;
