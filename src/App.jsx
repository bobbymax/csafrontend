import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./assets/css/main.css";
import Protected from "./layouts/guards/Protected";
import Guest from "./layouts/guards/Guest";
import PersistAuth from "./layouts/guards/PersistAuth";
import { routes } from "./http/routes";
import LoaderOne from "./layouts/components/loaders/LoaderOne";

const App = () => {
  return (
    <Suspense fallback={<LoaderOne />}>
      <Routes>
        {routes.guest.map((pg, i) => (
          <Route
            exact
            key={i}
            path={pg?.url}
            element={<Guest>{pg?.element}</Guest>}
          />
        ))}

        <Route element={<PersistAuth />}>
          {routes.protected.map((pg, i) => (
            <Route
              exact
              key={i}
              path={pg?.url}
              element={<Protected>{pg?.element}</Protected>}
            />
          ))}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
