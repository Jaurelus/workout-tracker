import { useRef, useEffect, useState } from "react";

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
  const [workouts, setWorkouts] = useState(null);
  const totalExerciseCounts = useRef([]);
  const totalSetCounts = useRef([]);
  const [, forceUpdate] = useState(0);

  //------------- API CALL -------------
  const getWorkouts = async () => {
    const response = await fetch("http://localhost:5117/getWorkouts", {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });
    const data = await response.json();
    if (response.ok) {
      setWorkouts(data);
    } else {
      console.log("Error " + data);
    }
  };
  useEffect(() => {
    getWorkouts();
  }, []);
  useEffect(() => {
    if (workouts == null) return;
    workouts.forEach(async (workout) => {
      await getTotalExerciseCount(workout.id);

      await getTotalSetCount(workout.id);
      forceUpdate((prev) => prev + 1);
    });

    console.log("Proof", totalExerciseCounts);
  }, [workouts]);

  const getTotalSetCount = async (wID: Number) => {
    const response = await fetch(
      `http://localhost:5117/getTotalSets/?wID=${wID}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      },
    );
    const data = await response.json();
    if (response.ok) {
      console.log("Set", data);
      totalSetCounts.current.push(data);
    }
  };
  const getTotalExerciseCount = async (wID: Number) => {
    const response = await fetch(
      `http://localhost:5117/getTotalExercises/?wID=${wID}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      },
    );
    const data = await response.json();
    if (response.ok) {
      console.log("Exercise", data);

      totalExerciseCounts.current.push(data);
    }
  };

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
          {workouts &&
            workouts.map((workout, index) => (
              <div className="w-3/4 flex min-h-32 my-5 p-5" key={workout.id}>
                <Card className="w-full h-full flex py-0! pl-3 bg-primary">
                  <Card className="ml-2 h-full flex rounded-none bg-[color-mix(in_srgb,var(--primary-foreground)_65%,var(--background))] brightness-65">
                    <CardContent className="flex flex-row justify-between">
                      <div className="flex-col gap-3 justify-left text-left">
                        <CardTitle className="text-[color-mix(in_srgb,var(--primary-foreground)_60%,white)] brightness-130">
                          {new Date(
                            workout.date.slice(0, 10),
                          ).toLocaleDateString()}
                        </CardTitle>
                        <h1 className="font-extrabold text-xl">
                          {workout.focus}
                        </h1>
                        {totalExerciseCounts.current.length > 0 && (
                          <p className="text-[color-mix(in_srgb,var(--primary-foreground)_60%,white)] brightness-130">
                            {totalExerciseCounts.current[index]} exercises ·{" "}
                            {totalSetCounts.current[index]} sets
                          </p>
                        )}
                      </div>
                      <Link to={`workout/${workout.id}`}>
                        <Button
                          variant="ghost"
                          className="text-primary hover:bg-transparent!"
                          onMouseEnter={() => setViewColor("#ffffff")}
                          onMouseLeave={() => setViewColor("#d23f2f")}
                        >
                          View
                          <ArrowRightToLine color={viewColor} />
                        </Button>{" "}
                      </Link>
                    </CardContent>
                  </Card>
                </Card>
              </div>
            ))}
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default ViewPast;
