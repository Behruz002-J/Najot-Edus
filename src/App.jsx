import { RouterProvider } from "react-router-dom";
import { route } from "./router";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={route} />
    </LanguageProvider>
  );
}

export default App;

