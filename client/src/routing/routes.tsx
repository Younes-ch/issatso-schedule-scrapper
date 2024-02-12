import AvailableClassrooms from "@/pages/AvailableClassrooms";
import ClassroomAvailability from "@/pages/ClassroomAvailability";
import Error from "@/pages/Error";
import Home from "@/pages/Home";
import Layout from "@/pages/Layout";
import Schedules from "@/pages/Schedules";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "schedules", element: <Schedules /> },
      { path: "classrooms/available", element: <AvailableClassrooms /> },
      { path: "classrooms/availability", element: <ClassroomAvailability /> },
      { path: "*", element: <Error /> },
    ],
  },
]);

export default router;
