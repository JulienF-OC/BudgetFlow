import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Plan from "./pages/Plan";
import Categories from "./pages/Categories";

function isLoggedIn() {
  return localStorage.getItem("bf_token") === "demo";
}

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plan"
        element={
          <ProtectedRoute>
            <Plan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
