import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

function LastWorkout() {
  const [workout, setWorkout] = useState(null);
  const [volumes, setVolumes] = useState();
  //--------- API CALL ------------
  const getLatestWorkout = async () => {
    const response = await fetch("http://localhost:5117/getLatestWorkout", {
      headers: { "Content-Type": "application/json" },
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
      setWorkout(data);
    } else {
      toast.error("Failed to load last workout");
    }
  };
  useEffect(() => {
    getLatestWorkout();
  }, []);

  const getVolumesByExercise = async (wid) => {
    if (!wid) return;
    const response = await fetch(
      `http://localhost:5117/getVolumeByExercise?wid=${wid}`,
      { headers: { "Content-Type": "application/json" }, method: "GET", credentials: "include" },
    );
    const data = await response.json();
    if (response.ok) {
      setVolumes(data);
    } else {
      toast.error("Failed to load exercise volumes");
    }
  };
  useEffect(() => {
    if (!workout) return;
    getVolumesByExercise(workout.id);
  }, [workout]);
  //--------- APP BUILD --------
  return (
    <div className="w-full h-full">
      <Card className="bg-primary flex w-full h-full py-0! pl-3!">
        <Card className="bg-primary-foreground p-2 flex w-full h-full ml-3 rounded-none">
          {workout && (
            <CardHeader>
              <CardTitle className="mb-2">
                <h1 className="text-2xl text-white">Last Workout</h1>
              </CardTitle>
              <p className="">{workout.focus}</p>
              <p className="">{workout.date.slice(0, 10)}</p>
            </CardHeader>
          )}
          <CardContent className="justify-center items-center flex">
            {volumes && (
              <BarChart
                margin={{ bottom: 25 }}
                className="w-full flex flex-1 p-3"
                width={"100%"}
                height={300}
                data={volumes}
              >
                <Bar
                  dataKey="exerciseVolume"
                  fill="var(--primary)"
                  className="mb-0"
                ></Bar>
                <CartesianGrid />
                <XAxis
                  className=""
                  dataKey={"exerciseName"}
                  tick={{ fill: "#ffffff" }}
                  label={{
                    fontWeight: "bold",
                    fontSize: 20,
                    value: "Exercise",
                    offset: 4,
                    position: "bottom",
                    fill: "#ffffff",
                  }}
                ></XAxis>
                <YAxis
                  className=""
                  tick={{ fill: "#ffffff" }}
                  label={{
                    fontWeight: "bold",
                    fontSize: 20,

                    value: "Volume",
                    offset: 2,
                    position: "left",
                    fill: "#ffffff",
                    angle: -90,
                  }}
                ></YAxis>
              </BarChart>
            )}
          </CardContent>
        </Card>
      </Card>
    </div>
  );
}

export default LastWorkout;
