import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  EllipsisVertical,
  Pencil,
  Trash2,
  Undo2,
  ChevronDownIcon,
} from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  Combobox,
  ComboboxInput,
} from "@/components/ui/combobox";
import TotalVolume from "@/pageComponents/totalVolumeCard";
import OverviewBadges from "@/pageComponents/overviewbadges";
import TopWeight from "@/pageComponents/topWeight";
import OverviewChart from "@/pageComponents/overviewChart";
import OverviewIntense from "@/pageComponents/overviewIntense";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function WorkoutOverview() {
  const { id } = useParams();
  const [workout, setWorkout] = useState();
  const [sets, setSets] = useState();
  const groupedSets = useRef([]);
  const [, forceUpdate] = useState(0);
  const [setExerciseTotal, setSetExerciseTotal] = useState([]);
  const [weightExercisesTotal, setWeightExercisesTotal] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);

  //Edit APi const
  const [date, setDate] = useState(new Date());
  const [focusInput, setFocusInput] = useState("");
  const setRows = useRef([[{ key: 1 }]]);
  const [exerciseRow, addExerciseRow] = useState([{ key: 1 }]);
  const exerciseInputs = useRef([]);
  const wsetExercises = useRef([]);
  const [addExerciseVis, setAddExerciseVis] = useState(false);
  const [anyEmpty, setAnyEmpty] = useState(true);
  const weight = useRef<string[][]>([[], []]);
  const reps = useRef<string[][]>([[], []]);
  const [exercises, setExercises] = useState([]);
  const [newSetAdded, setNewSetAdded] = useState(false);
  const [workoutChanged, setWorkoutChanged] = useState(false);
  const [setsChanged, setSetsChanged] = useState(false);
  const [sqlAddComplete, setSqlAddComplete] = useState(false);
  const updatedSets = useRef<
    Record<number, { weight?: string; reps?: string; exerciseName?: string }>
  >({});
  const [setDeleted, setSetDeleted] = useState(false);
  const navigate = useNavigate();

  const addExercise = () => {
    setRows.current.push([{ key: 1 }]);
    weight.current.push([]);
    reps.current.push([]);

    addExerciseRow((prev) => [...prev, { key: prev.length + 1 }]);
  };

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
      setAnyEmpty(empty);
    }, 0);
  };

  const addSet = (index, setNum) => {
    let curr = setRows.current[index - 1];
    setRows.current[index - 1] = [...curr, { key: setNum + 1 }];
    if (!weight.current[index]) weight.current[index] = [];
    if (!reps.current[index]) reps.current[index] = [];
    weight.current[index][setNum + 1] = "";
    reps.current[index][setNum + 1] = "";
    forceUpdate((prev) => prev + 1);
  };

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

  const getTotals = () => {
    if (!groupedSets) return;
    groupedSets.current.forEach((exercise, index) => {
      //Add stuff for each column
      //Push sum to variables
    });
  };
  const groupSets = () => {
    if (!sets) return;
    groupedSets.current = [];
    sets.forEach((set, index) => {
      if (
        !groupedSets.current.some(
          (group) => group[0]?.exercises?.id === set.exercises?.id,
        )
      ) {
        let exerciseID = set.exercises.id;
        let group = sets.filter((set) => set.exercises.id == exerciseID);
        groupedSets.current.push(group);
      }
    });
  };
  useEffect(() => {
    groupSets();
    forceUpdate((prev) => prev + 1);
    console.log(groupedSets.current);
  }, [sets]);

  //--------- API CALL -----------
  const exerciseExists = async (exerciseName: string) => {
    const response = await fetch(
      `http://localhost:5117/exerciseExists?exerciseName=${exerciseName}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      },
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.log("error" + data);
    }
  };
  const addExerciseSQL = async (eName) => {
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
    if (response.ok) {
      console.log(" Add SQL Success\n", data);
    } else {
      console.log(response.body);
    }
  };

  const getWorkoutInfo = async () => {
    console.log("ID");

    if (!id) return;
    console.log(id, typeof id);

    const response = await fetch(
      `http://localhost:5117/getOneWorkout?id=${id}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      },
    );
    const data = await response.json();
    if (response.ok) {
      console.log("workout Success ", data);
      setWorkout(data);
    } else {
      console.log("Error", data);
    }
  };

  useEffect(() => {
    getWorkoutInfo();
    getSets();
  }, [id]);
  useEffect(() => {
    if (!workout) return;
    setFocusInput(workout.focus);
    setDate(new Date(workout.date));
  }, [workout]);
  const getSets = async () => {
    const response = await fetch(
      `http://localhost:5117/getSetByWID/?wID=${id}`,
      { headers: { "Content-Type": "application/json" }, method: "GET" },
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
    if (!sqlAddComplete) return;

    getSets();
    setSqlAddComplete(false);
  }, [sqlAddComplete]);
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
  const editWorkoutSQL = async () => {
    const response = await fetch(`http://localhost:5117/editWorkout`, {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify({
        date: date,
        focus: focusInput,
        id: workout.id,
      }),
    });
    if (response.ok) {
      console.log("Workout succesfully edited");
      await getWorkoutInfo();
      setEditMode(false);
    } else {
      console.log("Error editing workout");
    }
  };
  const editSetSQL = async (
    weightIteration: Number,
    repIteration: Number,
    exerciseIteration: string,
    workoutID: Number,
    setID: Number,
  ) => {
    const exists = await exerciseExists(exerciseIteration);
    if (!exists) {
      await addExerciseSQL(exerciseIteration);
    }
    const response = await fetch("http://localhost:5117/editSet", {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify({
        exercises: {
          id: exists ? exists : await exerciseExists(exerciseIteration),
        },
        reps: repIteration,
        weight: weightIteration,
        wID: workoutID,
        Id: setID,
      }),
    });
    if (response.ok) {
      console.log("Set Updated");
      await getSets();
    } else {
      console.log("Error updating sets");
    }
  };
  const addSetSQL = async (
    weightIteration: Number,
    repIteration: Number,
    exerciseIteration: string,
    workoutID: Number,
  ) => {
    const exists = await exerciseExists(exerciseIteration);
    if (!exists) {
      await addExerciseSQL(exerciseIteration);
    }
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
  const deleteSetSQL = async (sID) => {
    const response = await fetch(`http://localhost:5117/deleteSet?sID=${sID}`, {
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    });
    if (response.ok) {
      console.log("Success deleting the set ");
      setSetDeleted(true);
    } else {
      console.log("Error deleting set");
    }
  };
  useEffect(() => {
    if (!setDeleted) return;
    getSets();
    setSetDeleted(false);
  }, [setDeleted]);

  const deleteWorkout = async () => {
    const response = await fetch(
      `http://localhost:5117/deleteWorkout?wid=${id}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      },
    );
    if (response.ok) {
      console.log("Success deleting the workout ");
    } else {
      console.log("Error deleting workout");
    }
  }; //-------- APP BUILD -------------
  return (
    <div className="w-screen bg-background h-screen flex flex-1 justify-center items-center">
      {workout && (
        <div className=" relative h-full w-full flex flex-1 flex-col p-10 gap-5 justify-start">
          <Card className=" items-start w-full flex relative  min-h-40">
            {!editMode ? (
              <CardHeader className="w-full">
                <p className="text-secondary editable">
                  {new Date(workout.date).toLocaleDateString()}
                </p>
                <CardTitle className="font-bold text-4xl editable">
                  {workout.focus}
                </CardTitle>
              </CardHeader>
            ) : (
              <div className="flex absolute flex-col ml-5 gap-3">
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
                      onSelect={(selectedDate) => {
                        setDate(selectedDate);
                        setWorkoutChanged(true);
                      }}
                      defaultMonth={date}
                    />
                  </PopoverContent>
                </Popover>

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
                        className="border-primary infoInput w-full"
                        showTrigger={false}
                        value={focusInput || workout.focus}
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
                          setWorkoutChanged(true);
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
                              setWorkoutChanged(true);
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
              </div>
            )}
            <div className="w-full flex  flex-1 relative">
              <ButtonGroup className="absolute right-3 bottom-5">
                <Button
                  variant="outline"
                  className="border-primary!"
                  onClick={() => {
                    setEditMode((prev) => !prev);
                  }}
                >
                  {!editMode && <Pencil />}
                  {editMode && <Undo2 />}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className=" rounded-xl p-2  bg-[color-mix(in_srgb,var(--primary),var(--background)_60%)] text-primary [a]:hover:bg-primary/80 border-primary">
                      <Trash2 className="text-primary" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="items-center flex justify-center flex-col">
                    <AlertDialogTitle>
                      Are you sure you want to delete this workout ?
                    </AlertDialogTitle>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="text-white!"
                        onClick={async () => {
                          await deleteWorkout(Number(id));
                          navigate("/pastWorkouts");
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </ButtonGroup>
            </div>
            <CardContent>
              <OverviewBadges wid={id} />
            </CardContent>
          </Card>
          <OverviewChart id={id} />
          <div className="flex-row flex flex-1 justify-between gap-5 max-h-32">
            <TotalVolume workout={workout} />
            <TopWeight workout={workout} />
            <OverviewIntense workout={workout} />
          </div>
          {/* Map exercises */}
          <div className="gap-5 flex flex-1 flex-col">
            {groupedSets.current.map((group, index) => (
              <Card key={index} className="flex flex-col flex-1 mb-10">
                <CardHeader className="justify-between flex-row flex-1">
                  {!editMode ? (
                    <CardTitle>{group[0].exercises.name}</CardTitle>
                  ) : (
                    <Input
                      className=""
                      defaultValue={group[0].exercises.name}
                      onInput={(e) => {
                        group.forEach((set) => {
                          updatedSets.current[set.id] = {
                            ...updatedSets.current[set.id],
                            exerciseName: e.target.value,
                          };
                        });
                        setSetsChanged(true);
                      }}
                    />
                  )}
                  <div className="flex gap-5">
                    {group[0].exercises.primary.length > 0 && (
                      <Badge>{group[0].exercises.primary}</Badge>
                    )}
                    {group[0].exercises.secondary.length > 0 && (
                      <Badge>{group[0].exercises.secondary}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <Table className=" text-center">
                    <TableHeader className="">
                      <TableRow className="">
                        <TableHead className="text-center">#</TableHead>
                        <TableHead className="text-center">Weight</TableHead>
                        <TableHead className="text-center">Reps</TableHead>
                        {editMode && <TableHead></TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="jusitfy-center items-center">
                      {groupedSets.current[index].map((set, setIndex) => (
                        <TableRow
                          key={setIndex}
                          className="jusitfy-center items-center"
                        >
                          <TableCell className="jusitfy-center items-center">
                            <p className="editable"> {setIndex + 1}</p>
                          </TableCell>
                          <TableCell>
                            {!editMode ? (
                              <p className="editable"> {set.weight}</p>
                            ) : (
                              <Input
                                className="w-1/6"
                                defaultValue={set.weight}
                                onInput={(e) => {
                                  setSetsChanged(true);
                                  updatedSets.current[set.id] = {
                                    ...updatedSets.current[set.id],
                                    weight:
                                      e.target.value.trim() == ""
                                        ? "0"
                                        : e.target.value.trim(),
                                  };
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {!editMode ? (
                              <p className="editable"> {set.reps}</p>
                            ) : (
                              <Input
                                className="w-1/6"
                                defaultValue={set.reps}
                                onInput={(e) => {
                                  setSetsChanged(true);
                                  updatedSets.current[set.id] = {
                                    ...updatedSets.current[set.id],
                                    reps: e.target.value,
                                  };
                                }}
                              />
                            )}
                          </TableCell>
                          {editMode && (
                            <TableCell>
                              <Button className=" rounded-xl p-2  bg-[color-mix(in_srgb,var(--primary),var(--background)_60%)] text-primary [a]:hover:bg-primary/80 border-primary">
                                <Trash2
                                  className="text-primary"
                                  onClick={() => {
                                    deleteSetSQL(set.id);
                                  }}
                                />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
            {editMode && (
              <Card className="mb-8">
                <CardHeader className="text-center">
                  <CardTitle>Add New Sets?</CardTitle>
                </CardHeader>
                <CardContent>
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
                              exerciseInputs.current[exercise.key] =
                                e.target.value;
                            }}
                          >
                            <ComboboxInput
                              value={
                                exerciseInputs.current[exercise.key] ||
                                undefined
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
                              className="flex-row flex justify-between px-12 w-full mb-3"
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
                                    setNewSetAdded(true);
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
                                    setNewSetAdded(true);
                                  }}
                                ></Input>
                              </div>
                            </div>

                            <div className="flex justify-between">
                              {chunk.key ==
                                setRows.current[exercise.key - 1].length && (
                                <Button
                                  variant="ghost"
                                  className="hover:bg-transparent! flex ml-5"
                                  onClick={() => {
                                    addSet(exercise.key, chunk.key);
                                    setAnyEmpty(true);
                                  }}
                                >
                                  Add Set?
                                </Button>
                              )}
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
                          setAnyEmpty(true);

                          setAddExerciseVis(false);
                        }}
                      >
                        Add Exercise?
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="gap-5 flex flex-1 flex-col"></div>
        </div>
      )}
      {editMode && (
        <div className="fixed w-full bottom-0 px-10  ">
          <Button
            className="flex flex-1  w-full  text-white"
            disabled={!(newSetAdded || workoutChanged || setsChanged)}
            onClick={async () => {
              setEditMode(false);

              if (newSetAdded) {
                for (let i = 1; i < weight.current.length; i++) {
                  for (let j = 1; j < weight.current[i].length; j++) {
                    await addSetSQL(
                      Number(weight.current[i][j]),
                      Number(reps.current[i][j]),
                      exerciseInputs.current[i],
                      workout.id,
                    );
                  }
                }
                setSqlAddComplete(true);
              }
              if (workoutChanged) {
                editWorkoutSQL();
              }
              if (setsChanged) {
                const setIds = Object.keys(updatedSets.current).map(Number);
                for (let i = 0; i < setIds.length; i++) {
                  const setId = setIds[i];
                  const update = updatedSets.current[setId];
                  const original = sets.find((s) => s.id === setId);
                  await editSetSQL(
                    update.weight ?? original.weight,
                    update.reps ?? original.reps,
                    update.exerciseName ?? original.exercises.name,
                    workout.id,
                    setId,
                  );
                }
                getSets();
              }
            }}
          >
            Submit Edits
          </Button>
        </div>
      )}
    </div>
  );
}
export default WorkoutOverview;
