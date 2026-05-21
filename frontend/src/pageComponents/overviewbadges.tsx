import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

function OverviewBadges(wid: Number) {
  const [totalExercises, setTotalExercises] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  const wID = wid;

  const getTotalSetCount = async (wID: Number) => {
    const response = await fetch(
      `http://localhost:5117/getTotalSets/?wID=${wID}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      },
    );
    const data = await response.json();
    if (response.ok) {
      console.log("Set", data);
      setTotalSets(data);
    }
  };
  const getTotalExerciseCount = async (wID: Number) => {
    const response = await fetch(
      `http://localhost:5117/getTotalExercises/?wID=${wID}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      },
    );
    const data = await response.json();
    if (response.ok) {
      console.log("Exercise", data);

      setTotalExercises(data);
    }
  };
  useEffect(() => {
    if (!wID) return;
    getTotalExerciseCount(wID);
    getTotalSetCount(wID);
  }, [wID]);

  return (
    <div>
      <Badge> exercises</Badge>
      <Badge> sets</Badge>
    </div>
  );
}
export default OverviewBadges;
