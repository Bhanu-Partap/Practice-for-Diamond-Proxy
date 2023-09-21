import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import {
  OurkadeAdmin,
  OurkadePlayer,
  OurkadeHelper,
  OurkadeCompetition,
  OurkadeNode,
  OurkadeGame,
  Newfuc,
} from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import Enums from "./Enums";
import Types from "./Types";
import { Address } from "cluster";
import { keccak256 } from "ethers/lib/utils";
const { PANIC_CODES } = require("@nomicfoundation/hardhat-chai-matchers/panic");
import { getSelectors, FacetCutAction } from "../scripts/libraries/diamond";

//// MINDSET REMINDER
//// Await Expect vs Expect Await
//    Because these are tests against a blockchain any write operation
//    is not "guaranteed" and needs to await finalization
//    Calls to the blockchain are awaited, and if it is a read-only
//    operation it will be returned directly.
//    If it's a write operation, then the overall action needs to be
//    awaited
//// Static Value Example
//    await expect(contract.Function(params)).to...;
//// Write Value Example
//    expect(await contract.Function(params)).to...);
//
//// Common Addresses:
// Operator 1: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
// Operator 2: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
// Operator 3: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
interface FixtureData {
  diamondaddress: string;
  diamondinitaddress: string;
  OurkadeAdmin: OurkadeAdmin;
  OurkadePlayer: OurkadePlayer;
  OurkadeHelper: OurkadeHelper;
  OurkadeCompetition: OurkadeCompetition;
  OurkadeGame: OurkadeGame;
  OurkadeNode: OurkadeNode;
  contractAdmin: SignerWithAddress;
  ourkadeAdmin: SignerWithAddress;
  ourkadeOperator1: SignerWithAddress;
  ourkadeOperator2: SignerWithAddress;
  ourkadeOperator3: SignerWithAddress;
  player1: SignerWithAddress;
  player2: SignerWithAddress;
  player3: SignerWithAddress;
}

function uintToBytes(value: number): string {
  return ethers.utils.defaultAbiCoder.encode(["uint"], [value]);
}

interface AddressNumber {
  Address: string;
  Number: BigNumber;
}

function bytes32ToAddressNumber(value: string): AddressNumber {
  let addressPart: string = "0x" + value.slice(-40);
  let numberPart: BigNumber = BigNumber.from(value.substring(2, 26));
  return { Address: addressPart, Number: numberPart };
}

function addressAndNumberToBytes(_address: string, _number: BigNumber) {
  return addressNumberToBytes32({
    Address: _address.toLowerCase(),
    Number: _number,
  });
}

function addressNumberToBytes32(value: AddressNumber): string {
  return (
    "0x" +
    value.Number.toHexString().substring(2).padStart(24, "0") +
    value.Address.slice(-40)
  );
}

function competitionParamsToBytes(_params: Types.CompetitionParams) {
  return ethers.utils.defaultAbiCoder.encode(
    [
      "bytes32",
      "bool",
      "uint64",
      "int16",
      "int8",
      "int8",
      "uint16",
      "uint16",
      "uint",
      "uint",
      "uint",
      "uint",
      "uint",
      "uint",
      "uint",
      "uint8",
      "uint",
    ],
    [
      _params.GameDefinition,
      _params.EligibleByTicket,
      _params.EligibleLoyalty,
      _params.EligibleReputation,
      _params.EligibleRankMinimum,
      _params.EligibleRankMaximum,
      _params.EligibleEloMinimum,
      _params.EligibleEloMaximum,
      _params.CurrencyType,
      _params.PrizeType,
      _params.PrizePool,
      _params.NodeReward,
      _params.EntryFee,
      _params.MinimumPlayers,
      _params.MaximumPlayers,
      _params.MatchesPerRound,
      _params.MatchDuration,
    ]
  );
}

function defaultCompetitionParamBytes() {
  return competitionParamsToBytes(defaultCompetitionParams());
}

function defaultCompetitionParams(): Types.CompetitionParams {
  return {
    GameDefinition: uintToBytes(1),
    EligibleByTicket: false,
    EligibleLoyalty: BigNumber.from(0),
    EligibleReputation: BigNumber.from(0),
    EligibleRankMinimum: BigNumber.from(0),
    EligibleRankMaximum: BigNumber.from(10),
    EligibleEloMinimum: BigNumber.from(0),
    EligibleEloMaximum: BigNumber.from(0),
    CurrencyType: Enums.CurrencyType.Reward,
    PrizeType: Enums.PrizeType.WinnerTakeAll,
    PrizePool: BigNumber.from(90),
    NodeReward: BigNumber.from(10),
    EntryFee: BigNumber.from(1),
    MinimumPlayers: BigNumber.from(2),
    MaximumPlayers: BigNumber.from(10),
    MatchesPerRound: BigNumber.from(3),
    MatchDuration: BigNumber.from(60 * 60),
  };
}

const ROLE_ADMIN: string =
  "0x303c130e8d487dd85c87c89897117f9a0a45df93e2439e165fe87c420a40865e"; // keccak256("OURKADE_ADMIN");
const ROLE_OPERATOR: string =
  "0x99974f5de33162168ca1ac2d46c1e9342f37deaa311f5f57ea754342cf655b60"; // keccak256("OURKADE_OPERATOR");

function accessControlError(_address: string, _role: string): string {
  return "not authorised role";
}

const NON_EXISTING_PLAYER = "0x1337133713371337133713371337133713371337";
const NULL_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const TEST_TICKET_AMOUNT = 10;

describe("Game", function () {
  async function contractDeployedOurkadeFixture(): Promise<FixtureData> {
    // Contracts are deployed using the first signer/account by default
    const [
      contractAdmin,
      ourkadeAdmin,
      ourkadeOperator1,
      ourkadeOperator2,
      ourkadeOperator3,
      player1,
      player2,
      player3,
    ] = await ethers.getSigners();
    let contractOwner = contractAdmin;

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

    const diamondaddress = diamond.address;

    // deploy DiamondInit
    // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables

    const DiamondInit = await ethers.getContractFactory("DiamondInit");
    const diamondInit = await DiamondInit.deploy();
    await diamondInit.deployed();

    const diamondinitaddress = diamondInit.address;

    const FacetNames: string[] = [
      "OwnershipFacet",
      "OurkadeAdmin",
      "OurkadePlayer",
      "OurkadeHelper",
      "OurkadeCompetition",
      "OurkadeGame",
      "OurkadeNode",
    ];
    const cut: any[] = [];
    for (const FacetName of FacetNames) {
      const Facet = await ethers.getContractFactory(FacetName);
      const facet = await Facet.deploy();
      await facet.deployed();

      cut.push({
        facetAddress: facet.address,
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(facet),
      });
    }

    // upgrade diamond with facets

    const diamondCut = await ethers.getContractAt(
      "IDiamondCut",
      diamond.address
    );
    let tx;
    let receipt;
    // call to init function
    let functionCall = diamondInit.interface.encodeFunctionData("init");
    tx = await diamondCut.diamondCut(cut, diamondInit.address, functionCall);

    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    let ourkadehelper = await ethers.getContractAt(
      "OurkadeHelper",
      diamond.address
    );
    let ourkadelogicInstance = await ethers.getContractAt(
      "OurkadeAdmin",
      diamond.address
    );
    await ourkadelogicInstance.init(contractOwner.address);
    let ourkadelogicInstance2 = await ethers.getContractAt(
      "OurkadePlayer",
      diamond.address
    );

    let Ourkadegame = await ethers.getContractAt(
      "OurkadeGame",
      diamond.address
    );
    let Ourkadecompetition = await ethers.getContractAt(
      "OurkadeCompetition",
      diamond.address
    );
    let Ourkadenode = await ethers.getContractAt(
      "OurkadeNode",
      diamond.address
    );

    return {
      diamondaddress: diamondaddress,
      diamondinitaddress: diamondinitaddress,
      OurkadeAdmin: ourkadelogicInstance,
      OurkadePlayer: ourkadelogicInstance2,
      OurkadeHelper: ourkadehelper,
      OurkadeCompetition: Ourkadecompetition,
      OurkadeGame: Ourkadegame,
      OurkadeNode: Ourkadenode,
      contractAdmin,
      ourkadeAdmin,
      ourkadeOperator1,
      ourkadeOperator2,
      ourkadeOperator3,
      player1,
      player2,
      player3,
    };
  }

  describe("new function", function () {
    it("added a new facet", async function () {
      const fixtureData = await loadFixture(contractDeployedOurkadeFixture);

      const cut = [];

      const Facet = await ethers.getContractFactory("Newfuc");
      const facet = await Facet.deploy();
      await facet.deployed();

      cut.push({
        facetAddress: facet.address,
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(facet),
      });

      const diamondCut = await ethers.getContractAt(
        "IDiamondCut",
        fixtureData.diamondaddress
      );
      let tx;
      let receipt;
      // call to init function

      tx = await diamondCut.diamondCut(
        cut,
        fixtureData.diamondinitaddress,
        "0xe1c7392a"
      );

      receipt = await tx.wait();
      if (!receipt.status) {
        throw Error(`Diamond upgrade failed: ${tx.hash}`);
      }
      let newfuncinstance = await ethers.getContractAt(
        "Newfuc",
        fixtureData.diamondaddress
      );

      await newfuncinstance.setRepGuiltyLimit(10);

      await expect(await newfuncinstance.readRepGuiltyLimit()).to.equal(10);
    });
  });
});
