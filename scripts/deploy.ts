import { ethers } from "hardhat";
import { getSelectors, FacetCutAction } from "./libraries/diamond";
import * as fs from "fs";

async function deployDiamond(): Promise<string> {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];
  const orkadeadmin = accounts[1];

  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
  const diamondCutFacet = await DiamondCutFacet.deploy();

  await diamondCutFacet.deployed();

  // deploy Diamond
  const Diamond = await ethers.getContractFactory("Diamond");
  const diamond = await Diamond.deploy(
    contractOwner.address,
    diamondCutFacet.address
  );

  await diamond.deployed();

  // deploy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables

  const DiamondInit = await ethers.getContractFactory("DiamondInit");
  const diamondInit = await DiamondInit.deploy();
  await diamondInit.deployed();

  const myAddress: any = {
    diamondAddress: diamond.address,
    diamondInit: diamondInit.address,
  };

  const json = JSON.stringify(myAddress);
  fs.writeFileSync("./scripts/addres.json", json);

  // deploy facets
  const FacetNames: string[] = [
    "DiamondLoupeFacet",
    "OwnershipFacet",
    "OurkadeAdmin",
    "OurkadeHelper",
    "OurkadePlayer",
    "OurkadeCompetition",
    "OurkadeGame",
    "OurkadeNode",
  ];
  const cut: any[] = [];
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

  // upgrade diamond with facets

  const diamondCut = await ethers.getContractAt("IDiamondCut", diamond.address);
  let tx;
  let receipt;
  // call to init function
  let functionCall = diamondInit.interface.encodeFunctionData("init");
  tx = await diamondCut.diamondCut(cut, diamondInit.address, functionCall);
  console.log("Diamond cut tx: ", tx.hash);
  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }

  let ourkadelogic1nstance = await ethers.getContractAt(
    "OurkadeAdmin",
    diamond.address
  );
  await ourkadelogic1nstance.init(contractOwner.address);

  return diamond.address;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployDiamond()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { deployDiamond };
