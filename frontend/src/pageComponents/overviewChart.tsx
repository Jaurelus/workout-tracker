import { Card, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

function OverviewChart() {
  return (
    <Card className="min-h-100 items-center flex flex-1 w-full shadow-lg shadow-primary mb-3">
      <CardTitle>Volume Over Time</CardTitle>
      <ResponsiveContainer className="w-full h-full px-5">
        <AreaChart
          width={800}
          height={300}
          data={[
            { date: "5/7", volume: 3500 },
            { date: "5/8", volume: 4000 },
            { date: "5/9", volume: 4000 },
            { date: "5/10", volume: 4100 },
            { date: "5/11", volume: 4200 },
            { date: "5/12", volume: 4300 },
            { date: "5/13", volume: 4400 },
            { date: "5/14", volume: 4500 },
          ]}
        >
          <XAxis dataKey="date" niceTicks="snap125"></XAxis>

          <YAxis width="auto" niceTicks="snap125" domain={["3000", "5000"]} />

          <Area
            className="w-full h-full"
            dataKey="volume"
            stroke="#d23f2f"
            fill="#d23f2f60"
          ></Area>
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
export default OverviewChart;
