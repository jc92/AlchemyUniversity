import Head from "next/head";
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Link,
  Image,
  Stack,
  Icon,
  Grid,
  GridItem,
  useColorModeValue,
  createIcon,
} from "@chakra-ui/react";

export default function Hero() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container maxW={"3xl"}>
        <Stack as={Box} textAlign={"center"} spacing={{ base: 8, md: 6 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: "21xl", sm: "2xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Put your
            <Text as={"span"} color={"blue.400"}>
              {" "}
              crypto <br />
            </Text>
            where your mouth is
          </Heading>
          <Grid templateColumns="repeat(3, 1fr)" gap={2}>
            <Box p={2} display={{ md: "flex" }}>
              <Box mt={{ base: 4, md: -1 }} ml={{ md: 6 }}>
                <Image
                  ml={6}
                  borderRadius="full"
                  objectFit="cover"
                  boxSize="150"
                  src="https://img.freepik.com/premium-vector/vector-illustration-crypto-security-lock-with-key-lock-symbol-cryptocurrency-six-icons-digital-currency_469123-347.jpg?w=1800"
                  alt="Dan Abramov"
                />
                <Text
                  fontWeight="bold"
                  textTransform="uppercase"
                  fontSize="sm"
                  letterSpacing="wide"
                  color="teal.600"
                >
                  Commit
                </Text>
                <Link
                  mt={1}
                  display="block"
                  fontSize="lg"
                  lineHeight="normal"
                  fontWeight="semibold"
                  href="/Mint"
                >
                  Lock your crypto into an NFT
                </Link>
                <Text mt={2} color="gray.500">
                  Mint an NFT declaring a habit or challenge you want to commit
                  to.
                </Text>
              </Box>
            </Box>
            <Box p={2} display={{ md: "flex" }}>
              <Box mt={{ base: 4, md: -1 }} ml={{ md: 6 }}>
                <Image
                  ml={6}
                  borderRadius="full"
                  objectFit="cover"
                  boxSize="150"
                  src="https://img.freepik.com/free-vector/key-business-concept-with-flat-design_23-2147854697.jpg?w=1380&t=st=1676070298~exp=1676070898~hmac=41bcfbe698b0a3813339d123760defdd6018d9a9d879d4bc67a11d9bb7bd3ef2"
                  alt="Dan Abramov"
                />

                <Text
                  fontWeight="bold"
                  textTransform="uppercase"
                  fontSize="sm"
                  letterSpacing="wide"
                  color="green.600"
                >
                  Redeem
                </Text>
                <Link
                  mt={1}
                  display="block"
                  fontSize="lg"
                  lineHeight="normal"
                  fontWeight="semibold"
                  href="/Redeem"
                >
                  Recover locked crypto if you succeed
                </Link>
                <Text mt={2} color="gray.500">
                  Keep the NFT as a reminder of your success.
                </Text>
              </Box>
            </Box>
            <Box p={2} display={{ md: "flex" }}>
              <Box mt={{ base: 4, md: -1 }} ml={{ md: 6 }}>
                <Image
                  ml={6}
                  borderRadius="full"
                  objectFit="cover"
                  boxSize="150"
                  src="https://img.freepik.com/free-vector/hand-generous-person-putting-heart-jar_74855-20127.jpg?w=1480&t=st=1676070394~exp=1676070994~hmac=602ecaecf7dd890fc34867f2b6be7c354686b46083a9d3dd09aefc6e47ed7e7c"
                  alt="Dan Abramov"
                />
                <Text
                  fontWeight="bold"
                  textTransform="uppercase"
                  fontSize="sm"
                  letterSpacing="wide"
                  color="red.600"
                >
                  Donate
                </Text>
                <Link
                  mt={1}
                  display="block"
                  fontSize="lg"
                  lineHeight="normal"
                  fontWeight="semibold"
                  href="/Redeem"
                >
                  Crypto is sent to a charity or person of your choice if you
                  failed
                </Link>
                <Text mt={2} color="gray.500">
                  Keep the NFT as a reminder of your failure.
                </Text>
              </Box>
            </Box>
          </Grid>

          <Stack
            direction={"column"}
            spacing={10}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <Button
              colorScheme={"blue"}
              bg={"blue.400"}
              rounded={"full"}
              px={7}
              _hover={{
                bg: "green.500",
              }}
            >
              <Link href="/Mint">Get Started Minting</Link>
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
