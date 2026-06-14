import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { useEffect, useState } from "react";

function TotalVolume(workout: any) {
  const [total, setTotal] = useState(null);
  const [currWorkout, setWorkout] = useState();

  const getTotalVolume = async (wid) => {
    const response = await fetch(
      `http://localhost:5117/getTotalVolume?wid=${wid}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        credentials: "include",
      },
    );
    const data = await response.json();
    if (response.ok) {
      console.log("Success getting total volume", data);
      setTotal(data);
    } else {
      console.log("Error getting total volume", data);
    }
  };
  useEffect(() => {
    if (!workout) return;
    getTotalVolume(workout.workout.id);
  }, [workout]);
  useEffect(() => {
    setWorkout(workout);
    console.log("Workout,", workout.workout.id);
  }, [workout]);
  return (
    <Card className="items-center gap-4 flex flex-1 py-2 ">
      <CardHeader className="justify-center w-full ">
        <CardTitle>Total Volume</CardTitle>
      </CardHeader>
      <CardContent className="flex-row flex items-center gap-3">
        <div className="bg-primary/30 rounded-full flex p-2">
          <Dumbbell color="var(--primary)" />
        </div>
        {total && total}
      </CardContent>
    </Card>
  );
}
export default TotalVolume;
