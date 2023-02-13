import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./styles.css";
import { ethers } from "ethers";
// import { Form, Button } from "react-bootstrap";
import { CircularProgress } from "@mui/material";

// import Greeter from "../artifacts/PutYourETHWhereYourMouthIs.json";
import { contractAddress, networkDeployedTo } from "../utils/contracts-config";
import networksMap from "../utils/networksMap.json";

const Home = () => {
  return (
    <div style={{ color: "white", backgroundColor: "#24252d" }}>
      <div className="homeContainer">
        <h2 className="text-2xl font-bold mt-8">
          Put Your ETH Where Your Mouth is!
        </h2>
        <h4 className="text-2xl font-bold mb-2 mt-1">
          Secure Your Crypto with a Smart Contract and Earn a Commit NFT.
        </h4>
        <p>
          Setting a goal and incentivizing yourself to reach it is a great way
          to stay motivated and focused.{" "}
        </p>{" "}
        <p>
          To achieve this, you can create a crypto wager by following these
          steps:
        </p>
        <ul>
          <li>
            1. Define a goal you want to achieve and choose a trusted person as
            your referee.
          </li>
          <li>2. Decide how much crypto you want to put as a wager.</li>
          <li>3. Mint a Non-Fungible Token (NFT) with your wager.</li>
        </ul>
        Outcome:
        <ul>
          <li>
            {" "}
            👍 If you reach your goal, you get to keep the NFT and the funds.
          </li>
          <li>
            👎 If you requiren't reach your goal, the NFT is burned and the
            funds are sent to a counter party of your choice.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
