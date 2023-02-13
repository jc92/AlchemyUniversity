import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Navbar.module.css";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { Image, Box } from "@chakra-ui/react";
// import Account from "../Account";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <a href="/Hero">
        <Image height="50px" objectFit="cover" src="logo.png" alt="doge" />
      </a>
      <Link as={NextLink} href="/Hero">
        Home
      </Link>
      <Link as={NextLink} href="/Mint">
        Mint
      </Link>
      <Link as={NextLink} href="/Redeem">
        Redeem
      </Link>
      <Link as={NextLink} href="/About">
        About
      </Link>
      <ConnectButton></ConnectButton>
      {/* <Account /> */}
    </nav>
  );
}
