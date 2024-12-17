import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import CreateTestPage from "./components/CreateTestPage";
import Homepage from "./components/Homepage";
import TakeTestPage from "./components/TakeTestPage";
import Navbar from "./components/Navbar";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Navbar />
          <Homepage />
        </div>
      ),
    },
    {
      path: "/create-test",
      element: (
        <div>
          <Navbar />
          <CreateTestPage />
        </div>
      ),
    },
    {
      path: "/take-test",
      element: (
        <div>
          <Navbar />
          <TakeTestPage />
        </div>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
