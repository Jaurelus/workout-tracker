import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@base-ui/react";
import { Badge } from "@/components/ui/badge";
import { Table, TableHead } from "@/components/ui/table";

function WorkoutOverview() {
  const { id } = useParams();
  const [workout, setWorkout] = useState();

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
      console.log("Success " + data);
      setWorkout(data);
    } else {
      console.log("Error" + data);
    }
  };

  useEffect(() => {
    getWorkoutInfo();
  }, [id]);

  //-------- APP BUILD -------------
  return (
    <div className=" bg-background flex flex-1 justify-center items-center">
      {workout && (
        <div className="flex flex-1 flex-col p-10 gap-5">
          <Card className=" items-center">
            <CardHeader>
              {new Date(workout.date).toLocaleDateString()}
              <CardTitle>{workout.focus}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge> exercises</Badge>
              <Badge> sets</Badge>
            </CardContent>
          </Card>
          <div className="flex-row flex flex-1 justify-between gap-5">
            <Card className=" items-center flex-1">Total Volume</Card>
            <Card className=" items-center flex-1">Top Weight</Card>
            <Card className=" items-center flex-1">Most intense exercise</Card>
          </div>
          {/* Map exercises */}
          <Card>
            <CardHeader>
              <CardTitle>Exercise Name</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHead>#</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Reps</TableHead>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
export default WorkoutOverview;
