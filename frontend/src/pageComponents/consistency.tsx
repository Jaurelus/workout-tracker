import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Consistency() {
  const [weekWorkouts, setWeekWorkouts] = useState(null);
  const [workDays, setWorkDays] = useState([]);

  const mapDays = () => {
    let mapped = weekWorkouts.map(
      (workout) => (new Date(workout.date).getDay() + 6) % 7,
    );
    return mapped;
  };
  //----------- API CALL ------------

  const getWeekWorkouts = async (weekStart, weekEnd) => {
    const response = await fetch(
      `http://localhost:5117/getWorkoutsBetween?weekStart=${weekStart}&weekEnd=${weekEnd}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        credentials: "include",
      },
    );
    const data = await response.json();
    if (response.ok) {
      setWeekWorkouts(data);
    } else toast.error("Failed to load weekly workouts");
  };
  useEffect(() => {
    //Find the beginning and end of the week based
    {
      let today = new Date();
      let start = new Date();
      let end = new Date();

      let daysTillStart = today.getDay() - 1;
      let daysTillEnd = 7 - today.getDay();
      start.setDate(today.getDate() - daysTillStart);
      end.setDate(today.getDate() + daysTillEnd);
      getWeekWorkouts(
        start.toISOString().slice(0, 10),
        end.toISOString().slice(0, 10),
      );
      //getWeekWorkouts("2026-05-04", "2026-05-10");
    }
  }, []);
  useEffect(() => {
    if (!weekWorkouts) return;
    setWorkDays(mapDays());
  }, [weekWorkouts]);
  //----------- APP BUILD ------------
  return (
    <div className="w-full h-full flex flex-1">
      <Card className="bg-primary flex w-full h-full py-0! pl-3!">
        <Card className="bg-primary-foreground flex-1 flex w-full h-full ml-3 rounded-none">
          <CardHeader>
            <h1 className="text-2xl text-white">This Week</h1>
          </CardHeader>
          <CardContent className="flex-row flex mt-auto mb-auto w-full justify-center ml-0 pl-2.5!">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                className="flex-row flex items-center justify-center"
                key={index}
              >
                <div className=" border-primary border w-5 h-0 mt-auto mb-auto"></div>
                <div
                  className=" border-primary border rounded-4xl w-10 h-10 flex items-center justify-center"
                  style={{
                    backgroundColor: workDays.includes(index)
                      ? "#008000"
                      : "#616161",
                  }}
                >
                  <Check
                    style={{
                      color: workDays.includes(index) ? "#ffffff" : "#616161",
                    }}
                  />
                </div>
                <div className=" border-primary border w-5 h-0 mt-auto mb-auto"></div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex-col items-center justify-center">
            <h2>
              You went to the gym {workDays.length} time
              {workDays.length != 1 ? "s" : ""} this week
            </h2>
            {workDays.length < 3 && (
              <h2>
                {3 - workDays.length} more time
                {3 - workDays.length == 1 ? "" : "s"} to make it to 3 times this
                week
              </h2>
            )}
            {workDays.length > 3 && (
              <h2>Woohoo! Goal of 3 times per week hit!</h2>
            )}
          </CardFooter>
        </Card>
      </Card>
    </div>
  );
}

export default Consistency;
