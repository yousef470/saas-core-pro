import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import DashboardLayout from "./components/layout/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Dashboard Layout */}

          <Route
            path="/"
            element={
             <ProtectedRoute>
  <DashboardLayout>
                <Dashboard />
               </DashboardLayout>
</ProtectedRoute>
            }
          />

          <Route
            path="/crm"
            element={
              <DashboardLayout>
                <CRM />
              </DashboardLayout>
            }
          />

          <Route
            path="/analytics"
            element={
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            }
          />

          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            }
          />

          {/* Auth Pages */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;