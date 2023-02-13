import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { utf8ToBytes, hexToBytes, toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Transfer({ address, setBalance, signature, setSignature }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function onChange(evt) {
    const signature = evt.target.value;
    setSignature(signature);
  }

  async function transfer(evt) {
    evt.preventDefault();
    let address_check;
    if (signature.match(/[0-9A-F]{65}/i)) {
      const recoveryBit = parseInt(signature.slice(-1).toString(10));

      address_check = secp.recoverPublicKey(
        keccak256(utf8ToBytes("Hello World")),
        hexToBytes(signature.slice(0, -1)),
        recoveryBit
      );
      address_check = "0x" + toHex(keccak256(address_check)).slice(-40);
    }

    if (address == address_check) { // not clean but stops transfers when signature is not correct
      console.log('ok')
      try {
        const {
          data: { balance },
        } = await server.post(`send`, {
          sender: address,
          amount: parseInt(sendAmount),
          recipient,
        });
        setBalance(balance);
      } catch (ex) {
        alert(ex.response.data.message);
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
        Signature
        <input
          placeholder="Enter your signature"
          value={signature}
          onChange={onChange}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
