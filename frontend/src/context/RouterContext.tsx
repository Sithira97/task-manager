import React, { createContext, useContext, useEffect, useState } from "react";
import type { Route, RouterContextType } from "../types";
import { useAuth } from "./AuthContext";

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAdmin, user } = useAuth();
  const [currentView, setCurrentView] = useState<Route>("tasks");
  useEffect(() => {
    if (user && isAdmin) {
      setCurrentView("dashboard");
    } else if (user && !isAdmin) {
      setCurrentView("tasks");
    }
  }, [isAdmin, user]);
  return (
    <RouterContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRoute = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRoute must be used within a RouterProvider");
  }
  return context;
};
