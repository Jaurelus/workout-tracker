import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Motivation() {
  const [workoutDates, setWorkoutDates] = useState(null);
  const [mappedDates, setMappedDates] = useState([]);
  const [offset, setOffset] = useState(0);
  const daysinMonth = () => {
    let tdy = new Date();
    tdy.setMonth(new Date().getMonth() + 1);

    tdy.setDate(0);
    return tdy.getDate();
  };
  const getWorkoutsofMonth = async () => {
    let b =
      String(new Date().getFullYear()) +
      "-" +
      String(new Date().getMonth() + 1).padStart(2, "0") +
      "-01";
    let e =
      String(new Date().getFullYear()) +
      "-" +
      String(new Date().getMonth() + 1).padStart(2, "0") +
      "-" +
      String(daysinMonth());
    const response = await fetch(
      `http://localhost:5117/getMonthWorkouts?monthBegin=${b}&monthEnd=${e}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        credentials: "include",
      },
    );
    const data = await response.json();
    if (response.ok) {
      setWorkoutDates(data);
    } else toast.error("Failed to load monthly workouts");
  };
  const mapFirstDay = () => {
    let first = new Date();
    first.setDate(1);
    setOffset(first.getDay());
  };
  useEffect(() => {
    getWorkoutsofMonth();
    mapFirstDay();
  }, []);

  const mapDates = () => {
    let sliced = workoutDates.map((workout) => Number(workout.slice(3, 5)));
    setMappedDates(sliced);
  };
  useEffect(() => {
    if (!workoutDates) return;
    mapDates();
  }, [workoutDates]);
  return (
    <div className="w-full h-full">
      <Card className="bg-primary flex w-full h-full py-0! pl-3!">
        <Card className="bg-primary-foreground  p-2 flex w-full h-full ml-3 rounded-none ">
          <CardHeader>
            <h1 className="text-2xl text-white">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
              })}
            </h1>
          </CardHeader>

          {
            <CardContent className="grid grid-cols-7  mt-auto mb-auto gap-5">
              <p>S</p>

              <p>M</p>
              <p>T</p>
              <p>W</p>
              <p>TH</p>
              <p>F</p>
              <p>S</p>

              {Array.from({ length: daysinMonth() + offset }, (_, i) =>
                i < offset ? (
                  <div
                    className={`w-10 h-10 rounded-xl  ${"bg-primary-foreground"}`}
                    key={i}
                  ></div>
                ) : (
                  <div
                    className={`w-10 h-10 rounded-xl border border-white ${mappedDates.includes(i - offset + 1) ? "bg-primary" : "bg-primary-foreground"}`}
                    key={i}
                  ></div>
                ),
              )}
            </CardContent>
          }
        </Card>
      </Card>
    </div>
  );
}

export default Motivation;
