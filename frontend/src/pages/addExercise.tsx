import { useState } from "react";

import "../App.css";
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
} from "../components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { useSidebar } from "../components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "../components/mode-toggle";
import { Button } from "../components/ui/button";
import { ListPlus } from "lucide-react";

function Appp() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider className="text-center">
        <Sidebar
          variant="sidebar"
          className="flex-row flex-1 flex justify-between"
        >
          <SidebarHeader className="py-8 font-bold text-xl">Work</SidebarHeader>
          <SidebarContent className="mt-12">
            <SidebarMenu className="gap-8">
              <SidebarMenuItem>
                <Button variant="ghost">Log a New Workout</Button>
                <SidebarMenuAction></SidebarMenuAction>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button variant="ghost">Add a new exercise </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button variant="ghost"> View Past Workouts</Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger></SidebarTrigger>

        <main className="w-screen flex flex-col flex-1 items-center p-5">
          <h1 className="text-4xl">Add Exercise</h1>
          <div className="absolute right-3">
            <ModeToggle />
          </div>
          {/*Table */}
          <div className="mt-5">
            <table>
              <thead className="gap-5 flex">
                <th>Exercise Name</th>
                <th>Primary Muscles Targeted</th>
                <th>Secondary Muscles Targeted</th>
                <th>Tips</th>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <Button className="rounded-4xl items-center bottom-0">
            <ListPlus size={16} color="white" />
          </Button>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default Appp;
