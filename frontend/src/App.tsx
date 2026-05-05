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
                <Card className="bg-primary flex w-full h-full py-0! pl-3!">
                  <Card className="bg-primary-foreground  p-2 flex w-full h-full ml-3 rounded-none">
                    <h1 className="text-2xl text-white">Last Workout</h1>
                  </Card>
                </Card>
              </div>

              <div className="w-7/12 min-h-96">
                <Card className="bg-primary flex w-full h-full py-0! pl-3!">
                  <Card className="bg-primary-foreground  p-2 flex w-full h-full ml-3 rounded-none">
                    <h1 className="text-2xl text-white">Consistency</h1>
                  </Card>
                </Card>
              </div>
            </div>
            {/*Bottom Row*/}
            <div className="flex flex-row gap-5 w-full justify-center">
              <div className="w-7/12 min-h-96">
                <Card className="bg-primary flex w-full h-full py-0! pl-3!">
                  <Card className="bg-primary-foreground  p-2 flex w-full h-full ml-3 rounded-none">
                    <h1 className="text-2xl text-white">Chart</h1>
                  </Card>
                </Card>
              </div>

              <div className="w-7/12 min-h-96">
                <Card className="bg-primary flex w-full h-full py-0! pl-3!">
                  <Card className="bg-primary-foreground  p-2 flex w-full h-full ml-3 rounded-none">
                    <h1 className="text-2xl text-white">Motivation</h1>
                  </Card>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default Dashboard;
