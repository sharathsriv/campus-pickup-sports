import { useState } from "react";
import Login from "./pages/Login";
import Games from "./pages/Games";
import CreateGame from "./pages/CreateGame";

export default function App() {
  const [screen, setScreen] = useState("login"); // "login" | "games" | "createGame"
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (newUser) => {
    setUser(newUser);
    setScreen("games");
  };

  const handleGoToCreateGame = () => {
    setScreen("createGame");
  };

  const handleBackToGames = () => {
    setScreen("games");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FE" }}>
      {screen === "login" && <Login onLoginSuccess={handleLoginSuccess} />}

      {screen === "games" && (
        <Games currentUser={user} onCreateGameClick={handleGoToCreateGame} />
      )}

      {screen === "createGame" && (
        <CreateGame currentUser={user} onBack={handleBackToGames} />
      )}
    </div>
  );
}