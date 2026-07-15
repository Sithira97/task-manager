import React, { createContext, useContext, useState } from "react";
import type { Route, RouterContextType } from "../types";

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentView, setCurrentView] = useState<Route>("dashboard");
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
