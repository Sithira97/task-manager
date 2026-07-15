import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import Schedule from "./pages/Schedule";
import Teams from "./pages/Teams";
import Layout from "./components/Layout";
import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { RouterProvider, useRoute } from "./context/RouterContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider>
        <MainApp />
      </RouterProvider>
    </AuthProvider>
  );
};

const MainApp: React.FC = () => {
  const { token, user, loading } = useAuth();
  const { currentView } = useRoute();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="pulse">Initializing Workspace Session...</div>
      </div>
    );
  }

  if (token && user) {
    let viewComponent: React.ReactNode;
    switch (currentView) {
      case "dashboard":
        viewComponent = <Dashboard />;
        break;
      case "tasks":
        viewComponent = <Tasks />;
        break;
      case "schedule":
        viewComponent = <Schedule />;
        break;
      case "teams":
        viewComponent = <Teams />;
        break;
    }
    return <Layout>{viewComponent}</Layout>;
  }

  return showRegister ? (
    <Register onToggleAuth={() => setShowRegister(false)} />
  ) : (
    <Login onToggleAuth={() => setShowRegister(true)} />
  );
};

export default App;
