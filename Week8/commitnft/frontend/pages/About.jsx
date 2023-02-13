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

export default function About() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container maxW={"2xl"}>
        <Stack as={Box} textAlign={"center"} spacing={{ base: 8, md: 6 }}>
          <Grid templateColumns="repeat(1, 3fr)" gap={2}>
            <Heading>Step 1.</Heading>
            <Box p={2} display={{ md: "flex" }}>
              <Image ml={6} boxHeight="300" src="step1.png" alt="s1" />
            </Box>
            <Heading>Step 2.</Heading>
            <Box p={2} display={{ md: "flex" }}>
              <Image ml={6} boxHeight="300" src="step2.png" alt="s2" />
            </Box>{" "}
            <Heading>Step 3.</Heading>
            <Box p={2} display={{ md: "flex" }}>
              <Image ml={6} boxHeight="300" src="step3.png" alt="s3" />
            </Box>
          </Grid>

          <Stack
            direction={"column"}
            spacing={10}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          ></Stack>
        </Stack>
      </Container>
    </>
  );
}
