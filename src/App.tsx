import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LapsoProvider } from "@shared/context/LapsoContext";

export default function App() {
  return (
    <LapsoProvider>
      <RouterProvider router={router} />
    </LapsoProvider>
  );
}
