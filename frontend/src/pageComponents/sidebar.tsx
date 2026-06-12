import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Settings, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

function MySidebar() {
  return (
    <Sidebar variant="sidebar" className="flex-row flex-1 flex bg-primary">
      <SidebarHeader className="py-8 font-bold text-xl">
        <Link to="/home">
          <h1>WorkBench</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="mt-36 flex">
        <SidebarMenu className="gap-8 justify-center flex  items-center">
          <SidebarMenuItem className="mt-2 flex flex-col">
            <Separator className="bg-primary" />

            <Link to="/logWorkout" className="py-8">
              <Button variant="ghost" className="hover:bg-transparent!">
                Log a New Workout
              </Button>
            </Link>
            <Separator className="bg-primary" />
          </SidebarMenuItem>

          <SidebarMenuItem className="mt-2 flex flex-col">
            <Link to="/addExercise" className="pb-8">
              <Button
                variant="ghost"
                className="mt-auto mb-auto hover:bg-transparent!"
              >
                Add a new exercise
              </Button>
            </Link>
            <Separator className="bg-primary" />
          </SidebarMenuItem>

          <SidebarMenuItem className="mt-2 flex flex-col">
            <Link to="/pastWorkouts" className="pb-8">
              <Button variant="ghost" className="hover:bg-transparent!">
                View Past Workouts
              </Button>
            </Link>
            <Separator className="bg-primary" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex items-center">
        <Settings />
      </SidebarFooter>
    </Sidebar>
  );
}

export default MySidebar;
