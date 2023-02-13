import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [signature, setSignature] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="app">
      <Wallet
        address={address}
        setAddress={setAddress}
        balance={balance}
        setBalance={setBalance}
      // signature={signature}
      // setSignature={setSignature}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        signature={signature}
        setSignature={setSignature}
      />
    </div>
  );
}

export default App;