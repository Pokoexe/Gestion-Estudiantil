import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LapsoProvider } from "./context/LapsoContext";

export default function App() {
  return (
    <LapsoProvider>
      <RouterProvider router={router} />
    </LapsoProvider>
  );
}
