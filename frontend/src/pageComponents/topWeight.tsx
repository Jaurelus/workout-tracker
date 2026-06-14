import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

function TopWeight(workout: any) {
  const [topweight, settopweight] = useState(null);
  const [topSetE, setTopSetE] = useState("");

  const getTopSets = async (wid: Number) => {
    const response = await fetch(`http://localhost:5117/getTopSet?wID=${wid}`, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
      console.log("TOP WEIGHT ----------", data);
      setTopSetE(data[0].exercises.name);
      settopweight(data[0].weight);
    } else console.log(data);
  };
  useEffect(() => {
    if (!workout) return;
    getTopSets(workout.workout.id);
  }, [workout]);
  //------------- APP BUILD ------------------
  return (
    <Card className="items-center gap-4 flex flex-1 py-2!">
      <CardHeader className="justify-center flex  w-full">
        <CardTitle>Top Weight</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row items-center gap-3">
        <div className="bg-primary/30 rounded-full flex p-2">
          <Trophy color="var(--primary)" />
        </div>

        {topweight}
      </CardContent>
      <CardFooter className="">{topSetE}</CardFooter>
    </Card>
  );
}

export default TopWeight;
