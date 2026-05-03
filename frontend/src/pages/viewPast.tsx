import { useEffect, useState } from "react";

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

import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "../components/mode-toggle";
import { Button } from "../components/ui/button";

import { Link } from "react-router-dom";
import { Table } from "lucide-react";
import { TableHead, TableHeader } from "@/components/ui/table";

function ViewPast() {
  //------------- API CALL -------------

  //------------- APP BUILD ------------
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
                <Link to="/pastWorkouts">
                  <Button variant="ghost"> View Past Workouts</Button>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger></SidebarTrigger>

        <main className="w-screen flex flex-col flex-1 items-center p-5">
          <h1 className="text-4xl">View Past Workouts</h1>
          <div className="absolute right-3">
            <ModeToggle />
          </div>
          {/*Table */}
          <Table>
            <TableHeader>
              <TableHead>Date</TableHead>
              <TableHead>Focus</TableHead>
            </TableHeader>
          </Table>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default ViewPast;
