"use client";
import { createContext, useContext, useState } from "react";

const TasksContext = createContext({});

export function Providers({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState([]);

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}
