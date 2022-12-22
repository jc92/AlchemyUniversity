const hre = require("hardhat");

const CONTRACT_ADDR = "0x1D54C576A4C6C5A59E874165b39ab32bA72948b7";

async function main() {
  const contract_winner = await hre.ethers.getContractAt(
    "Contract",
    CONTRACT_ADDR
  );
  const tx = await contract_winner.run_winner();
  await tx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
