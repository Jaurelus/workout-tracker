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
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditExerciseModalProp {
  visibility: OnBeforeUnloadEventHandlerNonNull;
  changeVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  selectedExercise: Record<string, any>;
}
function EditExerciseModal({
  visibility,
  changeVisibility,
  selectedExercise,
}: EditExerciseModalProp) {
  const [eName, setEName] = useState(selectedExercise.name);
  const [ePrimary, setEPrimary] = useState(selectedExercise.primary.join(","));
  const [eSecondary, setESecondary] = useState(
    selectedExercise.secondary.join(","),
  );
  const [eTips, seteTips] = useState(selectedExercise.tips);
  const [changes, setChanges] = useState(false);

  //-------------- API CALL -----------------
  const editExercise = async (eID) => {
    const response = await fetch(
      `http://localhost:5117/editExercise?eID=${eID}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify({
          id: selectedExercise.id,
          name: eName,
          primary: ePrimary ? ePrimary.split(",") : [ePrimary],
          secondary: eSecondary ? eSecondary.split(",") : [eSecondary],
          tips: eTips ? eTips.split("\n") : [eTips],
        }),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      toast.error("Failed to edit exercise, please try again");
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
          <AlertDialogTitle className="mt-3">Edit an Exercise</AlertDialogTitle>
        </AlertDialogHeader>

        {/* Input boxes */}

        {/* Exercise Name */}

        <Field>
          <FieldLabel htmlFor="eName">Exercise Name</FieldLabel>
          <Input
            id="eName"
            value={eName}
            placeholder="Enter the name of the exercise"
            onChange={(e) => {
              setEName(e.target.value);
              setChanges(true);
            }}
          />
        </Field>

        {/* Exercise Primary Muscle */}

        <Field>
          <FieldLabel htmlFor="primary">Primary Muscle</FieldLabel>
          <Input
            value={ePrimary}
            id="primary"
            placeholder="List the primary muscles targeted separated by a comma"
            onChange={(e) => {
              setChanges(true);
              setEPrimary(e.target.value);
            }}
          />
        </Field>

        {/* Exercise Secondary Muscle */}

        <Field>
          <FieldLabel htmlFor="secondary">Secondary Muscle</FieldLabel>
          <Input
            value={eSecondary}
            id="secondary"
            placeholder="List the secondary muscles targeted separated by a comma"
            onChange={(e) => {
              setChanges(true);

              setESecondary(e.target.value);
            }}
          />
        </Field>

        {/* Exercise Tips */}

        <Field>
          <FieldLabel htmlFor="tips">Tips</FieldLabel>
          <Textarea
            value={eTips}
            className="border-primary"
            id="tips"
            placeholder="List any tips, ending each tip by pressing the Enter/Return key"
            onChange={(e) => {
              setChanges(true);

              seteTips(e.target.value);
            }}
          />
        </Field>

        <AlertDialogFooter className="w-3/4 items-center justify-center flex flex-1 ml-auto mr-auto">
          <AlertDialogAction
            size="lg"
            disabled={!changes}
            className="bg-primary !rounded-lg text-white flex flex-1"
            onClick={() => {
              editExercise(selectedExercise.id);
              changeVisibility((prev) => !prev);
            }}
          >
            <SendHorizonal />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditExerciseModal;
