import { useEffect, useState } from "react";

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
import { ChevronDownIcon } from "lucide-react";

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

function LogWorkout() {
  const [date, setDate] = useState(new Date());
  const [focus, setFocus] = useState<string>("");
  const [vis, setVis] = useState(false);
  const [setRow, addSetRow] = useState([{ key: 1 }]);
  const [exerciseRow, addExerciseRow] = useState([{ key: 1 }]);
  const [focusInput, setFocusInput] = useState("");
  const [exerciseInput, setExerciseInput] = useState("");

  const [exercises, setExercises] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);

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
  const filterPopover = () => {
    const fPopover = document.getElementById("focusPopover");

    let results = fPopover.getHTML().split("</p>");
    results.pop();
    const sliced = results.map((result) => {
      return result.slice(3);
    });

    if (focus) {
      fPopover.innerHTML = "";

      let filtered = sliced.filter((slice) => slice.includes(focus));
      console.log("Sliced", sliced);
      console.log("Filter", filtered);
      filtered.forEach((item) => {
        console.log(item);
        fPopover.innerHTML = `<p>${item}</p>`;
        console.log("Pop", fPopover.innerHTML);
      });
    }
    console.log("HTML", fPopover.innerHTML);
  };

  const addSet = () => {
    addSetRow((prev) => [...prev, { key: prev.length + 1 }]);
  };

  const addExercise = () => {
    addExerciseRow((prev) => [...prev, { key: prev.length + 1 }]);
  };
  //------------- API CALL -------------
  const getExerciseNames = async () => {
    const response = await fetch("http://localhost:5117/getExerciseNames", {
      headers: { "Contet-Type": "application/json" },
    });
    const data = await response.json();
    if (response.ok) {
      console.log("Success");
      setExercises(data);
    }
  };
  useEffect(() => {
    getExerciseNames();
  }, []);
  //------------- APP BUILD ------------
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider className="text-center">
        <Sidebar
          variant="sidebar"
          className="flex-row flex-1 flex justify-between"
        >
          <SidebarHeader className="py-8 font-bold text-xl">
            <Link to="/">Work</Link>
          </SidebarHeader>
          <SidebarContent className="mt-12">
            <SidebarMenu className="gap-8">
              <SidebarMenuItem>
                <Link to="/logWorkout">
                  <Button variant="ghost">Log a New Workout</Button>
                </Link>
                <SidebarMenuAction></SidebarMenuAction>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/addExercise">
                  <Button variant="ghost">Add a new exercise </Button>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/pastWorkouts">
                  <Button variant="ghost"> View Past Workouts</Button>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger></SidebarTrigger>

        <main className="w-screen flex flex-col flex-1 items-center p-5">
          <h1 className="text-4xl">Log A New Workout</h1>
          <div className="absolute right-3">
            <ModeToggle />
          </div>
          <Card className="w-[75%] mt-5 pb-12">
            <CardHeader></CardHeader>
            <CardContent className="w-full">
              {/* Date*/}
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
              {/* Focus */}
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
                        className="border-primary"
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
                        }}
                        onSubmit={(e) => {
                          e.preventDefault();
                          setFocusInput(filteredList[0]);
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
              {/* Exercise 1*/}
              {exerciseRow.map((exercise) => (
                <Field key={exercise.key} className="flex-row w-full mb-5">
                  <div className="flex-col w-[75%]">
                    <FieldLabel className="mb-2">Exercise Name</FieldLabel>
                    <Combobox items={exercises || []}>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setExerciseInput(filteredExercises[0]);
                        }}
                      >
                        <ComboboxInput
                          value={exerciseInput || undefined}
                          className="border-primary"
                          showTrigger={false}
                          onInput={(e) => {
                            let str = e.target.value;
                            setExerciseInput(str);
                            let filtered = exercises.filter((exercise) => {
                              if (
                                exercise
                                  .toLowerCase()
                                  .includes(str.toLowerCase())
                              )
                                console.log(exercise);
                              return exercise;
                            });
                            setFilteredExercises(filtered);
                          }}
                          onSubmit={() => {}}
                        ></ComboboxInput>
                      </form>
                      <ComboboxContent className="">
                        <ComboboxEmpty>
                          <ComboboxList>
                            <ComboboxItem>{exerciseInput}</ComboboxItem>
                          </ComboboxList>
                        </ComboboxEmpty>
                        <ComboboxList className=" [&_svg]:text-secondary">
                          {(item) => (
                            <ComboboxItem
                              onClick={() => {
                                setExerciseInput(item);
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
                  {/*Everything but exercise name */}
                  <div className="flex-row">
                    {setRow.map((set) => (
                      <div
                        key={set.key}
                        className="flex-row flex justify-between px-12 w-full "
                      >
                        <div className="relative w-1/4 flex-col flex">
                          <FieldLabel className="mb-2 justify-center items-center">
                            Set
                          </FieldLabel>
                          <Input
                            size={2}
                            disabled={true}
                            placeholder={set.key.toString()}
                            className="w-8"
                          ></Input>

                          <div className="absolute -bottom-8 ml-auto mr-auto -left-6"></div>
                          <div id="dynamicSetAdd"></div>
                        </div>
                        <div className="">
                          <FieldLabel className="mb-2">Weight</FieldLabel>
                          <Input placeholder="" className="w-16"></Input>
                        </div>
                        <div className="">
                          <FieldLabel className="mb-2">Reps</FieldLabel>
                          <Input className="w-12"></Input>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent! flex ml-5"
                      onClick={() => {
                        addSet();
                      }}
                    >
                      Add Set?
                    </Button>
                  </div>
                </Field>
              ))}
              <Button
                variant="ghost"
                className="hover:bg-transparent! "
                onClick={() => {
                  addExercise();
                }}
              >
                Add Exercise?
              </Button>
            </CardContent>
            <CardFooter className="justify-center mt-5">
              <Button className="text-white w-full">Log Workout</Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default LogWorkout;
