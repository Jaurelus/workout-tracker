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
import { Table, TableHead, TableHeader } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightToLine } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import MySidebar from "@/pageComponents/sidebar";

function ViewPast() {
  const [viewColor, setViewColor] = useState("#d23f2f");
  //------------- API CALL -------------

  //------------- APP BUILD ------------
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider className="text-center">
        <MySidebar />

        <SidebarTrigger></SidebarTrigger>

        <main className="w-screen flex flex-col flex-1 items-center p-5">
          <h1 className="text-4xl">View Past Workouts</h1>
          <div className="absolute right-3">
            <ModeToggle />
          </div>
          {/*Table */}
          <div className="w-3/4 flex min-h-32 my-5 p-5">
            <Card className="w-full h-full flex py-0! pl-3 bg-primary">
              <Card className="h-full flex rounded-none bg-[color-mix(in_srgb,var(--primary-foreground)_65%,black)] brightness-65">
                <CardContent className="flex flex-row justify-between">
                  <div className="flex-col gap-3 justify-left text-left">
                    <CardTitle className="text-[color-mix(in_srgb,var(--primary-foreground)_60%,white)] brightness-130">
                      Date
                    </CardTitle>
                    <h1 className="font-extrabold text-xl">Focus</h1>
                    <p className="text-[color-mix(in_srgb,var(--primary-foreground)_60%,white)] brightness-130">
                      # exercises . # sets
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-primary hover:bg-transparent!"
                    onMouseEnter={() => setViewColor("#ffffff")}
                    onMouseLeave={() => setViewColor("#d23f2f")}
                  >
                    View
                    <ArrowRightToLine color={viewColor} />
                  </Button>
                </CardContent>
              </Card>
            </Card>
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default ViewPast;
