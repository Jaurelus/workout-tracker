import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { EllipsisVertical, Pencil, Trash2, Undo2 } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";

function WorkoutOverview() {
  const { id } = useParams();
  const [workout, setWorkout] = useState();
  const [sets, setSets] = useState();
  const groupedSets = useRef([]);
  const [, forceUpdate] = useState(0);
  const [setExerciseTotal, setSetExerciseTotal] = useState([]);
  const [weightExercisesTotal, setWeightExercisesTotal] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const getTotals = () => {
    if (!groupedSets) return;
    groupedSets.forEach((exercise, index) => {
      //Add stuff for each column
      //Push sum to variables
    });
  };
  const groupSets = () => {
    if (!sets) return;

    sets.forEach((set, index) => {
      if (
        !groupedSets.current.some(
          (group) => group[0]?.exercises?.id === set.exercises?.id,
        )
      ) {
        let exerciseID = set.exercises.id;
        let group = sets.filter((set) => set.exercises.id == exerciseID);
        groupedSets.current.push(group);
      }
    });
  };
  useEffect(() => {
    groupSets();
    forceUpdate((prev) => prev + 1);
    console.log(groupedSets.current);
  }, [sets]);

  const handleEdit = () => {
    if (editMode) {
      setEditMode(false);
      //turn everything back into what it was
      let headerInputs = document.querySelectorAll(".header");
      headerInputs.forEach((header, index) => {
        console.log("All values: ", header);

        if (index == 0) {
          let date = document.createElement("p");
          date.innerText = header.innerHTML;
          console.log("Date", date);
          console.log("header ", header.textContent);
          header.replaceWith(date);
        }
      });
      return;
    }
    setEditMode(true);
    const selected = document.querySelectorAll(".editable");
    selected.forEach((element, index) => {
      const input = document.createElement("input");
      input.value = element.innerHTML;
      input.style.border = "1px solid #d23f2f";
      input.style.borderRadius = "10px";
      input.style.textAlign = "center";
      if (index < 2) {
        input.classList.add("header");
      } else {
        input.classList.add("setStuff");
      }
      element.replaceWith(input);
      console.log("Inputs");
    });
  };
  //--------- API CALL -----------
  const getWorkoutInfo = async () => {
    console.log("ID");

    if (!id) return;
    console.log(id, typeof id);

    const response = await fetch(
      `http://localhost:5117/getOneWorkout?id=${id}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      },
    );
    const data = await response.json();
    if (response.ok) {
      console.log("workout Success ", data);
      setWorkout(data);
    } else {
      console.log("Error", data);
    }
  };

  useEffect(() => {
    getWorkoutInfo();
    getSets();
  }, [id]);

  const getSets = async () => {
    const response = await fetch(
      `http://localhost:5117/getSetByWID/?wID=${id}`,
      { headers: { "Content-Type": "application/json" }, method: "GET" },
    );
    const data = await response.json();
    if (response.ok) {
      console.log("Success sets ", data);
      setSets(data);
    } else {
      console.log("Error", data);
    }
  };

  //-------- APP BUILD -------------
  return (
    <div className="w-screen bg-background h-screen flex flex-1 justify-center items-center">
      {workout && (
        <div className=" relative h-full w-full flex flex-1 flex-col p-10 gap-5 justify-start">
          <Card className=" items-start w-full   min-h-40">
            <CardHeader className="">
              <p className="text-secondary editable">
                {new Date(workout.date).toLocaleDateString()}
              </p>
              <CardTitle className="font-bold text-4xl editable">
                {workout.focus}
              </CardTitle>
            </CardHeader>
            <div className="w-full flex  flex-1 relative">
              <ButtonGroup className="absolute right-0 bottom-5">
                <Button
                  variant="outline"
                  className=""
                  onClick={() => {
                    handleEdit();
                  }}
                >
                  {!editMode && <Pencil />}
                  {editMode && <Undo2 />}
                </Button>
                <Button className=" rounded-xl p-2  bg-[color-mix(in_srgb,var(--primary),black_60%)] text-primary [a]:hover:bg-primary/80 border-primary">
                  <Trash2 className="text-primary" />
                </Button>
              </ButtonGroup>
            </div>
            <CardContent>
              <Badge> exercises</Badge>
              <Badge> sets</Badge>
            </CardContent>
          </Card>
          <Card className="min-h-100 items-center flex flex-1 w-full shadow-lg shadow-primary mb-3">
            <CardTitle>Volume Over Time</CardTitle>
            <ResponsiveContainer className="w-full h-full px-5">
              <AreaChart
                width={800}
                height={300}
                data={[
                  { date: "5/7", volume: 3500 },
                  { date: "5/8", volume: 4000 },
                  { date: "5/9", volume: 4000 },
                  { date: "5/10", volume: 4100 },
                  { date: "5/11", volume: 4200 },
                  { date: "5/12", volume: 4300 },
                  { date: "5/13", volume: 4400 },
                  { date: "5/14", volume: 4500 },
                ]}
              >
                <XAxis dataKey="date" niceTicks="snap125"></XAxis>
                <YAxis
                  width="auto"
                  niceTicks="snap125"
                  domain={["3000", "5000"]}
                />

                <Area
                  className="w-full h-full"
                  dataKey="volume"
                  stroke="#d23f2f"
                  fill="#d23f2f60"
                ></Area>
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <div className="flex-row flex flex-1 justify-between gap-5 max-h-32">
            <Card className=" items-center flex-1">Total Volume</Card>
            <Card className=" items-center flex-1">Top Weight</Card>
            <Card className=" items-center flex-1">Most intense exercise</Card>
          </div>
          {/* Map exercises */}
          {groupedSets && (
            <div className="gap-5 flex flex-1 flex-col">
              {groupedSets.current.map((group, index) => (
                <Card className="flex flex-col flex-1 mb-10">
                  <CardHeader className="justify-between flex-row flex-1">
                    <CardTitle>{group[0].exercises.name}</CardTitle>
                    <div className="flex gap-5">
                      <Badge>Calf</Badge>
                      <Badge>Z</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <Table className=" text-center">
                      <TableHeader className="">
                        <TableRow className="">
                          <TableHead className="text-center">#</TableHead>
                          <TableHead className="text-center">Weight</TableHead>
                          <TableHead className="text-center">Reps</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="jusitfy-center items-center">
                        {groupedSets.current[index].map((set, setIndex) => (
                          <TableRow className="jusitfy-center items-center">
                            <TableCell className="jusitfy-center items-center">
                              <p className="editable"> {setIndex + 1}</p>
                            </TableCell>
                            <TableCell>
                              <p className="editable"> {set.weight}</p>
                            </TableCell>
                            <TableCell>
                              <p className="editable"> {set.reps}</p>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      {editMode && (
        <div className="fixed w-full bottom-0 px-10  ">
          <Button className="flex flex-1  w-full  text-white">
            Submit Edits
          </Button>
        </div>
      )}
    </div>
  );
}
export default WorkoutOverview;
