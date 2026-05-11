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
import { Card } from "./components/ui/card";
import MySidebar from "./pageComponents/sidebar";
import Consistency from "./pageComponents/consistency";
import LastWorkout from "./pageComponents/lastWorkout";
import Motivation from "./pageComponents/motivation";
import Chart from "./pageComponents/chart";

function Dashboard() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider className="text-center ">
        <MySidebar />
        <SidebarTrigger></SidebarTrigger>

        <main className="w-screen flex flex-col flex-1 items-center p-5">
          <h1 className="text-4xl">Workout Tracker</h1>
          <div className="absolute right-3">
            <ModeToggle />
          </div>
          {/* Dashboard Panels */}
          <div className="w-full flex-col gap-10 flex items-center  pt-20">
            {/*Top Row*/}
            <div className="flex flex-row gap-5 w-full justify-center">
              <div className="w-7/12 min-h-96">
                <LastWorkout />
              </div>

              <div className="max-w-6/12 min-h-96">
                <Consistency />
              </div>
            </div>
            {/*Bottom Row*/}
            <div className="flex flex-row gap-5 w-full justify-center">
              <div className="w-7/12 min-h-96">
                <Chart />
              </div>

              <div className="w-7/12 min-h-96">
                <Motivation />
              </div>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default Dashboard;
