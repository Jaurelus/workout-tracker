import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface AddExerciseModalProp {
  visibility: OnBeforeUnloadEventHandlerNonNull;
  changeVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}
function AddExerciseModal({
  visibility,
  changeVisibility,
}: AddExerciseModalProp) {
  const [eName, setEName] = useState("");
  const [ePrimary, setEPrimary] = useState("");
  const [eSecondary, setESecondary] = useState("");
  const [eTips, seteTips] = useState("");

  //-------------- API CALL -----------------
  const addExercise = async () => {
    const response = await fetch("http://localhost:5117/addExercise", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        name: eName,
        primary: ePrimary ? ePrimary.split(",") : [ePrimary],
        secondary: eSecondary ? eSecondary.split(",") : [eSecondary],
        tips: eTips ? eTips.split("\n") : [eTips],
      }),
    });
    const data = await response.json();
    if (response.status == 201) {
      console.log("Success\n", data);
    } else {
      console.log(response.body);
    }
  };

  //--------------- APP BUILD ---------------
  return (
    <AlertDialog open={visibility}>
      <AlertDialogContent>
        <AlertDialogHeader className="relative justify-center">
          <AlertDialogCancel
            onClick={() => {
              changeVisibility((prev) => !prev);
            }}
            size="xs"
            className="!bg-primary !rounded-full absolute -right-4 -top-4"
          >
            X
          </AlertDialogCancel>
          <AlertDialogTitle className="mt-3">Add an Exercise</AlertDialogTitle>
        </AlertDialogHeader>

        {/* Input boxes */}

        {/* Exercise Name */}

        <Field>
          <FieldLabel htmlFor="eName">Exercise Name</FieldLabel>
          <Input
            id="eName"
            placeholder="Enter the name of the exercise"
            onChange={(e) => {
              setEName(e.target.value);
            }}
          />
        </Field>

        {/* Exercise Primary Muscle */}

        <Field>
          <FieldLabel htmlFor="primary">Primary Muscle</FieldLabel>
          <Input
            id="primary"
            placeholder="List the primary muscles targeted separated by a comma"
            onChange={(e) => {
              setEPrimary(e.target.value);
            }}
          />
        </Field>

        {/* Exercise Secondary Muscle */}

        <Field>
          <FieldLabel htmlFor="secondary">Secondary Muscle</FieldLabel>
          <Input
            id="secondary"
            placeholder="List the secondary muscles targeted separated by a comma"
            onChange={(e) => {
              setESecondary(e.target.value);
            }}
          />
        </Field>

        {/* Exercise Tips */}

        <Field>
          <FieldLabel htmlFor="tips">Tips</FieldLabel>
          <Textarea
            id="tips"
            placeholder="List any tips, ending each tip by pressing the Enter/Return key"
            onChange={(e) => {
              seteTips(e.target.value);
            }}
          />
        </Field>

        <AlertDialogFooter className="w-3/4 items-center justify-center flex flex-1 ml-auto mr-auto">
          <AlertDialogAction
            size="lg"
            disabled={eName ? false : true}
            className="!bg-green-500 !rounded-lg text-white flex flex-1"
            onClick={addExercise}
          >
            +
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AddExerciseModal;
