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
import { AppSidebar } from "../components/app-sidebar";
import { useSidebar } from "../components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "../components/mode-toggle";
import { Button } from "../components/ui/button";
import { CircleX, ListPlus, PencilRuler } from "lucide-react";
import AddExerciseModal from "@/pageComponents/addExerciseModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import MySidebar from "@/pageComponents/sidebar";

function Appp() {
  const [addModalVis, setAddModalVis] = useState(false);
  const [exercises, setExercises] = useState<any>(null);

  //------------- API CALL -------------
  const getExercises = async () => {
    const response = await fetch("http://localhost:5117/getExercises", {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });
    const data = await response.json();
    if (response.status == 200) {
      console.log("Success", data);
      setExercises(data);
    }
  };
  useEffect(() => {
    getExercises();
  });

  //------------- APP BUILD ------------
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider className="text-center">
        <MySidebar />
        <SidebarTrigger></SidebarTrigger>

        <main className="w-screen flex flex-col flex-1 items-center p-5">
          <h1 className="text-4xl">Add Exercise</h1>
          <div className="absolute right-3">
            <ModeToggle />
          </div>
          {/*Table */}
          <div className="mt-5 w-[75%] flex">
            <Table>
              <TableHeader>
                <TableHead className="text-center">Exercise Name</TableHead>
                <TableHead className="text-center">Primary Muscles</TableHead>
                <TableHead className="text-center">Secondary Muscles</TableHead>
                <TableHead className="text-center">Tips</TableHead>
              </TableHeader>
              {exercises && (
                <TableBody id="tBody">
                  {exercises.map((exercise, index) => (
                    <TableRow key={exercise.Id}>
                      <TableCell>{exercise.name}</TableCell>
                      <TableCell>{exercise.primary}</TableCell>
                      <TableCell>{exercise.secondary}</TableCell>
                      <TableCell>{exercise.tips}</TableCell>
                      <div>
                        <TableCell>
                          <Button variant="ghost">
                            <PencilRuler />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost">
                            <CircleX />
                          </Button>
                        </TableCell>
                      </div>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
          <Button
            className="rounded-4xl items-center bottom-0"
            onClick={() => {
              setAddModalVis((prev) => !prev);
            }}
          >
            <ListPlus size={16} color="white" />
          </Button>
          <div>
            <AddExerciseModal
              visibility={addModalVis}
              changeVisibility={setAddModalVis}
            />
            <Button onClick={getExercises}>test</Button>
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default Appp;
