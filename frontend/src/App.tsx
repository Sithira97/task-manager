import Layout from "./components/Layout";
import { lazy, Suspense, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { RouterProvider, useRoute } from "./context/RouterContext";
import { TaskProvider } from "./context/TaskContext";
import { TooltipProvider } from "./components/ui/tooltip";
import Login from "./pages/Login";
import Loading from "./pages/Loading";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Tasks = lazy(() => import("@/pages/Tasks"));
const Schedule = lazy(() => import("@/pages/Schedule"));
const Teams = lazy(() => import("@/pages/Teams"));
const Register = lazy(() => import("@/pages/Register"));

const App: React.FC = () => {
  return (
    <TooltipProvider>
      <AuthProvider>
        <RouterProvider>
          <TaskProvider>
            <MainApp />
          </TaskProvider>
        </RouterProvider>
      </AuthProvider>
    </TooltipProvider>
  );
};

const MainApp: React.FC = () => {
  const { token, user, loading } = useAuth();
  const { currentView } = useRoute();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Loading />
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
    return (
      <Layout>
        <Suspense fallback={<Loading />}>{viewComponent}</Suspense>
      </Layout>
    );
  }

  return showRegister ? (
    <Register onToggleAuth={() => setShowRegister(false)} />
  ) : (
    <Login onToggleAuth={() => setShowRegister(true)} />
  );
};

export default App;
