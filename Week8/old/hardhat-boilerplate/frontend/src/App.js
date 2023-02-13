import "./App.css";
import { Home, Mint, Redeem } from "./pages";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import { mode } from "@chakra-ui/theme-tools";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Mint" element={<Mint />} />
          <Route path="/Redeem" element={<Redeem />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
