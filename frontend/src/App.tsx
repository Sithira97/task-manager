import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Tasks from "./pages/Tasks";
import Schedule from "./pages/Schedule";
import Teams from "./pages/Teams";
import Layout from "./components/Layout";
import { useEffect, useState } from "react";
import type { User } from "./types";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const publicPaths = ["/login", "/register"];

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("auth_user");
        if (!publicPaths.includes(location.pathname)) {
          navigate("/login");
        }
      }
    } else if (!publicPaths.includes(location.pathname)) {
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <Layout user={user} setUser={setUser}>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/tasks"
        element={
          <Layout user={user} setUser={setUser}>
            <Tasks />
          </Layout>
        }
      />
      <Route
        path="/schedule"
        element={
          <Layout user={user} setUser={setUser}>
            <Schedule />
          </Layout>
        }
      />
      <Route
        path="/teams"
        element={
          <Layout user={user} setUser={setUser}>
            <Teams />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
