import "./App.css";
import { Redeem } from "./pages";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import NavBar from "./components/NavBar";
import { mode } from "@chakra-ui/theme-tools";

function App() {
  const [accounts, setAccounts] = useState([]);

  return (
    <div className="App">
      <Router>
        {/* <NavBar /> */}
        <NavBar accounts={accounts} setAccounts={setAccounts} />
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/Mint" element={<Mint />} /> */}
          <Route path="/Redeem" element={<Redeem />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

// import { useState } from "react";
// import "./App.css";
// import MainMint from "./MainMint";
// import NavBar from "./NavBar";

// function App() {
//   const [accounts, setAccounts] = useState([]);

//   return (
//     <div className="overlay">
//       <div className="App">
//         <div className="App">
//           <NavBar accounts={accounts} setAccounts={setAccounts} />
//           <MainMint accounts={accounts} setAccounts={setAccounts} />
//         </div>
//         <div className="moving-background"> </div>
//       </div>
//     </div>
//   );
// }

// export default App;
