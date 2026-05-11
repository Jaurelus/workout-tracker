import { use, useEffect, useRef, useState } from "react";

import "../App.css";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupAction,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { Check, ChevronDownIcon } from "lucide-react";

import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "../components/mode-toggle";
import { Button } from "../components/ui/button";

import { Link } from "react-router-dom";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import MySidebar from "@/pageComponents/sidebar";

function LogWorkout() {
  const [date, setDate] = useState(new Date());
  const [focus, setFocus] = useState<string>("");
  const [vis, setVis] = useState(false);
  const [setRow, addSetRow] = useState([{ key: 1 }]);
  const [exerciseRow, addExerciseRow] = useState([{ key: 1 }]);
  const exerciseRows = useRef([{ key: 1, sets: 1 }]);

  const setRows = useRef([[{ key: 1 }]]);
  const [focusInput, setFocusInput] = useState("");
  const exerciseInputs = useRef({});

  const [exercises, setExercises] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const weight = useRef<string[][]>([[], []]);
  const reps = useRef<string[][]>([[], []]);
  const wsetExercises = useRef([]);
  const [addExerciseVis, setAddExerciseVis] = useState(false);
  const [logDisabled, setlogDisabled] = useState(false);

  const [existVariable, setexistVariable] = useState("");

  const [eName, setEName] = useState("");
  const [, forceUpdate] = useState(0);
  const [anyEmpty, setAnyEmpty] = useState(true);
  const [latestWorkout, setLatestWorkout] = useState();
  const [recentData, setRecentData] = useState();
  const foci = [
    "Push (Chest, Tricep, Shoulders",
    "Pull (Back, Bicep)",
    "Chest & Back",
    "Shoulders & Arms",
    "Upper",
    "Lower",
    "Legs(Overall)",
    "Legs(Glute Focused)",
    "Legs(Quad Focused)",
    "Legs(Hamstring Focused)",
    "Abs",
  ];

  const checkAnyEmpty = (int?) => {
    setTimeout(() => {
      let emptySet = [...document.querySelectorAll(".noFocus")]
        .filter((input) => !(input as HTMLInputElement).disabled)
        .some((input) => input.value?.trim() === "");
      if (!emptySet) {
        setAddExerciseVis(true);
      }
      let empty = [...document.querySelectorAll(".infoInput")]
        .filter((input) => !(input as HTMLInputElement).disabled)
        .some((input) => input.value?.trim() === "");
      if (!empty) {
        setAnyEmpty(empty);
      }
    }, 0);
  };
  const addSet = (index, setNum) => {
    let curr = setRows.current[index - 1];
    setRows.current[index - 1] = [...curr, { key: setNum + 1 }];
    forceUpdate((prev) => prev + 1);
  };

  const addExercise = () => {
    setRows.current.push([{ key: 1 }]);
    addExerciseRow((prev) => [...prev, { key: prev.length + 1 }]);
  };
  //------------- API CALL -------------

  const addExerciseSQL = async () => {
    if (!eName) {
      return;
    }
    const response = await fetch("http://localhost:5117/addExercise", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        name: eName,
      }),
    });
    const data = await response.json();
    if (response.status == 201) {
      console.log(" Add SQL Success\n", data);
    } else {
      console.log(response.body);
    }
  };

  const exerciseExists = async (exerciseName: string) => {
    console.log("Exercise Name: " + exerciseName);
    setEName(exerciseName);
    const response = await fetch(
      `http://localhost:5117/exerciseExists?exerciseName=${exerciseName}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      },
    );
    const data = await response.json();
    if (response.ok) {
      console.log("Success " + data);
      return data;
    } else {
      console.log("error" + data);
    }
  };

  const getExerciseNames = async () => {
    const response = await fetch("http://localhost:5117/getExerciseNames", {
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (response.ok) {
      setExercises(data);
    }
  };

  useEffect(() => {
    getExerciseNames();
  }, []);
  useEffect(() => {
    if (!recentData) return;

    getLatestWorkoutSQL();
  }, [recentData]);
  useEffect(() => {
    if (!latestWorkout || !recentData) return;
    for (let i = 0; i < weight.current.length; i++) {
      for (let j = 0; j < weight.current[i].length; j++) {
        addSetSQL(
          Number(weight.current[i][j]),
          Number(reps.current[i][j]),
          exerciseInputs.current[i],
          latestWorkout?.id,
        );
      }
    }
  }, [latestWorkout]);

  const addSetSQL = async (
    weightIteration: Number,
    repIteration: Number,
    exerciseIteration: string,
    workoutID: Number,
  ) => {
    const response = await fetch("http://localhost:5117/addSet", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        exercises: { name: exerciseIteration },
        name: exerciseIteration,
        reps: repIteration,
        weight: weightIteration,
        wID: workoutID,
      }),
    });
    const data = await response.json();
    if (response.status == 201) {
      console.log("Success logging SET SQL\n", data);
    } else {
      console.log("Error logging set", data);
    }
  };

  const addWorkoutSQL = async () => {
    const response = await fetch("http://localhost:5117/addWorkout", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        Date: date,
        Focus: focusInput,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log("Successful workout log ");
      console.log(data);
      setRecentData(data);
    } else console.log("Error " + data);
  };

  const getLatestWorkoutSQL = async () => {
    const response = await fetch("http://localhost:5117/getLatestWorkout", {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });
    const data = await response.json();
    if (response.ok) {
      console.log("Latest Workout", data);
      setLatestWorkout(data);
    } else {
      console.log(data);
    }
  };
  //------------- APP BUILD ------------
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider className="text-center">
        <MySidebar />

        <SidebarTrigger></SidebarTrigger>

        <main className="w-screen flex flex-col flex-1 items-center p-5">
          <h1 className="text-4xl">Log A New Workout</h1>
          <div className="absolute right-3">
            <ModeToggle />
          </div>

          <Card className="w-[75%] mt-5 pb-12">
            <CardHeader></CardHeader>
            <CardContent className="w-full">
              {/*----------------  Date ----------------*/}
              <Field>
                <FieldLabel>Date</FieldLabel>
                <Popover>
                  <PopoverTrigger className="border-primary!" asChild>
                    <Button
                      variant="outline"
                      data-empty={!date}
                      className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                      <ChevronDownIcon color="#d23f2f" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0  border-2"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      defaultMonth={date}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              {/* ---------------- Focus ----------------*/}
              <Field className="w-full mt-3">
                <FieldLabel className="">Focus</FieldLabel>
                <div className="gap-0 w-full">
                  <Combobox items={foci}>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setFocusInput(filteredList[0]);
                      }}
                    >
                      <ComboboxInput
                        id="focuss"
                        className="border-primary infoInput"
                        showTrigger={false}
                        value={focusInput || undefined}
                        onInput={(e) => {
                          let str = e.target.value;
                          setFocusInput(str);
                          let filtered = foci.filter((item) => {
                            if (
                              item.toLowerCase().includes(str.toLowerCase())
                            ) {
                              console.log("Yes", str, item);
                            }
                          });
                          setFilteredList(filtered);

                          console.log(filtered + "\n");
                          checkAnyEmpty();
                        }}
                        onSubmit={(e) => {
                          e.preventDefault();
                          setFocusInput(e.target.value);
                          console.log("Fil");
                          console.log("Hi");
                        }}
                      ></ComboboxInput>
                    </form>
                    <ComboboxContent className="">
                      <ComboboxEmpty>
                        <ComboboxList>
                          <ComboboxItem>{focusInput}</ComboboxItem>
                        </ComboboxList>
                      </ComboboxEmpty>
                      <ComboboxList className=" [&_svg]:text-secondary">
                        {(item) => (
                          <ComboboxItem
                            onClick={() => {
                              setFocusInput(item);
                              checkAnyEmpty();
                            }}
                            className=""
                            key={item}
                            value={item}
                          >
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </Field>
              <Separator className="my-5"></Separator>
              <h1 className="my-5">Exercises</h1>
              {/*---------------- Exercises ---------------- */}
              {exerciseRow.map((exercise) => (
                <Field key={exercise.key} className="flex-row w-full mb-14">
                  <div className="flex-col w-[75%] ">
                    <FieldLabel className="mb-2">Exercise Name</FieldLabel>
                    <Combobox
                      items={
                        filteredExercises.length > 0
                          ? filteredExercises
                          : exercises
                      }
                    >
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          exerciseInputs.current[exercise.key] = e.target.value;
                        }}
                      >
                        <ComboboxInput
                          value={
                            exerciseInputs.current[exercise.key] || undefined
                          }
                          onBlur={(e) => {
                            wsetExercises.current[exercise.key] =
                              e.target.value;
                          }}
                          className="border-primary  infoInput"
                          showTrigger={false}
                          onInput={(e) => {
                            let str = e.target.value;
                            exerciseInputs.current[exercise.key] =
                              e.target.value;
                            exerciseInputs.current[exercise.key] = str;
                            let filtered = exercises.filter((exercise) =>
                              exercise
                                .toLowerCase()
                                .includes(str.toLowerCase()),
                            );

                            setFilteredExercises(filtered);
                            checkAnyEmpty();
                          }}
                        ></ComboboxInput>
                      </form>
                      <ComboboxContent className="">
                        <ComboboxEmpty>
                          <ComboboxList>
                            <ComboboxItem
                              onSelect={(e) => {
                                console.log(e);
                                wsetExercises.current[exercise.key] =
                                  e.target.value;
                              }}
                            >
                              {exerciseInputs.current[exercise.key]}
                            </ComboboxItem>
                          </ComboboxList>
                        </ComboboxEmpty>
                        <ComboboxList className=" [&_svg]:text-secondary">
                          {(item) => (
                            <ComboboxItem
                              onClick={(e) => {
                                exerciseInputs.current[exercise.key] = item;
                                forceUpdate((prev) => prev + 1);
                                checkAnyEmpty();
                              }}
                              className=""
                              key={item}
                              value={item}
                            >
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                  {/* ---------------- Set Info ---------------- */}
                  <div className="flex-col">
                    {setRows.current[exercise.key - 1].map((chunk) => (
                      <div className="flex-col flex" key={chunk.key}>
                        <div
                          key={chunk.key}
                          className="flex-row flex justify-between px-12 w-full "
                        >
                          <div className="relative w-1/4 flex-col flex">
                            <FieldLabel className="mb-2 justify-center items-center">
                              Set
                            </FieldLabel>
                            <Input
                              size={2}
                              disabled={true}
                              placeholder={chunk.key.toString()}
                              className="w-8 infoInput noFocus"
                            ></Input>

                            <div className="absolute -bottom-8 ml-auto mr-auto -left-6"></div>
                            <div id="dynamicSetAdd"></div>
                          </div>
                          <div className="flex-col flex">
                            <FieldLabel className="mb-2">Weight</FieldLabel>
                            <Input
                              placeholder=""
                              className="w-16 infoInput noFocus"
                              onInput={(e) => {
                                weight.current[exercise.key][chunk.key] =
                                  e.target.value;
                                checkAnyEmpty();
                              }}
                            ></Input>
                          </div>
                          <div className="flex-col flex">
                            <FieldLabel className="mb-2">Reps</FieldLabel>
                            <Input
                              className="w-12 infoInput noFocus"
                              onInput={(e) => {
                                reps.current[exercise.key][chunk.key] =
                                  e.target.value;
                                checkAnyEmpty();
                              }}
                            ></Input>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <Button
                            variant="ghost"
                            className="hover:bg-transparent! flex ml-5"
                            onClick={() => {
                              addSet(exercise.key, chunk.key);
                              setlogDisabled(false);
                            }}
                          >
                            Add Set?
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type={"button"}
                      size="xs"
                      className="bg-primary rounded-full mr-14 mt-2"
                      onClick={async () => {
                        setAddExerciseVis(true);
                      }}
                    >
                      <Check color="white" />
                    </Button>
                  </div>
                </Field>
              ))}
              <div>
                {addExerciseVis && (
                  <Button
                    variant="ghost"
                    className="hover:bg-transparent! "
                    onClick={() => {
                      addExercise();
                      setAddExerciseVis(false);
                    }}
                  >
                    Add Exercise?
                  </Button>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-center mt-5">
              <Button
                className="text-white w-full"
                disabled={anyEmpty || focusInput.trim() === ""}
                onClick={async () => {
                  await addWorkoutSQL();
                }}
              >
                Log Workout
              </Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default LogWorkout;
