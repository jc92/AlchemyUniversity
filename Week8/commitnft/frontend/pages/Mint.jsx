import { useAccount } from "wagmi";
import {
  Flex,
  Box,
  Center,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Tooltip,
  Stack,
  ButtonGroup,
  Divider,
  Image,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";

import { InfoIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { nftContractAddress } from "../utils/contracts-config";
import NFT from "../utils/PutYourETHWhereYourMouthIs.json";
import axios from "axios";

// export default function Mint({}) {
//   return <div className="container"> "Mint" </div>;
// }
export default function Mint({}) {
  const [mintedNFT, setMintedNFT] = useState(null);
  const [miningStatus, setMiningStatus] = useState(null);
  const [loadingState, setLoadingState] = useState(0);
  const [txError, setTxError] = useState(null);
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [tokenId, setTokenId] = useState(-1);

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
      const amount = ethers.BigNumber.from(
        document.getElementById("amount").value
      );
      console.log(window);
      console.log(ethereum);
      console.log(goal);
      console.log(amount);
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          nftContractAddress,
          NFT.abi,
          signer
        );
        let nftTx = await nftContract.mint(arbiter, counter_party, goal, {
          value: amount,
        }); //
        setLoadingState(1);
        console.log("Mining....", nftTx.hash);
        // setMiningStatus(0);

        let tx = await nftTx.wait();
        setLoadingState(0);
        console.log("Mined!", tx);
        setMiningStatus(1);

        let event = tx.events[1];
        let t_id = event.args[2];
        let tokenId = t_id.toNumber();
        setTokenId(t_id.toNumber());
        console.log(
          `Mined, see transaction: https://mumbai.polygonscan.com/tx/${nftTx.hash}`
        );
        console.log(tokenId);
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

        // setMiningStatus(1);
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
    // <Flex
    //   minH={"10vh"}
    //   align={"center"}
    //   justify={"center"}
    //   bg={useColorModeValue("gray.100", "gray.800")}
    // >
    <Stack spacing={5} mx={"auto"} maxW={"lg"} py={1} px={6}>
      <Stack align={"center"}>
        <Heading fontSize={"5xl"}>Mint your NFT now</Heading>
      </Stack>
      <Text>
        The following information will be written onto the blockchain and will
        be immutable by anyone.{" "}
      </Text>
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        <Stack spacing={4}>
          <FormControl id="goal">
            <FormLabel>
              Tell us what your goal is{"   "}
              <Tooltip
                label="Write a sentence or two about what you would like to achieve. Be specific such that the referee (see below) can clearly distinguish between success or failure."
                bg="gray.600"
              >
                <InfoIcon />
              </Tooltip>
            </FormLabel>

            <Input type="goal" placeholder="I want to ..." />
          </FormControl>
          <FormControl id="amount">
            <FormLabel>
              How much do you want to put into the NFT (Wei) {"   "}
              <Tooltip
                label="Amount in Wei that will be locked into the smart contract. Note that if you lose, you will lose this amount."
                bg="gray.600"
              >
                <InfoIcon />
              </Tooltip>
            </FormLabel>
            <Input type="amount" placeholder="50000000000000000" />
            <FormControl id="counter_party">
              <FormLabel>
                Counter party{"   "}
                <Tooltip
                  label="Wallet address of the person/organisation to whom the amount will be sent if you fail to achieve your goal."
                  bg="gray.600"
                >
                  <InfoIcon color="grey.300" />
                </Tooltip>
              </FormLabel>
              <Input placeholder="0x..." />
            </FormControl>
          </FormControl>
          <FormControl id="arbiter">
            <FormLabel>
              Referee's address {"   "}
              <Tooltip
                label="Wallet address of an impartial person who will judge whether you have achieved your goal or not. Note that only this address can unlock your crypto from the smart contract."
                bg="gray.600"
              >
                <InfoIcon color="grey.300" />
              </Tooltip>
            </FormLabel>
            <Input type="arbiter" placeholder="0x..." />
          </FormControl>
          <Stack spacing={4}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
            ></Stack>
            <Button
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              onClick={mintCharacter}
              isLoading={loadingState === 1}
            >
              Mint
            </Button>
          </Stack>
          {mintedNFT === null ? (
            <div></div>
          ) : (
            <Card maxW="sm">
              <CardBody>
                <Stack mt="6" spacing="3">
                  <Center bg="white" h="50px" color="black">
                    <Heading size="md">Here is your new commit NFT</Heading>
                  </Center>
                </Stack>
                <Image src={mintedNFT} alt="new_nft" borderRadius="lg" />
              </CardBody>

              <Button variant="solid" colorScheme="blue">
                <Link
                  href={`https://testnets.opensea.io/assets/mumbai/${nftContractAddress}/${tokenId}`}
                  isExternal
                >
                  See on OpenSea. <ExternalLinkIcon mx="2px" />
                </Link>
              </Button>
            </Card>
            // <div className="flex flex-col justify-center items-center">
            //   <div className="font-semibold mb-8 mt-4">
            //     <a
            //       href={`https://testnets.opensea.io/assets/mumbai/${nftContractAddress}/${tokenId}`}
            //       target="_blank"
            //     >
            //       <span className="hover:text-blue-500 underline">
            //         View Collection on OpenSea
            //       </span>
            //     </a>
            //   </div>{" "}
            //   <img
            //     src={mintedNFT}
            //     alt=""
            //     className="h-50 w-50 rounded-lg shadow-2xl shadow-blue-500 hover:scale-105 transition duration-500 ease-in-out"
            //   />
            // </div>
          )}
        </Stack>
      </Box>
    </Stack>
    // </Flex>
  );
}
// function NFTCard({ nft }) {
//   return (
//     <div className={styles.card_container}>
//       <div className={styles.image_container}>
//         <img src={nft.media}></img>
//       </div>
//       <div className={styles.info_box}>
//         <div className={styles.title_id_container}>
//           <h3>{nft.title.split("#")[0]}</h3>
//           <p>
//             #{nft.tokenId.slice(0, 4)}
//             {nft.tokenId.length > 4 && "..."}
//           </p>
//         </div>
//         <div className={styles.address_container}>
//           <a
//             target={"_blank"}
//             href={`https://etherscan.io/address/${nft.contract}`}
//           >
//             {nft.contract.slice(0, 4)}...{nft.contract.slice(38)}
//           </a>
//         </div>
//         <div className={styles.description_container}>
//           <p>{nft.description.slice(0, 75)}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
