import react from "react";
import { Route, Routes } from "react-router-dom";
import App from "../src/App";
import Appp from "../src/pages/addExercise";
import LogWorkout from "@/pages/logWorkout";
import ViewPast from "@/pages/viewPast";
import WorkoutOverview from "@/pages/workoutOverview";
import LandingPage from "@/pages/landingPage";
import LoginPage from "@/pages/loginpage";
import RegisterPage from "@/pages/registerpage";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />

    <Route path="/home" element={<App />} />
    <Route path="/addExercise" element={<Appp />} />
    <Route path="/logWorkout" element={<LogWorkout />} />
    <Route path="/pastWorkouts" element={<ViewPast />} />
    <Route path="/pastWorkouts/workout/:id" element={<WorkoutOverview />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
  </Routes>
);

export default AppRoutes;
