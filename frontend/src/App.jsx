import { useState } from "react";
import Login from "./pages/Login";
import Games from "./pages/Games";

function App() {
  const [screen, setScreen] = useState("login");

  const handleLoginSuccess = () => {
    setScreen("games");
  };

  return (
    <>
      {screen === "login" && <Login onLoginSuccess={handleLoginSuccess} />}
      {screen === "games" && <Games />}
    </>
  );
}

export default App;
