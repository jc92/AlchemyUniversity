import Head from "next/head";

import { useState, useEffect } from "react";
import { nftContractAddress } from "../config.js";
import { ethers } from "ethers";
import axios from "axios";

import Loader from "react-loader-spinner";

import NFT from "../utils/PutYourETHWhereYourMouthIs.json";

const mint = () => {
  const [mintedNFT, setMintedNFT] = useState(null);
  const [miningStatus, setMiningStatus] = useState(null);
  const [loadingState, setLoadingState] = useState(0);
  const [txError, setTxError] = useState(null);
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  // Checks if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log("Got the ethereum obejct: ", ethereum);
    } else {
      console.log("No Wallet found. Connect Wallet");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      console.log("Found authorized Account: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No authorized account found");
    }
  };

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);

      const rinkebyChainId = "0x13881";

      const devChainId = 1337;
      const localhostChainId = `0x${Number(devChainId).toString(16)}`;

      if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
        alert("You are not connected to the Rinkeby Testnet!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Found account", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain:" + chainId);

    const rinkebyChainId = "0x13881";

    const devChainId = 1337;
    const localhostChainId = `0x${Number(devChainId).toString(16)}`;

    if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
      setCorrectNetwork(false);
    } else {
      setCorrectNetwork(true);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkCorrectNetwork();
  }, []);

  // Creates transaction to mint NFT on clicking Mint Character button
  const mintCharacter = async () => {
    try {
      const { ethereum } = window;
      const counter_party = document.getElementById("counter_party").value;
      const arbiter = document.getElementById("arbiter").value;
      const goal = document.getElementById("goal").value;
      const value = ethers.BigNumber.from(document.getElementById("wei").value);
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          nftContractAddress,
          NFT.abi,
          signer
        );
        let nftTx = await nftContract.mint(arbiter, counter_party, goal);
        console.log("Mining....", nftTx.hash);
        setMiningStatus(0);

        let tx = await nftTx.wait();
        setLoadingState(1);
        console.log("Mined!", tx);
        let event = tx.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber();

        console.log(
          `Mined, see transaction: https://mumbai.polygonscan.com/tx/${nftTx.hash}`
        );

        getMintedNFT(tokenId);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error minting character", error);
      setTxError(error.message);
    }
  };

  // Gets the minted NFT data
  const getMintedNFT = async (tokenId) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          nftContractAddress,
          NFT.abi,
          signer
        );

        let tokenUri = await nftContract.tokenURI(tokenId);
        let data = await axios.get(tokenUri);
        let meta = data.data;

        setMiningStatus(1);
        setMintedNFT(meta.image);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setTxError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center pt-32 bg-[#F8F8FF] text-[#1A1A1A] min-h-screen">
      <Head>
        <title>Commit NFT</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="transition-transform duration-500 hover:scale-105 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mt-8">
        Put Your ETH Where Your Mouth is!
      </h2>
      <h4 className="text-2xl font-bold mb-2 mt-1">
        Secure Your Crypto with a Smart Contract and Earn a Commit NFT.
      </h4>
      <p>
        Setting a goal and incentivizing yourself to reach it is a great way to
        stay motivated and focused.{" "}
      </p>{" "}
      <p>
        To achieve this, you can create a crypto wager by following these steps:
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
          👎 If you don't reach your goal, the NFT is burned and the funds are
          sent to a counter party of your choice.
        </li>
      </ul>
      <div className="contract-form mt-10 rounded-lg">
        <h4 className="text-2xl font-bold mb-8 text-center">Mint NFT</h4>
        <div className="form-group mb-2 grid grid-cols-2">
          <label className="ml-2 mb-2 mt-2 text-left" htmlFor="arbiter">
            Referee Address
          </label>
          <input
            type="text"
            className="form-control border border-solid mb-2 border-gray-400 p-2 rounded-md"
            id="arbiter"
            placeholder="Enter referee address"
          />
          <label className="ml-2 text-left mt-2" htmlFor="goal">
            Goal
          </label>
          <input
            type="text"
            className="form-control border border-solid border-gray-400 p-2 rounded-md"
            id="goal"
            placeholder="Enter goal"
          />
        </div>
        <div className="form-group mb-4 grid mb-2  grid-cols-2">
          <label className="ml-2 text-left mt-2 mb-2" htmlFor="counter_party">
            Counter Party Address
          </label>
          <input
            type="text"
            className="form-control border border-solid mb-2 border-gray-400 p-2 rounded-md"
            id="counter_party"
            placeholder="Enter counter party address"
          />

          <label className="ml-2 text-left mt-2 " htmlFor="wei">
            Deposit Amount (in Wei)
          </label>
          <input
            type="text"
            className="form-control border border-solid border-gray-400 p-2 rounded-md"
            id="wei"
            placeholder="Enter deposit amount in wei"
          />
        </div>
      </div>
      {currentAccount === "" ? (
        <button
          className="text-xl font-semibold py-2 px-10 bg-black shadow-lg shadow-blue-500 rounded-lg mb-4 hover:scale-105 transition duration-500 ease-in-out"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : correctNetwork ? (
        <button
          className="text-xl font-semibold py-2 px-10 bg-black shadow-lg white-blue-500 rounded-lg mb-4 hover:scale-105 transition duration-500 ease-in-out"
          onClick={mintCharacter}
          style={{ color: "white" }}
        >
          Mint Commit NFT
        </button>
      ) : (
        <div className="flex flex-col justify-center items-center mb-12 font-semibold text-xl gap-y-2">
          <div>----------------------------------------</div>
          <div>Please connect to the Rinkeby Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      )}
      <div className="font-semibold mb-8 mt-4">
        <a
          href={`https://testnets.opensea.io/assets?search[query]=${nftContractAddress}`}
          target="_blank"
        >
          <span className="hover:text-blue-500 underline">
            View Collection on OpenSea
          </span>
        </a>
      </div>
      {loadingState === 0 ? (
        miningStatus === 0 ? (
          txError === null ? (
            <div className="flex flex-col justify-center items-center">
              <div className="text-base font-bold">
                Processing your transaction
              </div>
              <Loader
                className="flex justify-center items-center pt-8"
                type="TailSpin"
                color="#1A1A1A"
                height={30}
                width={30}
              />
            </div>
          ) : (
            <div className="text-base text-red-600 font-semibold">
              {txError}
            </div>
          )
        ) : (
          <div></div>
        )
      ) : (
        <div className="flex flex-col justify-center items-center">
          <div className="font-semibold mb-4">Your New Commit NFT</div>
          <img
            src={mintedNFT}
            alt=""
            className="h-50 w-50 rounded-lg shadow-2xl shadow-blue-500 hover:scale-105 transition duration-500 ease-in-out"
          />
        </div>
      )}
    </div>
  );
};

export default mint;
