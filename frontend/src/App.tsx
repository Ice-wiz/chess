import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./screens/Landing";
import { Game } from "./screens/Game";
import { SoundProvider } from "./context/SoundContext";

function App() {
  return (
    <>
      <SoundProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/Game" element={<Game />} />
          </Routes>
        </BrowserRouter>
      </SoundProvider>
    </>
  );
}

export default App;
