import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import ErrorPage from "../Pages/ErrorPage";
import HomePage from "../Pages/HomePage";
import UpcomingEvents from "../Pages/UpcomingEvents";
import Register from "../Pages/Register";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import CreateEvent from "../Pages/CreateEvent";
import ManageEvents from "../Pages/ManageEvents";
import JoinedEvents from "../Pages/JoinedEvents";
import Signin from "../Pages/Signin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/upcoming-events",
        element: <UpcomingEvents />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Register />,
      },

      {
        path: "/create-event",
        element: (
          <PrivateRoute>
            <CreateEvent />
          </PrivateRoute>
        ),
      },
      {
        path: "/manage-events",
        element: (
          <PrivateRoute>
            <ManageEvents />
          </PrivateRoute>
        ),
      },
      {
        path: "/joined-events",
        element: (
          <PrivateRoute>
            <JoinedEvents />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
