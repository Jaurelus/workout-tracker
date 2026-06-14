import { Card, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

function OverviewChart({ id }: { id: number }) {
  const [sets, setSets] = useState();
  const [chrtData, setchrtData] = useState();
  const getSets = async () => {
    const response = await fetch(
      `http://localhost:5117/getSetByWID/?wID=${id}`,
      { headers: { "Content-Type": "application/json" }, method: "GET", credentials: "include" },
    );
    const data = await response.json();
    if (response.ok) {
      console.log("Success sets ", data);
      setSets(data);
    } else {
      console.log("Error", data);
    }
  };
  useEffect(() => {
    getSets();
  }, []);
  useEffect(() => {
    if (!sets) return;
    let chrtData = sets.map(({ exercises, reps, weight }) => ({
      name: exercises.name,
      volume: reps * weight,
    }));
    chrtData = Object.values(
      chrtData.reduce((total, current) => {
        if (total[current.name]) {
          total[current.name].volume += current.volume;
        } else
          total[current.name] = { name: current.name, volume: current.volume };
        return total;
      }, {}),
    );
    console.log("Chart shi", chrtData);

    setchrtData(chrtData);
  }, [sets]);

  return (
    <Card className="min-h-100 items-center flex flex-1 w-full shadow-lg shadow-primary mb-3">
      <CardTitle>Volume Over Time</CardTitle>
      {chrtData && (
        <ResponsiveContainer className="w-full h-full px-5">
          <RadarChart width={800} height={500} data={chrtData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} />

            <Radar
              className="w-full h-full"
              dataKey="volume"
              stroke="#d23f2f"
              fill="#d23f2f60"
            ></Radar>
          </RadarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
export default OverviewChart;
