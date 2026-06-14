import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

function OverviewBadges({ wid }: { wid: Number }) {
  const [totalExercises, setTotalExercises] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  console.log("tHE WIDS", wid);

  const getTotalSetCount = async (wID: Number) => {
    if (!wID) return;
    console.log("SEts resp---------------------");

    const response = await fetch(
      `http://localhost:5117/getTotalSets/?wID=${wid}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        credentials: "include",
      },
    );
    const data = await response.json();
    if (response.ok) {
      console.log("Set", data);
      setTotalSets(data);
    }
  };
  const getTotalExerciseCount = async (wID: Number) => {
    if (!wID) return;

    const response = await fetch(
      `http://localhost:5117/getTotalExercises/?wID=${wid}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        credentials: "include",
      },
    );
    const data = await response.json();
    if (response.ok) {
      console.log("Exercise", data);

      setTotalExercises(data);
    }
  };
  useEffect(() => {
    if (!wid) return;
    getTotalExerciseCount(wid);
    getTotalSetCount(wid);
  }, [wid]);

  return (
    <div>
      <Badge>{totalExercises} exercises</Badge>
      <Badge>{totalSets} sets</Badge>
    </div>
  );
}
export default OverviewBadges;
