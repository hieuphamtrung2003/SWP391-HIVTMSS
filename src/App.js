import DefaultLayout from "../src/components/layouts/DefaultLayout";
import { Fragment } from "react";
import { publicRoute } from "./route/Index";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
          <div className="App">
            <Routes>
              {publicRoute.map((route, index) => {
                const Page = route.component;
                let Layout = DefaultLayout;
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
    </div>
  );
}

export default App;
