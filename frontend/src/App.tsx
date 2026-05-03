import { useState } from "react";

import "./App.css";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupAction,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { Link } from "react-router-dom";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider className="text-center">
        <Sidebar
          variant="sidebar"
          className="flex-row flex-1 flex justify-between"
        >
          <SidebarHeader className="py-8 font-bold text-xl">
            <Link to="/">Work</Link>
          </SidebarHeader>
          <SidebarContent className="mt-12">
            <SidebarMenu className="gap-8">
              <SidebarMenuItem>
                <Link to="/logWorkout">
                  <Button variant="ghost">Log a New Workout</Button>
                </Link>
                <SidebarMenuAction></SidebarMenuAction>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/addExercise">
                  <Button variant="ghost">Add a new exercise </Button>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button variant="ghost"> View Past Workouts</Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger></SidebarTrigger>

        <main className="w-screen flex flex-col flex-1 items-center p-5">
          <h1 className="text-4xl">Workout Tracker</h1>
          <div className="absolute right-3">
            <ModeToggle />
          </div>
          {/* Dashboard Panels */}
          <div className="w-full flex-col gap-5 flex items-center  pt-20">
            {/*Top Row*/}
            <div className="flex flex-row gap-5 w-full justify-center">
              <div className="bg-primary-foreground w-[40%] h-80 rounded-3xl p-2">
                <h1 className="text-2xl text-white">Last Workout</h1>
              </div>

              <div className="bg-primary-foreground w-[40%] rounded-3xl p-2">
                <h1 className="text-2xl text-white">Consistency</h1>
              </div>
            </div>
            {/*Bottom Row*/}
            <div className="flex flex-row gap-5 w-full justify-center">
              <div className="bg-primary-foreground w-[40%] h-80 rounded-3xl p-2">
                <h1 className="text-2xl text-white">Chart</h1>
              </div>

              <div className="bg-primary-foreground w-[40%] rounded-3xl p-2">
                <h1 className="text-2xl text-white">Motivation</h1>
              </div>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
