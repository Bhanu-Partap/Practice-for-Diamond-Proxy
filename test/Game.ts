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
  Newfuc
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
  // We define a fixture to reuse the same setup in every test.OurkadeLogic
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
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

  async function rolesSetOurkadeFixture(): Promise<FixtureData> {
    const fixtureData = await contractDeployedOurkadeFixture();

    await fixtureData.OurkadeAdmin.AddOurkadeAdmin(
      fixtureData.ourkadeAdmin.address
    );
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).AddOurkadeOperator(fixtureData.ourkadeOperator1.address);
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).AddOurkadeOperator(fixtureData.ourkadeOperator2.address);
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).AddOurkadeOperator(fixtureData.ourkadeOperator3.address);

    return fixtureData;
  }

  async function profilesCreatedOurkadeFixture(): Promise<FixtureData> {
    const fixtureData = await rolesSetOurkadeFixture();

    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).AdminCreateProfile(fixtureData.ourkadeAdmin.address);
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).AdminCreateProfile(fixtureData.ourkadeOperator1.address);
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).AdminCreateProfile(fixtureData.ourkadeOperator2.address);
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).AdminCreateProfile(fixtureData.ourkadeOperator3.address);
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).AdminCreateProfile(fixtureData.player1.address);
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).AdminCreateProfile(fixtureData.player2.address);
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).AdminCreateProfile(fixtureData.player3.address);

    return fixtureData;
  }

  async function nodesAssignedOurkadeFixture(): Promise<FixtureData> {
    const fixtureData = await profilesCreatedOurkadeFixture();

    await fixtureData.OurkadeAdmin.connect(fixtureData.ourkadeAdmin).NodeAssign(
      fixtureData.ourkadeOperator1.address,
      2
    );
    await fixtureData.OurkadeAdmin.connect(fixtureData.ourkadeAdmin).NodeAssign(
      fixtureData.ourkadeOperator2.address,
      2
    );
    await fixtureData.OurkadeAdmin.connect(fixtureData.ourkadeAdmin).NodeAssign(
      fixtureData.ourkadeOperator3.address,
      2
    );

    return fixtureData;
  }

  async function poolStakingSetOurkadeFixture(): Promise<FixtureData> {
    const fixtureData = await nodesAssignedOurkadeFixture();

    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).NodeQueueTierSet(0, 0, 1);
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).NodeQueueTierSet(1, 1, 2);

    return fixtureData;
  }

  // Join 3 nodes to pool 0
  async function poolJoinedOurkadeFixture(): Promise<FixtureData> {
    const fixtureData = await poolStakingSetOurkadeFixture();

    // Online nodes and join them to the queue
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeOperator1
    ).NodeStakeQueueTier(1);
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeOperator1
    ).NodeStatusOnline(1);

    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeOperator2
    ).NodeStakeQueueTier(1);
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeOperator2
    ).NodeStatusOnline(1);

    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeOperator3
    ).NodeStakeQueueTier(1);
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeOperator3
    ).NodeStatusOnline(1);

    return fixtureData;
  }

  async function readyForCompetition(): Promise<FixtureData> {
    const fixtureData = await poolJoinedOurkadeFixture();

    // Give tickets to players:
    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).DepositTickets(fixtureData.player1.address, TEST_TICKET_AMOUNT);

    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).DepositTickets(fixtureData.player2.address, TEST_TICKET_AMOUNT);

    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).DepositTickets(fixtureData.player3.address, TEST_TICKET_AMOUNT);

    // Set loyalty lookup
    let loyalties: string[] = [
      "02300000",
      "02440070",
      "02513272",
      "02588670",
      "02666330",
      "02746320",
      "02828710",
      "02913571",
      "03000978",
      "03091008",
      "03183738",
      "03279250",
      "03377628",
      "03478956",
      "03583325",
      "03690825",
      "03801550",
      "03915596",
      "04033064",
      "04154056",
      "04278678",
      "04407038",
      "04539249",
      "04675426",
      "04815689",
      "04960160",
      "05108965",
      "05262234",
      "05420101",
      "05582704",
      "05750185",
      "05922690",
      "06100371",
      "06283382",
      "06471884",
      "06666040",
      "06866021",
      "07072002",
      "07284162",
      "07502687",
      "07727768",
      "07959601",
      "08198389",
      "08444340",
      "08697670",
      "08958601",
      "09227359",
      "09504179",
      "09789305",
      "10082984",
      "10385473",
      "10697038",
      "11017949",
      "11348487",
      "11688942",
      "12039610",
      "12400798",
      "12772822",
      "13156007",
      "12892887",
      "12635029",
      "12382328",
      "12134682",
      "11891988",
      "11654149",
      "11421066",
      "11192644",
      "10968791",
      "10749416",
      "10534427",
      "10323739",
      "10117264",
      "09914919",
      "09716620",
      "09522288",
      "09331842",
      "09145205",
      "08962301",
      "08783055",
      "08607394",
      "08435246",
      "08266541",
      "08101210",
      "07939186",
      "07780402",
      "07624794",
      "07472299",
      "07322853",
      "07176395",
      "07032868",
      "06892210",
      "06754366",
      "06619279",
      "06486893",
      "06357155",
      "06230012",
      "06105412",
      "05983304",
      "05863638",
      "05746365",
      "05631438",
      "05518809",
      "05408433",
      "05300264",
      "05194259",
      "05090374",
      "04988566",
      "04888795",
      "04791019",
      "04695198",
      "04601294",
      "04509269",
      "04419083",
      "04330702",
      "04244088",
      "04159206",
      "04076022",
      "03994501",
      "03914611",
      "03836319",
      "03759593",
      "03684401",
      "03610713",
      "03538498",
      "03467729",
      "03398374",
      "03330406",
      "03263798",
      "03198522",
      "03134552",
      "03071861",
      "03010424",
      "02950215",
      "02891211",
      "02833387",
      "02776719",
      "02721185",
      "02666761",
      "02613426",
      "02561157",
      "02509934",
      "02459735",
      "02410541",
      "02362330",
      "02315083",
      "02268782",
      "02223406",
      "02178938",
      "02135359",
      "02092652",
      "02050799",
      "02009783",
      "01969587",
      "01930195",
      "01891592",
      "01853760",
      "01816685",
      "01780351",
      "01744744",
      "01709849",
      "01675652",
      "01642139",
      "01609296",
      "01577110",
      "01545568",
      "01514657",
      "01484364",
      "01454676",
      "01425583",
      "01397071",
      "01369130",
      "01341747",
      "01314912",
      "01288614",
      "01262842",
      "01237585",
      "01212833",
      "01188576",
      "01164805",
      "01141509",
      "01118679",
      "01096305",
      "01074379",
      "01052891",
      "01031834",
      "01011197",
      "00990973",
      "00971153",
      "00951730",
      "00932696",
      "00914042",
      "00895761",
      "00877846",
      "00860289",
      "00843083",
      "00826221",
      "00809697",
      "00793503",
      "00777633",
      "00762080",
      "00746839",
      "00731902",
      "00717264",
      "00702919",
      "00688860",
      "00675083",
      "00661581",
      "00648350",
      "00635383",
      "00622675",
      "00610222",
      "00598017",
      "00586057",
      "00574336",
      "00562849",
      "00551592",
      "00540560",
      "00529749",
      "00519154",
      "00508771",
      "00498596",
      "00488624",
      "00478851",
      "00469274",
      "00459889",
      "00450691",
      "00441677",
      "00432843",
      "00424187",
      "00415703",
      "00407389",
      "00399241",
      "00391256",
      "00383431",
      "00375762",
      "00368247",
      "00360882",
      "00353665",
      "00000000",
      "00000000",
    ];

    let loyaltiesBigNumber: BigNumber[] = new Array();

    for (let index = 0; index < loyalties.length; index++) {
      loyaltiesBigNumber.push(BigNumber.from(loyalties[index]));
    }

    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).SetLoyaltyLookup(loyaltiesBigNumber);

    return fixtureData;
  }

  async function competitionCreatedFixture(): Promise<FixtureData> {
    const fixtureData = await readyForCompetition();

    await fixtureData.OurkadeAdmin.connect(
      fixtureData.ourkadeAdmin
    ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false);

    await fixtureData.OurkadeCompetition.connect(
      fixtureData.ourkadeAdmin
    ).CreateCompetition(defaultCompetitionParamBytes());

    return fixtureData;
  }

  describe("Deployment", function () {
    describe("Access Control Checks", function () {
      it("Should set the right AccessControl admin", async function () {
        const fixtureData = await loadFixture(contractDeployedOurkadeFixture);

        expect(
          await fixtureData.OurkadeAdmin.IsAccessAdmin(
            fixtureData.contractAdmin.address
          )
        ).to.equal(true);
      });
      it("Should not give false positives for admin role", async function () {
        const fixtureData = await loadFixture(contractDeployedOurkadeFixture);

        expect(
          await fixtureData.OurkadeAdmin.IsAccessAdmin(
            fixtureData.ourkadeAdmin.address
          )
        ).to.equal(false);
      });
    });

    describe("Admin Role Checks", function () {
      it("Should set the Ourkade Admin role", async function () {
        const fixtureData = await loadFixture(contractDeployedOurkadeFixture);
        // Admin will grant the role to otherAccount
        await expect(
          fixtureData.OurkadeAdmin.AddOurkadeAdmin(
            fixtureData.ourkadeAdmin.address
          )
        ).to.emit(fixtureData.OurkadeAdmin, "RoleGranted");
      });

      it("Confirm the other account was added as an Ourkade Admin", async function () {
        const fixtureData = await loadFixture(contractDeployedOurkadeFixture);
        await fixtureData.OurkadeAdmin.AddOurkadeAdmin(
          fixtureData.ourkadeAdmin.address
        );
        expect(
          await fixtureData.OurkadeAdmin.IsOurkadeAdmin(
            fixtureData.ourkadeAdmin.address
          )
        ).to.equal(true);
      });
    });

    describe("Operator Role Checks", function () {
      it("Check if Ourkade Admin can designate operators", async function () {
        const fixtureData = await loadFixture(contractDeployedOurkadeFixture);
        await fixtureData.OurkadeAdmin.AddOurkadeAdmin(
          fixtureData.ourkadeAdmin.address
        );
        expect(
          await fixtureData.OurkadeAdmin.connect(
            fixtureData.ourkadeAdmin
          ).AddOurkadeOperator(fixtureData.ourkadeOperator1.address)
        ).to.emit(fixtureData.OurkadeAdmin, "RoleGranted");
      });

      it("Check if Ourkade Operator was added", async function () {
        const fixtureData = await loadFixture(contractDeployedOurkadeFixture);
        await fixtureData.OurkadeAdmin.AddOurkadeAdmin(
          fixtureData.ourkadeAdmin.address
        );
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).AddOurkadeOperator(fixtureData.ourkadeOperator1.address);
        expect(
          await fixtureData.OurkadeAdmin.IsOurkadeOperator(
            fixtureData.ourkadeOperator1.address
          ),
          "Operator Is Operator"
        ).to.equal(true);
      });

      it("Check that contract admin is not an operator", async function () {
        const fixtureData = await loadFixture(contractDeployedOurkadeFixture);
        await fixtureData.OurkadeAdmin.AddOurkadeAdmin(
          fixtureData.ourkadeAdmin.address
        );
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).AddOurkadeOperator(fixtureData.ourkadeOperator1.address);
        expect(
          await fixtureData.OurkadeAdmin.IsOurkadeOperator(
            fixtureData.contractAdmin.address
          ),
          "Contract Admin is not Operator"
        ).to.equal(false);
      });

      it("Check that ourkade admin is not an operator", async function () {
        const fixtureData = await loadFixture(contractDeployedOurkadeFixture);
        await fixtureData.OurkadeAdmin.AddOurkadeAdmin(
          fixtureData.ourkadeAdmin.address
        );
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).AddOurkadeOperator(fixtureData.ourkadeOperator1.address);
        expect(
          await fixtureData.OurkadeAdmin.IsOurkadeOperator(
            fixtureData.ourkadeAdmin.address
          ),
          "Ourkade Admin is not Operator"
        ).to.equal(false);
      });
    });
  });
  describe("Game Tests", function () {
    it("Should allow Ourkade Admin to define a new game", async function () {
      const fixtureData = await loadFixture(rolesSetOurkadeFixture);
      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false)
      ).to.emit(fixtureData.OurkadeAdmin, "LogGame");
    });

    it("Should not allow a duplicate game to be created", async function () {
      const fixtureData = await loadFixture(rolesSetOurkadeFixture);
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeAdmin
      ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false);
      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false)
      ).to.be.revertedWith(
        "UnorderedKeySet(101) - Key already exists in the set."
      );
    });

    it("Should not allow a non-existing game to be disabled", async function () {
      const fixtureData = await loadFixture(rolesSetOurkadeFixture);
      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).DisableGameDefinition(uintToBytes(1))
      ).to.be.revertedWith("INVALID_GAME");
    });

    it("Should not allow a non admin to disable a game", async function () {
      const fixtureData = await loadFixture(rolesSetOurkadeFixture);
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeAdmin
      ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false);
      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.player1
        ).DisableGameDefinition(uintToBytes(1))
      ).to.be.revertedWith(
        accessControlError(fixtureData.player1.address, ROLE_ADMIN)
      );
    });

    it("Should allow an admin to disable a game", async function () {
      const fixtureData = await loadFixture(rolesSetOurkadeFixture);
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeAdmin
      ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false);
      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).DisableGameDefinition(uintToBytes(1))
      ).to.emit(fixtureData.OurkadeAdmin, "LogGame");
    });

    it("Should not allow a game to be disabled twice", async function () {
      const fixtureData = await loadFixture(rolesSetOurkadeFixture);
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeAdmin
      ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false);
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeAdmin
      ).DisableGameDefinition(uintToBytes(1));
      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).DisableGameDefinition(uintToBytes(1))
      ).to.be.revertedWith("GAME_NOT_ACTIVE");
    });
  });
  describe("Profile Creation", function () {
    it("Should allow admins to AdminCreateProfile", async function () {
      const fixtureData = await loadFixture(rolesSetOurkadeFixture);
      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).AdminCreateProfile(fixtureData.player1.address)
      ).to.emit(fixtureData.OurkadeAdmin, "LogPlayerProfile");
    });

    it("Should not allow non-admins to AdminCreateProfile", async function () {
      const fixtureData = await loadFixture(rolesSetOurkadeFixture);
      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.player1
        ).AdminCreateProfile(fixtureData.player2.address)
      ).to.be.revertedWith(
        accessControlError(fixtureData.player1.address, ROLE_ADMIN)
      );
    });

    it("Should not allow admins to create duplicate profile", async function () {
      const fixtureData = await loadFixture(rolesSetOurkadeFixture);
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeAdmin
      ).AdminCreateProfile(fixtureData.player1.address);
      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).AdminCreateProfile(fixtureData.player1.address)
      ).to.be.revertedWith(
        "UnorderedKeySet(101) - Key already exists in the set."
      );
    });

    it("Should allow wallets to CreateProfile", async function () {
      const fixtureData = await loadFixture(rolesSetOurkadeFixture);
      await expect(
        fixtureData.OurkadePlayer.connect(fixtureData.player1).CreateProfile()
      ).to.emit(fixtureData.OurkadeAdmin, "LogPlayerProfile");
    });

    it("Should not allow wallets to create duplicate profile", async function () {
      const fixtureData = await loadFixture(rolesSetOurkadeFixture);
      await fixtureData.OurkadePlayer.connect(
        fixtureData.player1
      ).CreateProfile();
      await expect(
        fixtureData.OurkadePlayer.connect(fixtureData.player1).CreateProfile()
      ).to.be.revertedWith(
        "UnorderedKeySet(101) - Key already exists in the set."
      );
    });

    it("Should create correct default profile", async function () {
      const fixtureData = await loadFixture(rolesSetOurkadeFixture);

      function profileCheck(_profile: Types.PlayerProfile): boolean {
        return (
          _profile.Tickets.eq(BigNumber.from(0)) &&
          _profile.CompetitionNonce.eq(BigNumber.from(0))
        );
      }

      await expect(
        await fixtureData.OurkadePlayer.connect(
          fixtureData.player1
        ).CreateProfile()
      )
        .to.emit(fixtureData.OurkadeAdmin, "LogPlayerProfile")
        .withArgs(
          fixtureData.player1.address,
          fixtureData.player1.address,
          Enums.ChangeType.Created,
          profileCheck
        );
    });

    it("Should be able to fetch profile", async function () {
      const fixtureData = await loadFixture(rolesSetOurkadeFixture);
      await fixtureData.OurkadePlayer.connect(
        fixtureData.player1
      ).CreateProfile();
      let createResult = await fixtureData.OurkadePlayer.callStatic[
        "GetPlayerProfile(address)"
      ](fixtureData.player1.address);
      expect(createResult.Tickets).to.equal(BigNumber.from(0));
      expect(createResult.CompetitionNonce).to.equal(BigNumber.from(0));
    });
  });

  describe("Ticket Deposits", function () {
    it("Should allow Ourkade Admin to deposit tickets", async function () {
      const fixtureData = await loadFixture(profilesCreatedOurkadeFixture);

      function ticketCheck(_profile: Types.PlayerProfile): boolean {
        return _profile.Tickets.eq(BigNumber.from(TEST_TICKET_AMOUNT));
      }

      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).DepositTickets(fixtureData.player1.address, TEST_TICKET_AMOUNT)
      )
        .to.emit(fixtureData.OurkadeAdmin, "LogPlayerProfile")
        .withArgs(
          fixtureData.ourkadeAdmin.address,
          fixtureData.player1.address,
          Enums.ChangeType.Updated,
          ticketCheck
        );

      let compareProfile = await fixtureData.OurkadePlayer.callStatic[
        "GetPlayerProfile(address)"
      ](fixtureData.player1.address);
      expect(compareProfile.Tickets).to.equal(
        BigNumber.from(TEST_TICKET_AMOUNT)
      );
    });

    it("Should require at least 1 ticket to be deposited", async function () {
      const fixtureData = await loadFixture(profilesCreatedOurkadeFixture);
      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).DepositTickets(fixtureData.player1.address, 0)
      ).to.be.revertedWith("INVALID_TICKET_DEPOSIT");
    });

    it("Should not allow Ourkade Admin to deposit tickets to invalid account", async function () {
      const fixtureData = await loadFixture(profilesCreatedOurkadeFixture);
      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).DepositTickets(fixtureData.contractAdmin.address, TEST_TICKET_AMOUNT)
      ).to.be.revertedWith("PROFILE_DOES_NOT_EXIST");
    });

    it("Should not allow non-admin to deposit tickets", async function () {
      const fixtureData = await loadFixture(profilesCreatedOurkadeFixture);
      await expect(
        fixtureData.OurkadeAdmin.connect(fixtureData.player1).DepositTickets(
          fixtureData.player2.address,
          TEST_TICKET_AMOUNT
        )
      ).to.be.revertedWith(
        accessControlError(fixtureData.player1.address, ROLE_ADMIN)
      );
    });
  });

  describe("Nodes", function () {
    describe("Assign Node", function () {
      it("Operator should not be able to assign node", async function () {
        const fixtureData = await loadFixture(profilesCreatedOurkadeFixture);
        await expect(
          fixtureData.OurkadeAdmin.connect(
            fixtureData.ourkadeOperator1
          ).NodeAssign(fixtureData.player2.address, 1)
        ).to.be.revertedWith(
          accessControlError(fixtureData.ourkadeOperator1.address, ROLE_ADMIN)
        );
      });

      it("Player should not be able to assign node", async function () {
        const fixtureData = await loadFixture(profilesCreatedOurkadeFixture);
        await expect(
          fixtureData.OurkadeAdmin.connect(fixtureData.player1).NodeAssign(
            fixtureData.player2.address,
            1
          )
        ).to.be.revertedWith(
          accessControlError(fixtureData.player1.address, ROLE_ADMIN)
        );
      });

      it("Admin should be able to assign 1 node", async function () {
        const fixtureData = await loadFixture(profilesCreatedOurkadeFixture);

        function nodeInfoCheck(_nodeInfo: Types.NodeInfo): boolean {
          return (
            _nodeInfo.PlayerProfileId == fixtureData.player2.address &&
            _nodeInfo.NodeId.eq(1) &&
            _nodeInfo.Status == Enums.NodeInfoStatus.Inactive
          );
        }

        function profileCheck(_profile: Types.PlayerProfile): boolean {
          return _profile.NodeCount.eq(BigNumber.from(1));
        }

        let transaction: any = await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).NodeAssign(fixtureData.player2.address, 1);
        // This is the syntax for getting the result to inspect events manually
        // let receipt: any = await transaction.wait();

        let expectedId: string = addressNumberToBytes32({
          Address: fixtureData.player2.address,
          Number: BigNumber.from(1),
        }).toLowerCase();

        await expect(transaction)
          .to.emit(fixtureData.OurkadeAdmin, "LogNodeInfo")
          .withArgs(
            fixtureData.ourkadeAdmin.address,
            expectedId,
            Enums.ChangeType.Created,
            nodeInfoCheck
          )
          .to.emit(fixtureData.OurkadeAdmin, "LogPlayerProfile")
          .withArgs(
            fixtureData.ourkadeAdmin.address,
            fixtureData.player2.address,
            Enums.ChangeType.Updated,
            profileCheck
          );
      });

      it("Admin should be able to assign multiple nodes", async function () {
        var addNodeCount: BigNumber = BigNumber.from(3);
        const fixtureData = await loadFixture(profilesCreatedOurkadeFixture);

        var checkedNodes = 0;

        function nodeInfoCheck(_nodeInfo: Types.NodeInfo): boolean {
          checkedNodes++;
          return (
            _nodeInfo.PlayerProfileId == fixtureData.player2.address &&
            _nodeInfo.NodeId.eq(checkedNodes) &&
            _nodeInfo.Status == Enums.NodeInfoStatus.Inactive
          );
        }

        function profileCheck(_profile: Types.PlayerProfile): boolean {
          return _profile.NodeCount.eq(addNodeCount);
        }

        let transaction: any = await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).NodeAssign(fixtureData.player2.address, addNodeCount);
        // This is the syntax for getting the result to inspect events manually
        let receipt: any = await transaction.wait();

        await expect(transaction)
          .to.emit(fixtureData.OurkadeAdmin, "LogNodeInfo")
          .withArgs(
            fixtureData.ourkadeAdmin.address,
            addressNumberToBytes32({
              Address: fixtureData.player2.address,
              Number: BigNumber.from(1),
            }).toLowerCase(),
            Enums.ChangeType.Created,
            nodeInfoCheck
          )
          .to.emit(fixtureData.OurkadeAdmin, "LogNodeInfo")
          .withArgs(
            fixtureData.ourkadeAdmin.address,
            addressNumberToBytes32({
              Address: fixtureData.player2.address,
              Number: BigNumber.from(2),
            }).toLowerCase(),
            Enums.ChangeType.Created,
            nodeInfoCheck
          )
          .to.emit(fixtureData.OurkadeAdmin, "LogNodeInfo")
          .withArgs(
            fixtureData.ourkadeAdmin.address,
            addressNumberToBytes32({
              Address: fixtureData.player2.address,
              Number: BigNumber.from(3),
            }).toLowerCase(),
            Enums.ChangeType.Created,
            nodeInfoCheck
          )
          .to.emit(fixtureData.OurkadeAdmin, "LogPlayerProfile")
          .withArgs(
            fixtureData.ourkadeAdmin.address,
            fixtureData.player2.address,
            Enums.ChangeType.Updated,
            profileCheck
          );
      });

      it("Admin should not be able to assign 0 nodes", async function () {
        const fixtureData = await loadFixture(profilesCreatedOurkadeFixture);

        await expect(
          fixtureData.OurkadeAdmin.connect(fixtureData.ourkadeAdmin).NodeAssign(
            fixtureData.player2.address,
            0
          )
        ).to.be.revertedWith("NODE_INVALID_QUANTITY");
      });

      it("Admin should not be able to assign nodes to a non-existant player", async function () {
        const fixtureData = await loadFixture(profilesCreatedOurkadeFixture);

        await expect(
          fixtureData.OurkadeAdmin.connect(fixtureData.ourkadeAdmin).NodeAssign(
            NON_EXISTING_PLAYER,
            1
          )
        ).to.be.revertedWith("PROFILE_DOES_NOT_EXIST");
      });
    });

    describe("Read Node Info", function () {
      it("Should be able to get node info by profile and number", async function () {
        const fixtureData = await loadFixture(nodesAssignedOurkadeFixture);

        // This fixture has three operators with two nodes each
        let operatorAddresses: string[] = [
          fixtureData.ourkadeOperator1.address.toLowerCase(),
          fixtureData.ourkadeOperator2.address.toLowerCase(),
          fixtureData.ourkadeOperator3.address.toLowerCase(),
        ];

        for (
          let operatorIndex = 0;
          operatorIndex < operatorAddresses.length;
          operatorIndex++
        ) {
          for (let nodeIndex = 1; nodeIndex <= 2; nodeIndex++) {
            let compareNodeInfo =
              await fixtureData.OurkadeNode.callStatic.GetNodeInfo(
                operatorAddresses[operatorIndex],
                nodeIndex
              );

            expect(compareNodeInfo.PlayerProfileId.toLowerCase()).to.equal(
              operatorAddresses[operatorIndex]
            );
            expect(compareNodeInfo.NodeId).to.equal(BigNumber.from(nodeIndex));
            expect(compareNodeInfo.LoyaltyLocked).to.be.empty;
            expect(compareNodeInfo.Status).to.equal(
              Enums.NodeInfoStatus.Inactive
            );
          }
        }
      });

      it("Should be able to get node info by index", async function () {
        const fixtureData = await loadFixture(nodesAssignedOurkadeFixture);

        // This test will focus on the count as opposed to who owns them
        let nodeCount: BigNumber =
          await fixtureData.OurkadeNode.callStatic.GetNodeInfoCount();

        expect(nodeCount).to.equal(6);

        for (let index = 0; index < nodeCount.toNumber(); index++) {
          let nodeId: string =
            await fixtureData.OurkadeNode.callStatic.GetNodeIdAtIndex(index);

          let addressInfo: AddressNumber = bytes32ToAddressNumber(nodeId);

          let fetchedNodeInfo =
            await fixtureData.OurkadeNode.callStatic.GetNodeInfo(
              addressInfo.Address,
              addressInfo.Number
            );

          expect(fetchedNodeInfo.PlayerProfileId.toLowerCase()).to.equal(
            addressInfo.Address.toLowerCase()
          );
          expect(fetchedNodeInfo.NodeId).to.equal(addressInfo.Number);
        }
      });

      it("Should not be able to get node info for a node an operator doesn't have", async function () {
        const fixtureData = await loadFixture(nodesAssignedOurkadeFixture);

        await expect(
          fixtureData.OurkadeNode.connect(fixtureData.ourkadeAdmin).GetNodeInfo(
            fixtureData.ourkadeOperator1.address,
            3
          )
        ).to.be.revertedWith("NODE_INFO_DOES_NOT_EXIST");
      });

      it("Should not be able to get node info for a non-existant operator", async function () {
        const fixtureData = await loadFixture(nodesAssignedOurkadeFixture);

        await expect(
          fixtureData.OurkadeNode.connect(fixtureData.ourkadeAdmin).GetNodeInfo(
            NON_EXISTING_PLAYER,
            1
          )
        ).to.be.revertedWith("NODE_INFO_DOES_NOT_EXIST");
      });

      it("Should not be able to get node index that doesn't exist", async function () {
        const fixtureData = await loadFixture(nodesAssignedOurkadeFixture);

        // Sample of how to get details of transaction
        // let transaction: any =  await fixtureData.contract.connect(fixtureData.ourkadeAdmin).GetNodeIdAtIndex(5);
        // let result: any = await transaction.wait();

        // Should revert without reason becase of incorrect array access
        await expect(
          fixtureData.OurkadeNode.connect(
            fixtureData.ourkadeAdmin
          ).GetNodeIdAtIndex(7)
        ).to.be.revertedWithPanic(0x32);
      });
    });

    it("Only Admin should be able to set staking requirement", async function () {
      const fixtureData = await loadFixture(nodesAssignedOurkadeFixture);

      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeOperator1
        ).NodeQueueTierSet(0, 0, 1)
      ).to.be.revertedWith(
        accessControlError(fixtureData.ourkadeOperator1.address, ROLE_ADMIN)
      );

      await expect(
        fixtureData.OurkadeAdmin.connect(fixtureData.player1).NodeQueueTierSet(
          0,
          0,
          1
        )
      ).to.be.revertedWith(
        accessControlError(fixtureData.player1.address, ROLE_ADMIN)
      );

      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).NodeQueueTierSet(0, 0, 1)
      ).to.not.be.reverted;

      expect(
        await fixtureData.OurkadeNode.connect(
          fixtureData.ourkadeOperator1
        ).NodeQueueTierGet(0)
      ).deep.equal([BigNumber.from(0), BigNumber.from(1)]);

      // Should not be able to set non-sequential queues
      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).NodeQueueTierSet(2, 0, 1)
      ).to.be.revertedWith("INVALID_NODE_TIER");

      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).NodeQueueTierSet(1, 5, 1)
      ).to.not.be.reverted;

      expect(
        await fixtureData.OurkadeNode.connect(
          fixtureData.ourkadeOperator1
        ).NodeQueueTierGet(1)
      ).deep.equal([BigNumber.from(5), BigNumber.from(1)]);
    });

    it("Should not be able to read a staking requirement that doesn't exist", async function () {
      const fixtureData = await loadFixture(nodesAssignedOurkadeFixture);

      await expect(
        fixtureData.OurkadeNode.connect(
          fixtureData.ourkadeOperator1
        ).NodeQueueTierGet(0)
      ).to.be.revertedWith("INVALID_NODE_TIER");
    });

    it("Anyone should be able to read the staking requirement", async function () {
      const fixtureData = await loadFixture(nodesAssignedOurkadeFixture);

      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).NodeQueueTierSet(0, 0, 1)
      ).to.not.be.reverted;

      expect(
        await fixtureData.OurkadeNode.connect(
          fixtureData.ourkadeOperator1
        ).NodeQueueTierGet(0)
      ).deep.equal([BigNumber.from(0), BigNumber.from(1)]);

      expect(
        await fixtureData.OurkadeNode.connect(
          fixtureData.player1
        ).NodeQueueTierGet(0)
      ).deep.equal([BigNumber.from(0), BigNumber.from(1)]);
    });

    it("Operator should be able to stake queue if requirement is met (including zero)", async function () {
      const fixtureData = await loadFixture(poolStakingSetOurkadeFixture);

      // This stakes the first pool which has a required rep of 0 according to the fixture
      expect(
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeOperator1
        ).NodeStakeQueueTier(1)
      ).to.emit(fixtureData.OurkadePlayer, "LogPlayerProfile");
    });

    it("Operator should not be able to stake without enough rep", async function () {
      const fixtureData = await loadFixture(poolStakingSetOurkadeFixture);

      // This stakes the first pool which has a required rep of 0 according to the fixture
      expect(
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeOperator1
        ).NodeStakeQueueTier(1)
      ).to.emit(fixtureData.OurkadePlayer, "LogPlayerProfile");

      // This stakes the second pool, which has a required rep of 1 according to the fixture
      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeOperator1
        ).NodeStakeQueueTier(1)
      ).to.be.revertedWith("INSUFFICIENT_LOYALTY");
    });

    it("Admin should be able to remove nodes", async function () {
      const fixtureData = await loadFixture(nodesAssignedOurkadeFixture);

      // Fixture sets up opeartors with 2 nodes
      // Take away 2 nodes from operator3
      expect(
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).NodeRemove(fixtureData.ourkadeOperator3.address, 2)
      ).to.emit(fixtureData.OurkadePlayer, "LogNodeInfo");

      // Verify the profile
      let updatedProfile: Types.PlayerProfile =
        await fixtureData.OurkadePlayer.callStatic["GetPlayerProfile(address)"](
          fixtureData.ourkadeOperator3.address
        );

      expect(updatedProfile.NodeCount).to.equal(0);
    });

    it("Operator should not be able to stake without nodes", async function () {
      const fixtureData = await loadFixture(poolStakingSetOurkadeFixture);

      // Take away 2 nodes from operator3
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeAdmin
      ).NodeRemove(fixtureData.ourkadeOperator3.address, 2);

      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeOperator3
        ).NodeStakeQueueTier(0)
      ).to.be.revertedWith("NODE_INFO_DOES_NOT_EXIST");
    });

    // should be able to turn nodes on
    it("Operator should be able to turn on a node", async function () {
      const fixtureData = await loadFixture(poolStakingSetOurkadeFixture);

      expect(
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeOperator1
        ).NodeStatusOnline(1)
      ).to.not.be.reverted;
    });

    it("Operator should not be able to turn on a node again", async function () {
      const fixtureData = await loadFixture(poolStakingSetOurkadeFixture);

      expect(
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeOperator1
        ).NodeStatusOnline(1)
      ).to.not.be.reverted;

      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeOperator1
        ).NodeStatusOnline(1)
      ).to.be.revertedWith("NODE_ALREADY_ACTIVE");
    });

    it("Operator should not be able to turn on a node they don't have", async function () {
      const fixtureData = await loadFixture(poolStakingSetOurkadeFixture);

      expect(
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeOperator1
        ).NodeStatusOnline(1)
      ).to.not.be.reverted;

      expect(
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeOperator1
        ).NodeStatusOnline(2)
      ).to.not.be.reverted;

      await expect(
        fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeOperator1
        ).NodeStatusOnline(3)
      ).to.be.revertedWith("NODE_INFO_DOES_NOT_EXIST");
    });

    it("Should be able to get queue length", async function () {
      const fixtureData = await loadFixture(poolStakingSetOurkadeFixture);

      // Node queue 0 length shold be 0 before nodes join
      expect(
        await fixtureData.OurkadeNode.connect(
          fixtureData.ourkadeAdmin
        ).NodeQueueGetLength()
      ).to.equal(0);

      // Stake a node and turn it on
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeOperator1
      ).NodeStakeQueueTier(1);
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeOperator1
      ).NodeStatusOnline(1);

      // Check length
      expect(
        await fixtureData.OurkadeNode.connect(
          fixtureData.ourkadeAdmin
        ).NodeQueueGetLength()
      ).to.equal(1);

      // Stake another node and turn it on
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeOperator1
      ).NodeStakeQueueTier(2);
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeOperator1
      ).NodeStatusOnline(2);

      // check length
      expect(
        await fixtureData.OurkadeNode.connect(
          fixtureData.ourkadeAdmin
        ).NodeQueueGetLength()
      ).to.equal(2);

      // turning off should leave the queue
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeOperator1
      ).NodeStatusOffline(2);

      // Need to manually compact to affect the queue length
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeAdmin
      ).NodeQueueCompact();

      expect(
        await fixtureData.OurkadeNode.connect(
          fixtureData.ourkadeAdmin
        ).NodeQueueGetLength()
      ).to.equal(1);

      // unstaking last tier should leave the queue
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeOperator1
      ).NodeUnstakeQueueTier(1);
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeAdmin
      ).NodeQueueCompact();
      expect(
        await fixtureData.OurkadeNode.connect(
          fixtureData.ourkadeAdmin
        ).NodeQueueGetLength()
      ).to.equal(0);
    });

    // Should be able to get length of node queue

    it("Should be able to get the nodes from the queue", async function () {
      const fixtureData = await loadFixture(poolJoinedOurkadeFixture);

      expect(
        await fixtureData.OurkadeNode.connect(
          fixtureData.ourkadeAdmin
        ).NodeQueueGetLength()
      ).to.equal(3);

      let [nodes, nextIndex, remaining] = await fixtureData.OurkadeNode.connect(
        fixtureData.ourkadeOperator1
      ).callStatic.NodeQueueGetEntries(0, 4, 1);

      let addressNumbers: AddressNumber[] = new Array();
      let checkAddresses: string[] = [
        fixtureData.ourkadeOperator1.address.toLowerCase(),
        fixtureData.ourkadeOperator2.address.toLowerCase(),
        fixtureData.ourkadeOperator3.address.toLowerCase(),
        fixtureData.ourkadeOperator1.address.toLowerCase(),
      ];

      // The queue should wrap around, and return nodes: 1,2,3,1 and start index at 1
      for (let index = 0; index < nodes.length; index++) {
        addressNumbers[index] = bytes32ToAddressNumber(nodes[index]);
        expect(addressNumbers[index].Address).to.equal(checkAddresses[index]);
        expect(addressNumbers[index].Number).to.equal(1);
      }

      expect(nextIndex).to.equal(1);
      expect(remaining).to.equal(1);

      // Set tier 1 to require no rep so we can stake it and get another turn
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeAdmin
      ).NodeQueueTierSet(1, 0, 2);

      // Staking should give extra turns
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeOperator1
      ).NodeStakeQueueTier(1);

      // Have it start at the 1 index to make sure
      // it will catch the 0 index twice
      [nodes, nextIndex, remaining] = await fixtureData.OurkadeNode.connect(
        fixtureData.ourkadeOperator1
      ).callStatic.NodeQueueGetEntries(1, 4, 1);

      addressNumbers = new Array();
      checkAddresses = [
        fixtureData.ourkadeOperator2.address.toLowerCase(),
        fixtureData.ourkadeOperator3.address.toLowerCase(),
        fixtureData.ourkadeOperator1.address.toLowerCase(),
        fixtureData.ourkadeOperator1.address.toLowerCase(),
      ];

      // Check the nodes staking information
      let compareNodeInfo =
        await fixtureData.OurkadeNode.callStatic.GetNodeInfo(
          fixtureData.ourkadeOperator1.address,
          1
        );
      expect(compareNodeInfo.LoyaltyLocked.length).equal(2);

      for (let index = 0; index < nodes.length; index++) {
        addressNumbers[index] = bytes32ToAddressNumber(nodes[index]);
        expect(addressNumbers[index].Address).to.equal(checkAddresses[index]);
        expect(addressNumbers[index].Number).to.equal(1);
      }

      expect(nextIndex).to.equal(1);
      expect(remaining).to.equal(1);

      // Turning offline should skip the node
      await fixtureData.OurkadeAdmin.connect(
        fixtureData.ourkadeOperator1
      ).NodeStatusOffline(1);

      [nodes, nextIndex, remaining] = await fixtureData.OurkadeNode.connect(
        fixtureData.ourkadeOperator1
      ).callStatic.NodeQueueGetEntries(0, 4, 1);

      // Operator1 (0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC) should get compacted

      addressNumbers = new Array();
      // When the queue compacts it moves the last node to the item that was removed
      // which means the sequence should now go 2, 3, compact, 3 (moved to first), 2.
      checkAddresses = [
        fixtureData.ourkadeOperator2.address.toLowerCase(),
        fixtureData.ourkadeOperator3.address.toLowerCase(),
        fixtureData.ourkadeOperator3.address.toLowerCase(),
        fixtureData.ourkadeOperator2.address.toLowerCase(),
      ];

      for (let index = 0; index < nodes.length; index++) {
        addressNumbers[index] = bytes32ToAddressNumber(nodes[index]);
        expect(addressNumbers[index].Address).to.equal(checkAddresses[index]);
        expect(addressNumbers[index].Number).to.equal(1);
      }

      expect(nextIndex).to.equal(0);
      expect(remaining).to.equal(1);

      // Call it again not-static to apply the changes
      await fixtureData.OurkadeNode.connect(
        fixtureData.ourkadeOperator1
      ).NodeQueueGetEntries(0, 4, 1);

      // And the queue should have compacted so the length should now be 2
      expect(
        await fixtureData.OurkadeNode.connect(
          fixtureData.ourkadeAdmin
        ).NodeQueueGetLength()
      ).to.equal(2);
    });

    // TODO: PICK UP HERE Fix all these tests...

    // Unstaking should reduce number of turns in the queue

    // ?turning on should join the queue?

    // should not be able to turn nodes off again

    // These require rep changes to join multiple queues and check rep failures
    // TODO: Player with negative rep cannot buy a node
    // TODO: Admin should be able to remove node, and it should unstake
    // TODO: Player should be able to put nodes online which joins all staked queues
    // TODO: Player should be able to stake another queue for an online node and auto join
    // TODO: Player should be able to unstake a queue and receive loyalty back
    // TODO: Player should be able to put nodes offline which leaves all queues.
    // TODO: Should be able to get N items from queue each queue, which should wrap and ignore offline nodes
    // TODO: Queue should auto-compact
    // TODO: Admin should be able to reset each node queue which removes all nodes
  });

  describe("Competition", function () {
    describe("Create Competition", function () {
      it("Should require the game type to exist", async function () {
        const fixtureData = await loadFixture(poolJoinedOurkadeFixture);
        await expect(
          fixtureData.OurkadeCompetition.connect(
            fixtureData.ourkadeOperator1
          ).CreateCompetition(defaultCompetitionParamBytes())
        ) // Matches per Round
          .to.be.revertedWith("INVALID_GAME");
      });

      it("Should require the game type to be active", async function () {
        const fixtureData = await loadFixture(poolJoinedOurkadeFixture);
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false);
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).DisableGameDefinition(uintToBytes(1));
        await expect(
          fixtureData.OurkadeCompetition.connect(
            fixtureData.ourkadeAdmin
          ).CreateCompetition(defaultCompetitionParamBytes())
        ) // Matches per Round
          .to.be.revertedWith("GAME_NOT_ACTIVE");
      });

      it("Should require player creators to give tickets as reward", async function () {
        const fixtureData = await loadFixture(poolJoinedOurkadeFixture);
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false);

        let brokenParams = defaultCompetitionParams();
        brokenParams.CurrencyType = Enums.CurrencyType.Reward;

        await expect(
          fixtureData.OurkadeCompetition.connect(
            fixtureData.player1
          ).CreateCompetition(competitionParamsToBytes(brokenParams))
        ).to.be.revertedWith("INVALID_REWARD");

        brokenParams.CurrencyType = Enums.CurrencyType.Honor;
        await expect(
          fixtureData.OurkadeCompetition.connect(
            fixtureData.player1
          ).CreateCompetition(competitionParamsToBytes(brokenParams))
        ).to.be.revertedWith("INVALID_REWARD");
      });

      it("Should require player creators to have enough tickets", async function () {
        const fixtureData = await loadFixture(poolJoinedOurkadeFixture);
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false);

        let playerParams = defaultCompetitionParams();
        playerParams.CurrencyType = Enums.CurrencyType.Ticket;

        await expect(
          fixtureData.OurkadeCompetition.connect(
            fixtureData.player1
          ).CreateCompetition(competitionParamsToBytes(playerParams))
        ).to.be.revertedWith("INSUFFICIENT_BALANCE");
      });

      it("Should allow players to create a competition", async function () {
        const fixtureData = await loadFixture(poolJoinedOurkadeFixture);
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false);
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).DepositTickets(fixtureData.player1.address, 100);

        let playerParams = defaultCompetitionParams();
        playerParams.CurrencyType = Enums.CurrencyType.Ticket;

        await expect(
          fixtureData.OurkadeCompetition.connect(
            fixtureData.player1
          ).CreateCompetition(competitionParamsToBytes(playerParams))
        ).to.emit(fixtureData.OurkadeAdmin, "LogCompetition");
      });

      it("Should deduct the initial prize from the creator", async function () {
        const fixtureData = await loadFixture(poolJoinedOurkadeFixture);

        let prizeAmount = 90;

        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false);
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).DepositTickets(fixtureData.player1.address, prizeAmount);

        let originalProfile: Types.PlayerProfile =
          await fixtureData.OurkadePlayer.callStatic[
            "GetPlayerProfile(address)"
          ](fixtureData.player1.address);

        let playerParams = defaultCompetitionParams();
        playerParams.CurrencyType = Enums.CurrencyType.Ticket;

        // The competition ID is a bytes 32 starting with the player, ending with an auto incremented number
        let competitionCheckId =
          fixtureData.player1.address.toLowerCase() +
          "000000000000000000000000";

        await expect(
          fixtureData.OurkadeCompetition.connect(
            fixtureData.player1
          ).CreateCompetition(competitionParamsToBytes(playerParams))
        )
          .to.emit(fixtureData.OurkadeAdmin, "LogCompetition")
          .withArgs(
            fixtureData.player1.address,
            competitionCheckId,
            Enums.ChangeType.Created,
            anyValue
          );

        let updatedProfile: Types.PlayerProfile =
          await fixtureData.OurkadePlayer.callStatic[
            "GetPlayerProfile(address)"
          ](fixtureData.player1.address);

        expect(
          originalProfile.Tickets.eq(updatedProfile.Tickets.sub(prizeAmount))
        );
      });

      it("Should allow admins to create competitions with all prize types without balance", async function () {
        const fixtureData = await loadFixture(poolJoinedOurkadeFixture);
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).CreateGameDefinition(uintToBytes(1), "FLAPPY", true);

        let testParams = defaultCompetitionParams();
        testParams.CurrencyType = Enums.CurrencyType.Honor;
        let competitionCheckId =
          fixtureData.ourkadeAdmin.address.toLowerCase() +
          "000000000000000000000000";

        await expect(
          fixtureData.OurkadeCompetition.connect(
            fixtureData.ourkadeAdmin
          ).CreateCompetition(competitionParamsToBytes(testParams))
        ).to.emit(fixtureData.OurkadeAdmin, "LogCompetition");

        // .withArgs(
        //   fixtureData.ourkadeAdmin.address,
        //   competitionCheckId,
        //   Enums.ChangeType.Created,
        //   anyValue
        // );

        testParams.CurrencyType = Enums.CurrencyType.Reward;

        await expect(
          fixtureData.OurkadeCompetition.connect(
            fixtureData.ourkadeAdmin
          ).CreateCompetition(competitionParamsToBytes(testParams))
        ).to.emit(fixtureData.OurkadeAdmin, "LogCompetition");
        // .withArgs(
        //   fixtureData.ourkadeAdmin.address,
        //   competitionCheckId,
        //   Enums.ChangeType.Created,
        //   anyValue
        // );

        testParams.CurrencyType = Enums.CurrencyType.Reward;

        await expect(
          fixtureData.OurkadeCompetition.connect(
            fixtureData.ourkadeAdmin
          ).CreateCompetition(competitionParamsToBytes(testParams))
        ).to.emit(fixtureData.OurkadeAdmin, "LogCompetition");
        // .withArgs(
        //   fixtureData.ourkadeAdmin.address,
        //   competitionCheckId,
        //   Enums.ChangeType.Created,
        //   anyValue
        // );
      });

      // Judges should be the first X nodes in the queue, based on the configuration
      it("Should set judges properly", async function () {
        const fixtureData = await loadFixture(poolJoinedOurkadeFixture);
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false);

        let testParams = defaultCompetitionParams();
        testParams.CurrencyType = Enums.CurrencyType.Honor;

        let competitionCheckId =
          fixtureData.ourkadeAdmin.address.toLowerCase() +
          "000000000000000000000000";

        function judgesCheck(_competition: Types.Competition) {
          expect(_competition.Judges[0]).to.equal(
            addressAndNumberToBytes(
              fixtureData.ourkadeOperator1.address,
              BigNumber.from(1)
            )
          );
          expect(_competition.Judges[1]).to.equal(
            addressAndNumberToBytes(
              fixtureData.ourkadeOperator2.address,
              BigNumber.from(1)
            )
          );
          expect(_competition.Judges[2]).to.equal(
            addressAndNumberToBytes(
              fixtureData.ourkadeOperator3.address,
              BigNumber.from(1)
            )
          );
          return true;
        }

        await expect(
          fixtureData.OurkadeCompetition.connect(
            fixtureData.ourkadeAdmin
          ).CreateCompetition(competitionParamsToBytes(testParams))
        )
          .to.emit(fixtureData.OurkadeAdmin, "LogCompetition")
          .withArgs(
            fixtureData.ourkadeAdmin.address,
            competitionCheckId,
            Enums.ChangeType.Created,
            judgesCheck
          );
      });
    });

    describe("Join Competition", function () {
      it("Should check entry fee upon joining", async function () {
        const fixtureData = await loadFixture(poolJoinedOurkadeFixture);
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false);

        var createTx = await fixtureData.OurkadeCompetition.connect(
          fixtureData.ourkadeAdmin
        ).CreateCompetition(defaultCompetitionParamBytes());

        let createResult = await createTx.wait();

        let competitionId: string =
          fixtureData.ourkadeAdmin.address + "000000000000000000000000";

        //data is not returning properly
        // let newMatch: Types.Competition = createResult!.events![0]
        //   .args![3] as unknown as Types.Competition;

        await expect(
          fixtureData.OurkadePlayer.connect(
            fixtureData.player1
          ).RegisterForMatch(competitionId, NULL_BYTES32)
        ).to.be.revertedWith("MATCH_NOT_ELIGIBLE");
      });

      it("Should correctly set the Player in match", async function () {
        const fixtureData = await poolJoinedOurkadeFixture();
        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).CreateGameDefinition(uintToBytes(1), "FLAPPY", false);

        var createTx = await fixtureData.OurkadeCompetition.connect(
          fixtureData.ourkadeAdmin
        ).CreateCompetition(defaultCompetitionParamBytes());

        let createResult = await createTx.wait();

        let competitionId: string =
          fixtureData.ourkadeAdmin.address + "000000000000000000000000";

        let competitionCheckId =
          fixtureData.ourkadeAdmin.address.toLowerCase() +
          "000000000000000000000000";

        //data is not returning properly
        // let newMatch: Types.Competition = createResult!.events![0]
        //   .args![3] as unknown as Types.Competition;

        function competitionCheck(_competition: Types.Competition): boolean {
          return _competition.Matches[0].Player == fixtureData.player1.address;
        }

        await fixtureData.OurkadeAdmin.connect(
          fixtureData.ourkadeAdmin
        ).DepositTickets(fixtureData.player1.address, TEST_TICKET_AMOUNT);

        await expect(
          fixtureData.OurkadePlayer.connect(
            fixtureData.player1
          ).RegisterForMatch(competitionId, NULL_BYTES32)
        )
          .to.emit(fixtureData.OurkadeAdmin, "LogCompetition")
          .withArgs(
            fixtureData.player1.address,
            competitionCheckId,
            Enums.ChangeType.Updated,
            competitionCheck
          );
      });

      it("Should not allow joining a competition that does not exist", async function () {
        const fixtureData = await poolJoinedOurkadeFixture();

        await expect(
          fixtureData.OurkadePlayer.connect(
            fixtureData.player1
          ).RegisterForMatch(NULL_BYTES32, NULL_BYTES32)
        ).to.be.revertedWith("COMPETITION_DOES_NOT_EXIST");
      });

      // Saving these tests for later. Trying to do the happy path first
      // it("Should check if the competition is still ongoing", async function () {
      //   const fixtureData = await loadFixture(competitionCreated);
      //   assert.fail("NOT IMPLEMENTED");
      // });

      // it("Should check if the player is allowed to join", async function () {
      //   const fixtureData = await loadFixture(competitionCreated);
      //   assert.fail("NOT IMPLEMENTED");
      // });

      // it("Should check if there is room for the player", async function () {
      //   const fixtureData = await loadFixture(competitionCreated);
      //   assert.fail("NOT IMPLEMENTED");
      // });

      // it("Should check if the player has sufficient balance to join", async function () {
      //   const fixtureData = await loadFixture(competitionCreated);
      //   assert.fail("NOT IMPLEMENTED");
      // });

      // it("Should deduct tickets from player upon joining", async function () {
      //   const fixtureData = await loadFixture(competitionCreated);
      //   assert.fail("NOT IMPLEMENTED");
      // });

      // it("Should send information about how to play the match", async function () {
      //   const fixtureData = await loadFixture(competitionCreated);
      //   assert.fail("NOT IMPLEMENTED");
      // });

      // it("Should not allow the player to enter the competition twice", async function () {
      //   const fixtureData = await loadFixture(competitionCreated);
      //   assert.fail("NOT IMPLEMENTED");
      // });

      // it("Should not allow the player to submit a score for the same match twice", async function () {
      //   const fixtureData = await loadFixture(competitionCreated);
      //   assert.fail("NOT IMPLEMENTED");
      // });

      // it("Should not allow othe player to play more rounds than they should", async function () {
      //   const fixtureData = await loadFixture(competitionCreated);
      //   assert.fail("NOT IMPLEMENTED");
      // });
    });
    describe("Dispute Competition", function () {
      // Should not allow a player to dispute if they don't have enough tickets
      // Should not allow a player to dispute the match twice
      // A second disputer should be in the array
    });
    describe("Score Competition", function () {
      it("Should allow a valid competition to be scored", async function () {
        const fixtureData = await competitionCreatedFixture();

        let profileBeforeJoining: Types.PlayerProfile =
          await fixtureData.OurkadePlayer.callStatic[
            "GetPlayerProfile(address)"
          ](fixtureData.player3.address);

        expect(profileBeforeJoining.Tickets).to.equal(TEST_TICKET_AMOUNT);
        expect(profileBeforeJoining.Rewards).to.equal(0);
        expect(profileBeforeJoining.Loyalty).to.equal(0);

        let competitionCheckId =
          fixtureData.ourkadeAdmin.address.toLowerCase() +
          "000000000000000000000000";

        // Competition id is the creator + an incremented index.
        let competitionId: string =
          fixtureData.ourkadeAdmin.address + "000000000000000000000000";
        // Competition has been created, now the players need to join it.
        await fixtureData.OurkadePlayer.connect(
          fixtureData.player1
        ).RegisterForMatch(competitionId, NULL_BYTES32);
        await fixtureData.OurkadePlayer.connect(
          fixtureData.player1
        ).SubmitMatch(competitionId, NULL_BYTES32, 100);

        await fixtureData.OurkadePlayer.connect(
          fixtureData.player2
        ).RegisterForMatch(competitionId, NULL_BYTES32);
        await fixtureData.OurkadePlayer.connect(
          fixtureData.player2
        ).SubmitMatch(competitionId, NULL_BYTES32, 200);

        await fixtureData.OurkadePlayer.connect(
          fixtureData.player3
        ).RegisterForMatch(competitionId, NULL_BYTES32);
        await fixtureData.OurkadePlayer.connect(
          fixtureData.player3
        ).SubmitMatch(competitionId, NULL_BYTES32, 300);

        let profileAfterJoining: Types.PlayerProfile =
          await fixtureData.OurkadePlayer.callStatic[
            "GetPlayerProfile(address)"
          ](fixtureData.player3.address);
        expect(profileAfterJoining.Tickets).to.equal(9);
        expect(profileAfterJoining.Rewards).to.equal(0);
        expect(profileAfterJoining.Loyalty).to.equal(0);
        expect(profileAfterJoining.Reputation).to.equal(0);

        // Player 3 should win based on the scores submitted

        // Get the ID of the first node in the queue
        // that node should be able to score
        let [nodes, ,] = await fixtureData.OurkadeNode.connect(
          fixtureData.ourkadeOperator1
        ).callStatic.NodeQueueGetEntries(0, 1, 1);

        expect(bytes32ToAddressNumber(nodes[0]).Address).to.equal(
          fixtureData.ourkadeOperator1.address.toLowerCase()
        );

        let nodeProfileBeforeScoring: Types.PlayerProfile =
          await fixtureData.OurkadePlayer.callStatic[
            "GetPlayerProfile(address)"
          ](fixtureData.ourkadeOperator1.address);

        expect(nodeProfileBeforeScoring.Reputation).to.equal(10000);

        await expect(
          fixtureData.OurkadePlayer.connect(
            fixtureData.ourkadeOperator1
          ).ScoreCompetition(competitionId, 1)
        ).to.be.revertedWith("PENDING_COMPETITION");

        // Fast forward to the correct time.
        await time.increase(60 * 60 + 1);

        await expect(
          fixtureData.OurkadePlayer.connect(
            fixtureData.ourkadeOperator1
          ).ScoreCompetition(competitionId, 1)
        ).to.not.be.reverted;

        let profileAfterWinning: Types.PlayerProfile =
          await fixtureData.OurkadePlayer.callStatic[
            "GetPlayerProfile(address)"
          ](fixtureData.player3.address);

        expect(profileAfterWinning.Tickets).to.equal(9);
        expect(profileAfterWinning.Rewards).to.equal(90);
        expect(profileAfterWinning.Loyalty).to.equal(385546794);
        expect(profileAfterWinning.Reputation).to.equal(100);

        let nodeProfileAfterScoring: Types.PlayerProfile =
          await fixtureData.OurkadePlayer.callStatic[
            "GetPlayerProfile(address)"
          ](fixtureData.ourkadeOperator1.address);

        // Node only earns 50% because its current rep is 100
        expect(nodeProfileAfterScoring.Rewards).to.equal(5);
        // TODO: Check the profile of the node to see if their reputation and loyalty increased correctly
        // expect(nodeProfileAfterScoring.Loyalty).to.equal(30);
        // expect(nodeProfileAfterScoring.Reputation).to.equal(30);

        // TODO: Continue this test and confirm the scoring was handled properly.

        // TODO: Player shouldn't be able to submit multiple scores?
      });
    });
    describe("Cancel Competition", function () {});
  });

  describe("Dispute", function () {});

  describe("External Contract Checks", function () {});

  describe("Withdrawal", function () {});

  // TODO: Should not be able to submit a dispute outside the window
  // TODO: Should not be able to submit a dispute if not in the competition
  // TODO: Should not be able to submit a dispute against self
  // TODO: Should not be able to submit a dispute if reputation is too low
  // TODO: Should not be able to submit a dispute until the match has been submitted

  // TODO: Should not be able to perform actions as a disabled player
  // TODO: Games for a disabled player should still finish scoring correctly
  // TODO: Disputes from a disabled player should still finish correctly
  // TODO: Should be able to fetch a disabled player's profile

  // TODO: Only Admins should be able to set player ranks
  // TODO: Players must exist for rank to be set
  // TODO: Game must exist for rank to be set

 
});
