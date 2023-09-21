/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  Signer,
  utils,
} from "ethers";
import type { EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export type MatchStruct = {
  DataPin: PromiseOrValue<BytesLike>;
  Round: PromiseOrValue<BigNumberish>;
  Player: PromiseOrValue<string>;
  Score: PromiseOrValue<BigNumberish>;
  Status: PromiseOrValue<BigNumberish>;
  StartTime: PromiseOrValue<BigNumberish>;
  EndTime: PromiseOrValue<BigNumberish>;
};

export type MatchStructOutput = [
  string,
  number,
  string,
  BigNumber,
  number,
  BigNumber,
  BigNumber
] & {
  DataPin: string;
  Round: number;
  Player: string;
  Score: BigNumber;
  Status: number;
  StartTime: BigNumber;
  EndTime: BigNumber;
};

export type CompetitionStruct = {
  CompetitionId: PromiseOrValue<BytesLike>;
  GameDefinition: PromiseOrValue<BytesLike>;
  EligibleByTicket: PromiseOrValue<boolean>;
  EligibleLoyalty: PromiseOrValue<BigNumberish>;
  EligibleReputation: PromiseOrValue<BigNumberish>;
  EligibleRankMinimum: PromiseOrValue<BigNumberish>;
  EligibleRankMaximum: PromiseOrValue<BigNumberish>;
  EligibleEloMinimum: PromiseOrValue<BigNumberish>;
  EligibleEloMaximum: PromiseOrValue<BigNumberish>;
  CurrencyType: PromiseOrValue<BigNumberish>;
  PrizeType: PromiseOrValue<BigNumberish>;
  PrizePool: PromiseOrValue<BigNumberish>;
  NodeReward: PromiseOrValue<BigNumberish>;
  EntryFee: PromiseOrValue<BigNumberish>;
  MinimumPlayers: PromiseOrValue<BigNumberish>;
  MaximumPlayers: PromiseOrValue<BigNumberish>;
  Players: PromiseOrValue<string>[];
  Matches: MatchStruct[];
  MatchScoreData: PromiseOrValue<BigNumberish>[];
  EndTime: PromiseOrValue<BigNumberish>;
  MatchesPerRound: PromiseOrValue<BigNumberish>;
  MatchDuration: PromiseOrValue<BigNumberish>;
  HasDisputes: PromiseOrValue<boolean>;
  DataPin: PromiseOrValue<BytesLike>;
  Judges: PromiseOrValue<BytesLike>[];
  Status: PromiseOrValue<BigNumberish>;
};

export type CompetitionStructOutput = [
  string,
  string,
  boolean,
  BigNumber,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  string[],
  MatchStructOutput[],
  BigNumber[],
  BigNumber,
  number,
  BigNumber,
  boolean,
  string,
  string[],
  number
] & {
  CompetitionId: string;
  GameDefinition: string;
  EligibleByTicket: boolean;
  EligibleLoyalty: BigNumber;
  EligibleReputation: number;
  EligibleRankMinimum: number;
  EligibleRankMaximum: number;
  EligibleEloMinimum: number;
  EligibleEloMaximum: number;
  CurrencyType: number;
  PrizeType: number;
  PrizePool: BigNumber;
  NodeReward: BigNumber;
  EntryFee: BigNumber;
  MinimumPlayers: BigNumber;
  MaximumPlayers: BigNumber;
  Players: string[];
  Matches: MatchStructOutput[];
  MatchScoreData: BigNumber[];
  EndTime: BigNumber;
  MatchesPerRound: number;
  MatchDuration: BigNumber;
  HasDisputes: boolean;
  DataPin: string;
  Judges: string[];
  Status: number;
};

export type GameDefinitionStruct = {
  GameDefinitionId: PromiseOrValue<BytesLike>;
  Name: PromiseOrValue<string>;
  IsMultiplayer: PromiseOrValue<boolean>;
  Status: PromiseOrValue<BigNumberish>;
};

export type GameDefinitionStructOutput = [string, string, boolean, number] & {
  GameDefinitionId: string;
  Name: string;
  IsMultiplayer: boolean;
  Status: number;
};

export type NodeInfoStruct = {
  PlayerProfileId: PromiseOrValue<string>;
  NodeId: PromiseOrValue<BigNumberish>;
  LoyaltyLocked: PromiseOrValue<BigNumberish>[];
  Status: PromiseOrValue<BigNumberish>;
};

export type NodeInfoStructOutput = [string, BigNumber, BigNumber[], number] & {
  PlayerProfileId: string;
  NodeId: BigNumber;
  LoyaltyLocked: BigNumber[];
  Status: number;
};

export type PlayerProfileStruct = {
  PlayerProfileId: PromiseOrValue<BytesLike>;
  Tickets: PromiseOrValue<BigNumberish>;
  Rewards: PromiseOrValue<BigNumberish>;
  Loyalty: PromiseOrValue<BigNumberish>;
  Reputation: PromiseOrValue<BigNumberish>;
  CompetitionNonce: PromiseOrValue<BigNumberish>;
  LastGameTimestamp: PromiseOrValue<BigNumberish>;
  GuiltyCount: PromiseOrValue<BigNumberish>;
  LastGuiltyTimestamp: PromiseOrValue<BigNumberish>;
  NodeCount: PromiseOrValue<BigNumberish>;
  Status: PromiseOrValue<BigNumberish>;
};

export type PlayerProfileStructOutput = [
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  number,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  number
] & {
  PlayerProfileId: string;
  Tickets: BigNumber;
  Rewards: BigNumber;
  Loyalty: BigNumber;
  Reputation: number;
  CompetitionNonce: BigNumber;
  LastGameTimestamp: BigNumber;
  GuiltyCount: BigNumber;
  LastGuiltyTimestamp: BigNumber;
  NodeCount: BigNumber;
  Status: number;
};

export interface OurkadelibInterface extends utils.Interface {
  functions: {};

  events: {
    "LogActionAssigned(address[],uint8,bytes)": EventFragment;
    "LogActionCompleted(address,uint8,bytes)": EventFragment;
    "LogCompetition(address,bytes32,uint8,tuple)": EventFragment;
    "LogGame(address,bytes32,uint8,tuple)": EventFragment;
    "LogNodeInfo(address,bytes32,uint8,tuple)": EventFragment;
    "LogNodeQueueJoin(address,bytes32)": EventFragment;
    "LogNodeQueueLeave(address,bytes32)": EventFragment;
    "LogNodeQueueRebuild(address)": EventFragment;
    "LogPlayerProfile(address,address,uint8,tuple)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "LogActionAssigned"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogActionCompleted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogCompetition"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogGame"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogNodeInfo"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogNodeQueueJoin"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogNodeQueueLeave"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogNodeQueueRebuild"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogPlayerProfile"): EventFragment;
}

export interface LogActionAssignedEventObject {
  assigned: string[];
  action: number;
  key: string;
}
export type LogActionAssignedEvent = TypedEvent<
  [string[], number, string],
  LogActionAssignedEventObject
>;

export type LogActionAssignedEventFilter =
  TypedEventFilter<LogActionAssignedEvent>;

export interface LogActionCompletedEventObject {
  assigned: string;
  action: number;
  key: string;
}
export type LogActionCompletedEvent = TypedEvent<
  [string, number, string],
  LogActionCompletedEventObject
>;

export type LogActionCompletedEventFilter =
  TypedEventFilter<LogActionCompletedEvent>;

export interface LogCompetitionEventObject {
  sender: string;
  key: string;
  change: number;
  competition: CompetitionStructOutput;
}
export type LogCompetitionEvent = TypedEvent<
  [string, string, number, CompetitionStructOutput],
  LogCompetitionEventObject
>;

export type LogCompetitionEventFilter = TypedEventFilter<LogCompetitionEvent>;

export interface LogGameEventObject {
  sender: string;
  key: string;
  change: number;
  game: GameDefinitionStructOutput;
}
export type LogGameEvent = TypedEvent<
  [string, string, number, GameDefinitionStructOutput],
  LogGameEventObject
>;

export type LogGameEventFilter = TypedEventFilter<LogGameEvent>;

export interface LogNodeInfoEventObject {
  sender: string;
  key: string;
  change: number;
  info: NodeInfoStructOutput;
}
export type LogNodeInfoEvent = TypedEvent<
  [string, string, number, NodeInfoStructOutput],
  LogNodeInfoEventObject
>;

export type LogNodeInfoEventFilter = TypedEventFilter<LogNodeInfoEvent>;

export interface LogNodeQueueJoinEventObject {
  sender: string;
  key: string;
}
export type LogNodeQueueJoinEvent = TypedEvent<
  [string, string],
  LogNodeQueueJoinEventObject
>;

export type LogNodeQueueJoinEventFilter =
  TypedEventFilter<LogNodeQueueJoinEvent>;

export interface LogNodeQueueLeaveEventObject {
  sender: string;
  key: string;
}
export type LogNodeQueueLeaveEvent = TypedEvent<
  [string, string],
  LogNodeQueueLeaveEventObject
>;

export type LogNodeQueueLeaveEventFilter =
  TypedEventFilter<LogNodeQueueLeaveEvent>;

export interface LogNodeQueueRebuildEventObject {
  sender: string;
}
export type LogNodeQueueRebuildEvent = TypedEvent<
  [string],
  LogNodeQueueRebuildEventObject
>;

export type LogNodeQueueRebuildEventFilter =
  TypedEventFilter<LogNodeQueueRebuildEvent>;

export interface LogPlayerProfileEventObject {
  sender: string;
  key: string;
  change: number;
  profile: PlayerProfileStructOutput;
}
export type LogPlayerProfileEvent = TypedEvent<
  [string, string, number, PlayerProfileStructOutput],
  LogPlayerProfileEventObject
>;

export type LogPlayerProfileEventFilter =
  TypedEventFilter<LogPlayerProfileEvent>;

export interface Ourkadelib extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OurkadelibInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {};

  callStatic: {};

  filters: {
    "LogActionAssigned(address[],uint8,bytes)"(
      assigned?: PromiseOrValue<string>[] | null,
      action?: null,
      key?: PromiseOrValue<BytesLike> | null
    ): LogActionAssignedEventFilter;
    LogActionAssigned(
      assigned?: PromiseOrValue<string>[] | null,
      action?: null,
      key?: PromiseOrValue<BytesLike> | null
    ): LogActionAssignedEventFilter;

    "LogActionCompleted(address,uint8,bytes)"(
      assigned?: PromiseOrValue<string> | null,
      action?: null,
      key?: PromiseOrValue<BytesLike> | null
    ): LogActionCompletedEventFilter;
    LogActionCompleted(
      assigned?: PromiseOrValue<string> | null,
      action?: null,
      key?: PromiseOrValue<BytesLike> | null
    ): LogActionCompletedEventFilter;

    "LogCompetition(address,bytes32,uint8,tuple)"(
      sender?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<BytesLike> | null,
      change?: PromiseOrValue<BigNumberish> | null,
      competition?: null
    ): LogCompetitionEventFilter;
    LogCompetition(
      sender?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<BytesLike> | null,
      change?: PromiseOrValue<BigNumberish> | null,
      competition?: null
    ): LogCompetitionEventFilter;

    "LogGame(address,bytes32,uint8,tuple)"(
      sender?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<BytesLike> | null,
      change?: PromiseOrValue<BigNumberish> | null,
      game?: null
    ): LogGameEventFilter;
    LogGame(
      sender?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<BytesLike> | null,
      change?: PromiseOrValue<BigNumberish> | null,
      game?: null
    ): LogGameEventFilter;

    "LogNodeInfo(address,bytes32,uint8,tuple)"(
      sender?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<BytesLike> | null,
      change?: PromiseOrValue<BigNumberish> | null,
      info?: null
    ): LogNodeInfoEventFilter;
    LogNodeInfo(
      sender?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<BytesLike> | null,
      change?: PromiseOrValue<BigNumberish> | null,
      info?: null
    ): LogNodeInfoEventFilter;

    "LogNodeQueueJoin(address,bytes32)"(
      sender?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<BytesLike> | null
    ): LogNodeQueueJoinEventFilter;
    LogNodeQueueJoin(
      sender?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<BytesLike> | null
    ): LogNodeQueueJoinEventFilter;

    "LogNodeQueueLeave(address,bytes32)"(
      sender?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<BytesLike> | null
    ): LogNodeQueueLeaveEventFilter;
    LogNodeQueueLeave(
      sender?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<BytesLike> | null
    ): LogNodeQueueLeaveEventFilter;

    "LogNodeQueueRebuild(address)"(
      sender?: PromiseOrValue<string> | null
    ): LogNodeQueueRebuildEventFilter;
    LogNodeQueueRebuild(
      sender?: PromiseOrValue<string> | null
    ): LogNodeQueueRebuildEventFilter;

    "LogPlayerProfile(address,address,uint8,tuple)"(
      sender?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<string> | null,
      change?: PromiseOrValue<BigNumberish> | null,
      profile?: null
    ): LogPlayerProfileEventFilter;
    LogPlayerProfile(
      sender?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<string> | null,
      change?: PromiseOrValue<BigNumberish> | null,
      profile?: null
    ): LogPlayerProfileEventFilter;
  };

  estimateGas: {};

  populateTransaction: {};
}