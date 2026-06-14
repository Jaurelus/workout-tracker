import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

function Chart() {
  const [volumes, setVolumes] = useState(null);
  const [foci, setTopFoci] = useState(null);
  const [focusSelected, setFocusSelected] = useState([
    true,
    false,
    false,
    false,
    false,
  ]);
  const getVolumesbyFocus = async (focus?: string) => {
    const response = await fetch(
      focus
        ? `http://localhost:5117/getVolumesByFocus?focus=${encodeURIComponent(focus)}`
        : "http://localhost:5117/getVolumesByFocus",
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        credentials: "include",
      },
    );
    const data = await response.json();
    if (response.ok) {
      setVolumes(data);
    } else {
      toast.error("Failed to load chart data");
    }
  };
  const getTopFoci = async () => {
    const response = await fetch("http://localhost:5117/getTopFoci", {
      headers: { "Content-Type": "application/json" },
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
      setTopFoci(data);
    } else {
      toast.error("Failed to load focus data");
    }
  };
  useEffect(() => {
    getVolumesbyFocus();
    getTopFoci();
  }, []);
  return (
    <div className="w-full h-full">
      <Card className="bg-primary flex w-full h-full py-0! pl-3!">
        <Card className="bg-primary-foreground  p-2 flex w-full h-full ml-3 rounded-none">
          <CardHeader>
            <CardTitle>
              <h1 className="text-2xl text-white">Chart</h1>
            </CardTitle>
            {foci && (
              <ButtonGroup className="">
                {foci[0] && (
                  <Button
                    onClick={() => {
                      setFocusSelected((prev) =>
                        prev.map((item, i) => (i == 0 ? true : false)),
                      );
                      getVolumesbyFocus(foci[0]);
                    }}
                    variant="outline"
                    className={`${focusSelected[0] ? "!bg-primary" : "bg-primary-foreground"} border-white text-white`}
                  >
                    {foci[0]}
                  </Button>
                )}
                {foci[1] && (
                  <Button
                    onClick={() => {
                      setFocusSelected((prev) =>
                        prev.map((item, i) => (i == 1 ? true : false)),
                      );
                      getVolumesbyFocus(foci[1]);
                    }}
                    variant="outline"
                    className={`${focusSelected[1] ? "!bg-primary" : "bg-primary-foreground"} border-white text-white`}
                  >
                    {foci[1]}
                  </Button>
                )}
                {foci[2] && (
                  <Button
                    onClick={() => {
                      setFocusSelected((prev) =>
                        prev.map((item, i) => (i == 2 ? true : false)),
                      );
                      getVolumesbyFocus(foci[2]);
                    }}
                    variant="outline"
                    className={`${focusSelected[2] ? "!bg-primary" : "bg-primary-foreground"} border-white text-white`}
                  >
                    {foci[2]}
                  </Button>
                )}
                {foci[3] && (
                  <Button
                    onClick={() => {
                      setFocusSelected((prev) =>
                        prev.map((item, i) => (i == 3 ? true : false)),
                      );
                      getVolumesbyFocus(foci[3]);
                    }}
                    variant="outline"
                    className={`${focusSelected[3] ? "!bg-primary" : "bg-primary-foreground"} border-white text-white`}
                  >
                    {foci[3]}
                  </Button>
                )}
                {foci[4] && (
                  <Button
                    onClick={() => {
                      setFocusSelected((prev) =>
                        prev.map((item, i) => (i == 4 ? true : false)),
                      );
                      getVolumesbyFocus(foci[4]);
                    }}
                    variant="outline"
                    className={`${focusSelected[4] ? "!bg-primary" : "bg-primary-foreground"} border-white text-white`}
                  >
                    {foci[4]}
                  </Button>
                )}
              </ButtonGroup>
            )}
          </CardHeader>
          <CardContent className="w-full flex flex-1">
            {volumes && (
              <AreaChart data={volumes} width={"100%"}>
                <Area
                  dataKey={"volume"}
                  fill="var(--primary)"
                  stroke="var(--primary)"
                ></Area>
                <XAxis
                  padding={{ left: 12 }}
                  dataKey={"date"}
                  tick={{ fill: "#ffffff", fontSize: 10 }}
                ></XAxis>
                <YAxis tick={{ fill: "#ffffff" }}></YAxis>
              </AreaChart>
            )}
          </CardContent>
        </Card>
      </Card>
    </div>
  );
}

export default Chart;
