import react from "react";
import { Route, Routes } from "react-router-dom";
import App from "../src/App";
import Appp from "../src/pages/addExercise";
import LogWorkout from "@/pages/logWorkout";
import ViewPast from "@/pages/viewPast";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/addExercise" element={<Appp />} />
    <Route path="/logWorkout" element={<LogWorkout />} />
    <Route path="/pastWorkouts" element={<ViewPast />} />
  </Routes>
);

export default AppRoutes;
