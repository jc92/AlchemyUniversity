import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  useColorMode,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import Name from "./Name";
import "./Navbar.css";
// import Account from "./Account";

export default function Navbar() {
  return (
    <div id="navFix">
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={9}
        width={["100%"]}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack w="42%">
            <Name />
          </HStack>

          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <HStack spacing={8} alignItems={"center"}>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
                id="myDIV"
              >
                <Button className="btnRes">
                  <a href="#Home">
                    {" "}
                    <b>Home</b>
                  </a>
                </Button>

                <Button className="btnRes">
                  <a href="#About">
                    <b>Mint</b>
                  </a>
                </Button>

                <Button className="btnRes">
                  <a href="#Skills">
                    {" "}
                    <b>Redeem</b>
                  </a>
                </Button>
              </HStack>
            </HStack>
          </Flex>
        </Flex>
      </Box>
    </div>
  );
}
