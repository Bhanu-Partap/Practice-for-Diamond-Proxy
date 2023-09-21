import Enums from "./Enums";
import { BigNumber } from "ethers";

module Types {
	export interface PlayerProfile {
		PlayerProfileId: string; // Address
		Tickets: BigNumber;
		Rewards: BigNumber;
		Loyalty: BigNumber;
		Reputation: number;
		CompetitionNonce: BigNumber;
		LastGameTimestamp: BigNumber;
		GuiltyCount: BigNumber;
		LastGuiltyTimestamp: BigNumber;
		NodeCount: BigNumber;
		Status: Enums.PlayerProfileStatus;
	}

	export interface NodeInfo {
		PlayerProfileId: string; // Address
		NodeId: BigNumber; // Node Instance, 1-indexed
		LoyaltyLocked: BigNumber[]; // 8 Decimal Places - Index is the queue joined with the loyalty
		Status: Enums.NodeInfoStatus;
	}

	export interface CompetitionParams {
		GameDefinition: string;
		EligibleByTicket: boolean; // Must provide a ticket signed by competition creator
		EligibleLoyalty: BigNumber; // 8 Decimal places, must be above this value
		EligibleReputation: BigNumber; // 2 Decimal places, must be above this value
		EligibleRankMinimum: BigNumber;
		EligibleRankMaximum: BigNumber;
		EligibleEloMinimum: BigNumber;
		EligibleEloMaximum: BigNumber;
		CurrencyType: Enums.CurrencyType;
		PrizeType: Enums.PrizeType;
		PrizePool: BigNumber;
		NodeReward: BigNumber;
		EntryFee: BigNumber;
		MinimumPlayers: BigNumber;
		MaximumPlayers: BigNumber;
		MatchesPerRound: BigNumber;
		MatchDuration: BigNumber; // In Seconds
	}

	export interface Competition {
		CompetitionId: string;
		GameDefinition: string;
		EligibleByTicket: boolean; // Must provide a ticket signed by competition creator
		EligibleLoyalty: BigNumber; // 8 Decimal places, must be above this value
		EligibleReputation: BigNumber; // 2 Decimal places, must be above this value
		EligibleRankMinimum: BigNumber; // This will control the scoring queue it's in
		EligibleRankMaximum: BigNumber;
		EligibleEloMinimum: BigNumber;
		EligibleEloMaximum: BigNumber;
		CurrencyType: Enums.CurrencyType;
		PrizeType: Enums.PrizeType;
		PrizePool: BigInt;
		NodeReward: BigInt;
		EntryFee: BigInt;
		MinimumPlayers: BigNumber;
		MaximumPlayers: BigNumber;
		Players: string[];
		Matches: Match[];
		MatchScoreData: BigNumber[];
		EndTime: BigNumber;
		MatchesPerRound: BigNumber;
		MatchDuration: BigNumber; // In Seconds
		HasDisputes: boolean;
		DataPin: string; // May want to improve this // ~34 bytes
		Judges: string[];
		Status: Enums.CompetitionStatus;
	}

	export interface Match {
		DataPin: string; // May want to improve this // ~34 bytes
		Round: BigNumber; // 1 byte
		Player: string; // 20 bytes
		Score: BigNumber; // 32 bytes
		Status: Enums.MatchStatus; // 8 bytes
		StartTime: BigNumber;
		EndTime: BigNumber;
	}

}

export default Types;