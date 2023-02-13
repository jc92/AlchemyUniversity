import { InfoIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";

import {
  Flex,
  Box,
  Center,
  CardBody,
  CardFooter,
  Card,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Tooltip,
  BeatLoader,
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
import { Alchemy, Network, Contract } from "alchemy-sdk";
// import { useState } from "react";
import { nftContractAddress } from "../utils/contracts-config";
// import { useSelector } from "react-redux";

import { ethers } from "ethers";
import NFT from "../utils/PutYourETHWhereYourMouthIs.json";
import axios from "axios";
import { useProvider } from "wagmi";
import { useSigner } from "wagmi";

export default function Redeem({}) {
  // const { ethereum } = window;
  const config_ALCHEMY = {
    apiKey: "H84yv9lGUFL_a3TmNL6um3wfZDnh9E3G",
    network: Network.MATIC_MUMBAI,
  };
  const alchemy = new Alchemy(config_ALCHEMY);
  const [userAddress, setUserAddress] = useState("");
  // const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  // const [EscrowDataObjects, setEscrowDataObjects] = useState([]);
  const [relevant_tokenDataObjects, set_relevant_tokenDataObjects] = useState(
    []
  );
  // const provider = new ethers.providers.Web3Provider(ethereum);
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();
  const nftContract = new Contract(nftContractAddress, NFT.abi, signer);
  const Success = async (nftContract, TokenId) => {
    // console.log(TokenId);
    const achievedChallenge = await nftContract.functions.achieved(TokenId);
    // console.log(achievedChallenge);
  };
  const Failed = async (nftContract, TokenId) => {
    // console.log(TokenId);
    const achievedChallenge = await nftContract.functions.failed(TokenId);
    // console.log(achievedChallenge);
  };
  async function getEscrows(nftContract, tokenCount) {
    const EscrowPromises = [];
    for (let i = 0; i < tokenCount; i++) {
      // console.log("rerun", i);
      const EscrowData = await nftContract.functions.tokenIdToEscrows(i);
      // console.log("EscrowData", EscrowData);
      EscrowPromises.push(EscrowData);
    }
    return EscrowPromises;
  }
  async function getTokeData(data) {
    const tokenDataPromises = [];
    for (let i = 0; i < data.ownedNfts.length; i++) {
      const tokenData = alchemy.nft.getNftMetadata(
        data.ownedNfts[i].contract.address,
        data.ownedNfts[i].tokenId
      );
      tokenDataPromises.push(tokenData);
    }
    return tokenDataPromises;
  }
  // async function getTokenURI(nftContract, tokenId) {
  //   return await nftContract.functions.getTokenURI(tokenId);
  // }
  async function getNFTsForOwner() {
    let relevant_tokenDataObjects = []; // reset when calling getNFTsForOwner
    let escrowDataObjects = []; // reset when calling getNFTsForOwner
    let results; // reset when calling getNFTsForOwner
    let [EscrowData, tokenData] = [[], []]; // reset when calling getNFTsForOwner
    const referee = await signer.getAddress();
    results = await alchemy.nft.getNftsForOwner(userAddress, {
      contractAddresses: [nftContractAddress],
      refreshCache: true,
    });
    setIsQuerying(true);
    [EscrowData, tokenData] = await Promise.all([
      getEscrows(nftContract, results.ownedNfts.length),
      getTokeData(results),
    ]);
    // setEscrowDataObjects(await Promise.all(EscrowData));
    // setTokenDataObjects(await Promise.all(tokenData));
    escrowDataObjects = await Promise.all(EscrowData);
    const tokenId = [];
    for (let i = 0; i < results.ownedNfts.length; i++) {
      console.log(results.ownedNfts[i]);
      console.log(escrowDataObjects[i]);
      // console.log("arbiter", escrowDataObjects[i].arbiter);
      // console.log("approved", escrowDataObjects[i].isApproved);
      if (
        escrowDataObjects[i].arbiter == referee &&
        escrowDataObjects[i].isApproved == false
      ) {
        relevant_tokenDataObjects.push(results.ownedNfts[i]);
        tokenId.push(results.ownedNfts[i].tokenId);
      }
    }
    // console.log(tokenId);
    setHasQueried(true);
    setIsQuerying(false);
    set_relevant_tokenDataObjects(relevant_tokenDataObjects);
    console.log("relevant_tokenDataObjects after", relevant_tokenDataObjects);

    // relevant_tokenDataObjects.map((e, i) => {
    //   console.log(e.toString(), i);
    // });
    // console.log(relevant_tokenDataObjects);
  }
  return (
    <Stack spacing={5} mx={"auto"} maxW={"lg"} py={1} px={6}>
      <Stack align={"center"}>
        <Heading fontSize={"5xl"}>Review Challenges and Unlock Crypto</Heading>
      </Stack>
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        <Stack spacing={4}>
          <FormControl id="goal">
            <FormLabel>
              Whose Challenges would you like to review?
              {"   "}
              <Tooltip
                label="Insert the address of someone who designated you as their referee for a challenge."
                bg="gray.600"
              >
                <InfoIcon />
              </Tooltip>
            </FormLabel>
            <Input
              onChange={(e) => setUserAddress(e.target.value)}
              type="goal"
              placeholder="0x..."
            />
          </FormControl>
          <Stack spacing={4}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
            ></Stack>
            <Button
              colorScheme="blue"
              onClick={getNFTsForOwner}
              mt={36}
              loadingText="Fetching"
              // spinner={<BeatLoader size={8} color="white" />}
              isLoading={isQuerying}
            >
              Fetch NFTs
            </Button>
          </Stack>
        </Stack>
        {hasQueried ? (
          <Grid w={"90vw"} columns={4} spacing={24}>
            {relevant_tokenDataObjects.map((e, i) => {
              // console.log(relevant_tokenDataObjects[i]);
              return (
                <Card maxW="sm">
                  <CardBody>
                    <Stack mt="6" spacing="3">
                      <Heading size="md">
                        {relevant_tokenDataObjects[i].rawMetadata.name}
                      </Heading>
                    </Stack>
                    <Image
                      src={relevant_tokenDataObjects[i].rawMetadata.image}
                      alt="nft ${e.id}"
                      borderRadius="lg"
                    />
                  </CardBody>
                  <CardFooter>
                    <ButtonGroup spacing="2">
                      <Button
                        colorScheme="whatsapp"
                        onClick={() =>
                          Success(
                            nftContract,
                            relevant_tokenDataObjects[i].tokenId
                          )
                        }
                      >
                        Success
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={() =>
                          Failed(
                            nftContract,
                            relevant_tokenDataObjects[i].tokenId
                          )
                        }
                        style={{ color: "white" }}
                        key={e.id}
                      >
                        Failed
                      </Button>
                    </ButtonGroup>
                  </CardFooter>
                  <Divider />
                </Card>

                // <Box p="" maxW="320px" borderWidth="px">
                //   <Flex
                //     flexDir={"column"}
                //     color="white"
                //     bg="blue"
                //     w={"20.7vw"}
                //     key={e.id}
                //   >
                //     <Text
                //       ml={2}
                //       textTransform="uppercase"
                //       fontSize="sm"
                //       fontWeight="bold"
                //       color="pink.800"
                //     >
                //       {relevant_tokenDataObjects[i].rawMetadata.name}
                //     </Text>
                //   </Flex>
                //   <Image
                //     borderRadius="md"
                //     src={relevant_tokenDataObjects[i].rawMetadata.image}
                //   />
                //   <Button
                //     colorScheme="whatsapp"
                //     onClick={() =>
                //       Success(nftContract, relevant_tokenDataObjects[i].tokenId)
                //     }
                //   >
                //     Success
                //   </Button>
                //   <Button
                //     colorScheme="red"
                //     className="text-xl font-semibold py-2 px-10 bg-black shadow-lg white-blue-500 rounded-lg mb-4 hover:scale-105 transition duration-500 ease-in-out"
                //     onClick={() =>
                //       Failed(nftContract, relevant_tokenDataObjects[i].tokenId)
                //     }
                //     style={{ color: "white" }}
                //     key={e.id}
                //   >
                //     Failed
                //   </Button>
                // </Box>
              );
            })}
          </Grid>
        ) : (
          "Please make a query! The query may take a few seconds..."
        )}
      </Box>
    </Stack>
  );
}
