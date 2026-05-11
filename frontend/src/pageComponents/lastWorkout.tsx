import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

function LastWorkout() {
  const [workout, setWorkout] = useState(null);
  //--------- API CALL ------------
  const getLatestWorkout = async () => {
    const response = await fetch("http://localhost:5117/getLatestWorkout", {
      headers: { "Content-Type": "applcation/json" },
      method: "GET",
    });
    const data = await response.json();
    if (response.ok) {
      console.log("Success retrieiving last wokrout", data);
      setWorkout(data);
    } else {
      console.log("Error retrieiving last wokrout", data);
    }
  };
  useEffect(() => {
    getLatestWorkout();
  }, []);
  //--------- APP BUILD --------
  return (
    <div className="w-full h-full">
      <Card className="bg-primary flex w-full h-full py-0! pl-3!">
        <Card className="bg-primary-foreground  p-2 flex w-full h-full ml-3 rounded-none">
          {workout && (
            <CardHeader>
              <CardTitle className="mb-2">
                <h1 className="text-2xl text-white">Last Workout</h1>
              </CardTitle>
              <p>{workout.focus}</p>
            </CardHeader>
          )}
        </Card>
      </Card>
    </div>
  );
}

export default LastWorkout;
