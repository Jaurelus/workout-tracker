import { Card } from "@/components/ui/card";

function Motivation() {
  return (
    <div className="w-full h-full">
      <Card className="bg-primary flex w-full h-full py-0! pl-3!">
        <Card className="bg-primary-foreground  p-2 flex w-full h-full ml-3 rounded-none">
          <h1 className="text-2xl text-white">Motivation</h1>
        </Card>
      </Card>
    </div>
  );
}

export default Motivation;
