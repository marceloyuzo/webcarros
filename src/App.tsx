import { createBrowserRouter } from "react-router-dom"
import { Home } from "./pages/home"
import { Login } from "./pages/login"
import { Register } from "./pages/register"
import { Dashboard } from "./pages/dashboard"
import { NewCar } from "./pages/dashboard/new"
import { CarDetail } from "./pages/car"
import { Layout } from "./components/Layout/Layout"
import { Private } from "./routes/Private"

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/car/:id",
        element: <CarDetail/>
      },
      {
        path: "/dashboard",
        element: <Private><Dashboard/></Private>
      },
      {
        path: "/dashboard/new",
        element: <Private><NewCar/></Private>
      }
    ]
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/login",
    element: <Login/>
  }
])

export {router}