import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BrickWallFire,
  ChartColumnIncreasing,
  History,
  NotebookPen,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
function LandingPage() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-screen h-screen flex flex-col flex-1 items-center p-5 justify-between py-10">
        <div className=" text-center">
          <h1 className=" text-6xl">Workbench</h1>
          <h2>Fitness Companion App</h2>
        </div>
        <ResponsiveContainer width={900} height={350} className={"flex flex-1"}>
          <AreaChart
            margin={{ bottom: 10, left: 15, right: 10 }}
            data={[
              { date: "05/05/26", volume: 3500 },
              { date: "05/06/26", volume: 3050 },

              { date: "05/06/26", volume: 3750 },
              { date: "05/07/26", volume: 4000 },
            ]}
          >
            <XAxis
              dataKey={"date"}
              label={{ value: "Date", position: "insideBottom", offset: -5 }}
            ></XAxis>
            <YAxis
              label={{
                value: "Volume",
                position: "insideLeft",
                offset: -1,
                textAnchor: "middle",
                angle: -90,
              }}
            ></YAxis>
            <Line></Line>
            <Area
              type={"monotone"}
              stroke="var(--primary)"
              fill="var(--primary)"
              fillOpacity={0.3}
              dataKey={"volume"}
            ></Area>
          </AreaChart>
        </ResponsiveContainer>
        <h1> The better way to track your workouts</h1>
        <Link className="w-1/4" to="/login">
          <Button className="text-white! w-full">Log In</Button>
        </Link>
        <div className="flex-row flex w-full justify-center gap-5">
          <Card className="flex flex-1 items-center">
            <CardHeader className="w-full flex flex-col items-center">
              <NotebookPen />
              <CardTitle className="text-center">Log Workouts</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/30">
              Save, the date, set, focus, and reps.
            </CardContent>
          </Card>
          <Card className="flex flex-1 items-center">
            <CardHeader className="w-full flex flex-col items-center">
              <History />
              <CardTitle>Review History</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/30">
              Any session at any time.
            </CardContent>
          </Card>
          <Card className="flex flex-1 items-center">
            <ChartColumnIncreasing />
            <CardHeader className="w-full flex flex-col items-center">
              <CardTitle>See your stats</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/30">
              Volume, intensity, PRS.
            </CardContent>
          </Card>
          <Card className="flex flex-1 items-center">
            <BrickWallFire />
            <CardHeader className="w-full flex flex-col items-center">
              <CardTitle>Stay consistent</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/30">
              Track gym attendance and streaks.
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default LandingPage;
