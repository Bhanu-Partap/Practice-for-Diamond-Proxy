/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  Ourkadelib,
  OurkadelibInterface,
} from "../../../../contracts/ourkade/library/Ourkadelib";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address[]",
        name: "assigned",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "enum AssignedAction",
        name: "action",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "bytes",
        name: "key",
        type: "bytes",
      },
    ],
    name: "LogActionAssigned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "assigned",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum AssignedAction",
        name: "action",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "bytes",
        name: "key",
        type: "bytes",
      },
    ],
    name: "LogActionCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "enum ChangeType",
        name: "change",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "CompetitionId",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "GameDefinition",
            type: "bytes32",
          },
          {
            internalType: "bool",
            name: "EligibleByTicket",
            type: "bool",
          },
          {
            internalType: "uint64",
            name: "EligibleLoyalty",
            type: "uint64",
          },
          {
            internalType: "int16",
            name: "EligibleReputation",
            type: "int16",
          },
          {
            internalType: "uint8",
            name: "EligibleRankMinimum",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "EligibleRankMaximum",
            type: "uint8",
          },
          {
            internalType: "uint16",
            name: "EligibleEloMinimum",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "EligibleEloMaximum",
            type: "uint16",
          },
          {
            internalType: "enum CurrencyType",
            name: "CurrencyType",
            type: "uint8",
          },
          {
            internalType: "enum PrizeType",
            name: "PrizeType",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "PrizePool",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "NodeReward",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "EntryFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "MinimumPlayers",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "MaximumPlayers",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "Players",
            type: "address[]",
          },
          {
            components: [
              {
                internalType: "bytes",
                name: "DataPin",
                type: "bytes",
              },
              {
                internalType: "uint8",
                name: "Round",
                type: "uint8",
              },
              {
                internalType: "address",
                name: "Player",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "Score",
                type: "uint256",
              },
              {
                internalType: "enum MatchStatus",
                name: "Status",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "StartTime",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "EndTime",
                type: "uint256",
              },
            ],
            internalType: "struct Match[]",
            name: "Matches",
            type: "tuple[]",
          },
          {
            internalType: "uint256[]",
            name: "MatchScoreData",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "EndTime",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "MatchesPerRound",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "MatchDuration",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "HasDisputes",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "DataPin",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "Judges",
            type: "bytes32[]",
          },
          {
            internalType: "enum CompetitionStatus",
            name: "Status",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType: "struct Competition",
        name: "competition",
        type: "tuple",
      },
    ],
    name: "LogCompetition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "enum ChangeType",
        name: "change",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "GameDefinitionId",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "Name",
            type: "string",
          },
          {
            internalType: "bool",
            name: "IsMultiplayer",
            type: "bool",
          },
          {
            internalType: "enum GameDefinitionStatus",
            name: "Status",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType: "struct GameDefinition",
        name: "game",
        type: "tuple",
      },
    ],
    name: "LogGame",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "enum ChangeType",
        name: "change",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "address",
            name: "PlayerProfileId",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "NodeId",
            type: "uint96",
          },
          {
            internalType: "uint64[]",
            name: "LoyaltyLocked",
            type: "uint64[]",
          },
          {
            internalType: "enum NodeInfoStatus",
            name: "Status",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType: "struct NodeInfo",
        name: "info",
        type: "tuple",
      },
    ],
    name: "LogNodeInfo",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
    ],
    name: "LogNodeQueueJoin",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
    ],
    name: "LogNodeQueueLeave",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "LogNodeQueueRebuild",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "key",
        type: "address",
      },
      {
        indexed: true,
        internalType: "enum ChangeType",
        name: "change",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "PlayerProfileId",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "Tickets",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "Rewards",
            type: "uint256",
          },
          {
            internalType: "uint64",
            name: "Loyalty",
            type: "uint64",
          },
          {
            internalType: "int32",
            name: "Reputation",
            type: "int32",
          },
          {
            internalType: "uint96",
            name: "CompetitionNonce",
            type: "uint96",
          },
          {
            internalType: "uint256",
            name: "LastGameTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "GuiltyCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "LastGuiltyTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint96",
            name: "NodeCount",
            type: "uint96",
          },
          {
            internalType: "enum PlayerProfileStatus",
            name: "Status",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType: "struct PlayerProfile",
        name: "profile",
        type: "tuple",
      },
    ],
    name: "LogPlayerProfile",
    type: "event",
  },
] as const;

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220dcc2ec9300d70d3bb62829546ce276115f39c43fae13808736623b9dcb34d62f64736f6c63430008110033";

type OurkadelibConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OurkadelibConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Ourkadelib__factory extends ContractFactory {
  constructor(...args: OurkadelibConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Ourkadelib> {
    return super.deploy(overrides || {}) as Promise<Ourkadelib>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Ourkadelib {
    return super.attach(address) as Ourkadelib;
  }
  override connect(signer: Signer): Ourkadelib__factory {
    return super.connect(signer) as Ourkadelib__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OurkadelibInterface {
    return new utils.Interface(_abi) as OurkadelibInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Ourkadelib {
    return new Contract(address, _abi, signerOrProvider) as Ourkadelib;
  }
}