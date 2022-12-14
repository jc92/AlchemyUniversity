import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useEffect, useState } from "react";
// import { search } from "@primer/octicons";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

console.log(process.env.REACT_APP_ALCHEMY_API_KEY);
// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function Blocklist(blockNumber) {
  async function getblocks() {
    let blockno = blockNumber.blockNumber;

    let mytable = `<h4 className="App">Transactions</h4> <table className="table text-center"> 
    <thead className="thead-dark text-center"><tr>
    <th scope="col">Block number</th>
    <th scope="col">Hash  </th>
    <th scope="col">Transactions Count </th>
    </tr></thead>
    <tbody>`;

    for (let i = blockno - 3; i <= blockno; i++) {
      let block = await alchemy.core.getBlock(i);
      console.log("loading block " + i);
      mytable += `<tr><td class="text-danger">${i}</td><td class="text-primary">${block.hash}</td><td class="text-right font-weight-bold">${block.transactions.length}</td></tr>`;
    }

    mytable += "</tbody></table>";

    document.getElementById("blockhistory").innerHTML = mytable;
  }
  getblocks();

  return <div id="blockhistory"></div>;
}

function Txofadd(address) {
  async function gettx(address) {
    let mytransactions = [];
    const data = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: address.address,
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
    });

    let transfers = data.transfers;
    var mytable = `<h4 className="App">Transactions</h4> <table className="table text-center"> 
        <thead className="thead-dark text-center"><tr>
        <th scope="col">Block </th>
        <th scope="col">Transaction  </th>
        <th scope="col">From  </th>
        <th scope="col">To  </th>
        <th scope="col">Asset  </th>
        <th scope="col">Value  </th>
        </tr></thead>
        <tbody>`;

    for (var CELL of transfers) {
      mytable += `<tr> 
            <th scope="row">${CELL.blockNum}</th>
            <td class="text-primary">${CELL.hash}</td>
            <td>${"/" + CELL.from.substring(0, 20) + "..."}</td>
            <td>${"/" + CELL.to || "nobody".substring(0, 20) + "..."}</td>
            <td>${CELL.asset}</td>
            <td>${Math.floor(CELL.value * 100) / 100}</td>
        </tr>`;
    }

    mytable += "</tbody></table>";

    document.getElementById("display2").innerHTML = mytable;
  }
  gettx(address);
}

function Tx(txhash) {
  let transactionhash = txhash.txhash;

  async function listtx() {
    const tx = await alchemy.core.getTransaction(
      "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"
    );

    let mytable = `<div>`;
    Object.keys(tx).forEach((key) => {
      mytable += `<div ><span class="text-danger">${key}:</span>${tx[key]}</div>`;
    });
    // let mytable = `<h4 className="text-center">Block details</h4> <table className="table"><tbody>`;
    // mytable+=`<tr> <th scope="row">Hash   </th> <td>${blocks.hash}</td></tr>`
    // mytable+=`<tr> <th scope="row">Number  </th> <td>${blocks.number}</td></tr>`
    // mytable+=`<tr> <th scope="row">Timestamp   </th> <td>${blocks.timestamp}</td></tr>`
    // mytable+=`<tr> <th scope="row">Transactions   </th> <td>${blocks.transactions.map((tx)=>tx.hash+'<br>')}</td></tr>`
    mytable += "</div>";

    document.getElementById("display1").innerHTML = mytable;
  }
  listtx();

  return (
    <div clasName="container">
      <h4 className="App">Transaction detail</h4>
    </div>
  );
}

function Blocks(blockNumber) {
  let blocknu = blockNumber.blockNumber;

  async function listblocks() {
    const blocks = await alchemy.core.getBlockWithTransactions(blocknu);
    let mytable = `<h4 className="text-center">Block details</h4> <table className="table"><tbody>`;
    mytable += `<tr> <th scope="row">Hash   </th> <td>${blocks.hash}</td></tr>`;
    mytable += `<tr> <th scope="row">Number  </th> <td>${blocks.number}</td></tr>`;
    mytable += `<tr> <th scope="row">Timestamp   </th> <td>${blocks.timestamp}</td></tr>`;
    mytable += `<tr> <th scope="row">Transactions   </th> <td>${blocks.transactions.map(
      (tx) => tx.hash + "<br>"
    )}</td></tr>`;
    mytable += "</tbody></table>";
    document.getElementById("display1").innerHTML = mytable;
  }
  listblocks();

  return (
    <div clasName="container">
      <h4 className="App">Blocks</h4>
      <div className="App ">Current Block {blockNumber.blockNumber}</div>
    </div>
  );
}
function App() {
  const setValue = (setter) => (evt) => setter(evt.target.value);

  const [blockNumber, setBlockNumber] = useState();
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState();
  const [tokenbalances, setTokenBalance] = useState();

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  });
  //get account balance
  async function getBal() {
    let balance = await alchemy.core.getBalance(address, "latest");
    balance = Utils.formatEther(balance).slice(0, 5);
    setBalance(balance);

    let tokenbalance = await alchemy.core.getTokenBalances(address);
    let balances = [];
    tokenbalance.tokenBalances.forEach((token) => {
      if (parseInt(token.tokenBalance, 16) > 100000) {
        balances.push(token);
      }
    });

    let tokenbalances = [];
    for (let i = 0; i < balances.length; i++) {
      let token = await alchemy.core.getTokenMetadata(
        balances[i].contractAddress
      );
      let tokenbalance = parseInt(balances[i].tokenBalance, 16) / 1000000;
      //let tokenbalance = Utils.formatEther(balances[i].tokenBalance).slice(0,10);

      if (tokenbalance > 1000000) {
        tokenbalance = tokenbalance / Math.pow(10, 12);
      }
      tokenbalance = Math.floor(Math.round(tokenbalance * 100)) / 100;

      tokenbalances.push([`${token.symbol}`, tokenbalance]);
    }

    setTokenBalance(tokenbalances);
    console.log(tokenbalances);

    var mytable = `<h4 className="text-center">Account Overview</h4> <table className="table"> <thead><tr><th scope="col">Token</th><th scope="col">Balance</th></tr></thead><tbody>`;
    mytable += `<tr> <th scope="row">ETH</th> <td>${balance}</td></tr>`;
    for (var CELL of tokenbalances) {
      mytable += `<tr> <th scope="row">${CELL[0]}</th> <td>${CELL[1]}</td></tr>`;
    }
    mytable += "</tbody></table>";
    document.getElementById("display3").innerHTML = mytable;
  }
  //execute search function
  function search() {
    if (address.length === 42) {
      getBal();
      Txofadd(address);
    } else if (address.length === 66) {
      Tx(address);
    } else if (address.length < 10) {
      Blocks(blockNumber);
    }
  }
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-md-12  col-xs-10 d-inline p-0 text-white ">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                Add/tx No./block No.
              </span>
            </div>
            <input
              id="Address"
              onKeyPress={search}
              type="text"
              value={address}
              onChange={setValue(setAddress)}
              className="form-control"
              placeholder="0x..."
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary d-inline bg-dark text-white"
                type="button"
                onClick={search}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-around mt-3 ">
        <div
          id="div1"
          className="col-md-4  col-xs-10 shadow-lg  mb-5 bg-white rounded"
        >
          <div id="display3"></div>
        </div>

        <div
          id="div1"
          className="col-md-7  col-xs-10 shadow-lg  mb-5 bg-white rounded"
        >
          <div id="display4"></div>
        </div>
      </div>

      <div className="row justify-content-around mt-3 ">
        <div className="col-md-12  col-xs-10 shadow-lg  mb-5 bg-white rounded">
          <div id="display2"></div>
        </div>
      </div>

      <div
        id="div1"
        className="col-md-8  col-xs-10 shadow-lg  mb-5 bg-white rounded"
      >
        <div id="display1">
          <Blocklist blockNumber={blockNumber} />
        </div>
      </div>
    </div>
  );
}

export default App;
