import { ethers } from "hardhat";
import { getSelectors, FacetCutAction } from "../libraries/diamond";
import * as fs from "fs";

const addressConfig = fs.readFileSync("./scripts/addres.json", "utf-8");
const add = JSON.parse(addressConfig);

// address of Diamond contract
let diamondaddress = add.diamondAddress;

// address of Diamondinit contract
let diamondinitaddress = add.diamondInit;

async function addfacet() {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];

  console.log("Deploying facets and adding facet");
  const FacetNames = ["Newfuc"]; // pass contract name
  const cut = [];
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName);
    const facet = await Facet.deploy();
    await facet.deployed();
    console.log(`${FacetName} deployed: ${facet.address}`);
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet),
    });
  }
  const diamondCut = await ethers.getContractAt("IDiamondCut", diamondaddress);
  let tx;
  let receipt;
  // call to init function

  tx = await diamondCut.diamondCut(cut, diamondinitaddress, "0xe1c7392a");
  console.log("Diamond cut tx: ", tx.hash);
  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  addfacet()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
