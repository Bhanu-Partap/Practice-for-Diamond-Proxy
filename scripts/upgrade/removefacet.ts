import { ethers } from "hardhat";
import { getSelectors, FacetCutAction } from "../libraries/diamond";
import * as fs from "fs";


const addressConfig = fs.readFileSync("./scripts/addres.json", "utf-8");
const add = JSON.parse(addressConfig);

// address of Diamond contract
let diamondaddress = add.diamondAddress;

// address of Diamondinit contract
let diamondinitaddress = add.diamondInit;

async function removefunction() {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];
  console.log(" removing facet function ");
  const cut = [];
  cut.push({
    facetAddress: "0x0000000000000000000000000000000000000000", //address of facet must be zero
    action: FacetCutAction.Remove,
    functionSelectors: [] // array of function selector that you want to remove
  });

  // upgrade diamond with facets

  const diamondCut = await ethers.getContractAt("IDiamondCut", diamondaddress);
  let tx;
  let receipt;

  tx = await diamondCut.diamondCut(cut, diamondinitaddress, "0xe1c7392a");

  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
  console.log("Completed diamond cut");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  removefunction()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
