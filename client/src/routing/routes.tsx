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
    errorElement: <Error header="Error" message="Something went wrong" />,
    children: [
      { index: true, element: <Home /> },
      { path: "schedules", element: <Schedules /> },
      { path: "classrooms/available", element: <AvailableClassrooms /> },
      { path: "classrooms/availability", element: <ClassroomAvailability /> },
    ],
  },
  { path: "*", element: <Error header="404" message="Page not found" /> },
]);

export default router;
