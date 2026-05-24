import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flame } from "lucide-react";
import { useEffect, useState } from "react";

function OverviewIntense({ workout }: { workout: any }) {
  const [topSet, setTopSet] = useState();

  const getTopSet = async (wid: number) => {
    const response = await fetch(
      `http://localhost:5117/getTopVolumeSet?wid=${wid}`,
      { headers: { "Content-Type": "application/json" }, method: "GET" },
    );
    const data = await response.json();
    if (response.ok) {
      setTopSet(data[0]);
      console.log("INTENSE ------");
      console.log(data[0]);
    } else console.log(data[0]);
  };

  useEffect(() => {
    if (!workout) return;
    console.log(workout.id);
    getTopSet(workout.id);
  }, [workout]);
  //--------- APP BUILD
  return (
    <Card className=" items-center gap-4 flex flex-1 py-2">
      <CardHeader className="justify-center w-full">
        <CardTitle>Most Intense Set</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        {topSet && (
          <div className="flex gap-3 items-center">
            <div className="bg-primary/30 rounded-full flex p-2">
              <Flame color="var(--primary)" />
            </div>
            {topSet && topSet?.volume}
          </div>
        )}
      </CardContent>
      {topSet && <CardFooter> {topSet && topSet?.exerciseName}</CardFooter>}
    </Card>
  );
}

export default OverviewIntense;
