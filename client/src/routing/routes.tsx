import Error from "@/pages/Error";
import Home from "@/pages/Home";
import Layout from "@/pages/Layout";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "*", element: <Error /> },
    ],
  },
]);

export default router;