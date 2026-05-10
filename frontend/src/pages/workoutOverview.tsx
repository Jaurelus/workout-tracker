import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import { Button } from "@base-ui/react";
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

function WorkoutOverview() {
  const { id } = useParams();
  const [workout, setWorkout] = useState();
  const [sets, setSets] = useState();
  const groupedSets = useRef([]);
  const [, forceUpdate] = useState(0);
  const [setTotal, setSetTotal] = useState();
  const [exercisesTotal, setExercisesTotal] = useState();

  const getTotals = () => {};
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
    <div className=" bg-background h-screen flex flex-1 justify-center items-center">
      {workout && (
        <div className="h-full flex flex-1 flex-col p-10 gap-5 justify-start">
          <Card className=" items-start shadow-lg shadow-primary">
            <CardHeader className="">
              <p className="text-secondary">
                {new Date(workout.date).toLocaleDateString()}
              </p>
              <CardTitle className="font-bold text-4xl">
                {workout.focus}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge> exercises</Badge>
              <Badge> sets</Badge>
            </CardContent>
          </Card>
          <div className="flex-row flex flex-1 justify-between gap-5 max-h-32">
            <Card className="shadow-lg shadow-primary items-center flex-1">
              Total Volume
            </Card>
            <Card className="shadow-lg shadow-primary items-center flex-1">
              Top Weight
            </Card>
            <Card className="shadow-lg shadow-primary items-center flex-1">
              Most intense exercise
            </Card>
          </div>
          {/* Map exercises */}
          {groupedSets && (
            <div className="gap-5 flex flex-1 flex-col">
              {groupedSets.current.map((group, index) => (
                <Card className="flex flex-col flex-1">
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
                      <TableBody className="">
                        {groupedSets.current[index].map((set, setIndex) => (
                          <TableRow className="">
                            <TableCell>{setIndex + 1}</TableCell>
                            <TableCell>{set.weight}</TableCell>
                            <TableCell>{set.reps}</TableCell>
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
    </div>
  );
}
export default WorkoutOverview;
