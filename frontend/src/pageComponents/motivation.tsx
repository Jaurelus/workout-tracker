import { Card, CardContent } from "@/components/ui/card";

function Motivation() {
  return (
    <div className="w-full h-full">
      <Card className="bg-primary flex w-full h-full py-0! pl-3!">
        <Card className="bg-primary-foreground  p-2 flex w-full h-full ml-3 rounded-none">
          <h1 className="text-2xl text-white">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
            })}
          </h1>
          <CardContent></CardContent>
        </Card>
      </Card>
    </div>
  );
}

export default Motivation;
