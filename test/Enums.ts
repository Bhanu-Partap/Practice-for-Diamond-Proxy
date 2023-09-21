module Enums {
	export enum ChangeType {
		// CRUD Standard
		Created,
		Updated,
		Removed,
		// Status Standard
		Disabled,
		Enabled
	}
	
	export enum PrizeType {
		WinnerTakeAll,
		Top3,
		RankCurve,
		ScoreProportional,
		Fixed
	}
	
	export enum CurrencyType {
		Ticket,
		Honor,
		Reward
	}
	
	export enum EligibleType {
		Open,
		ELO,
		Reputation,
		AllowList,
		Invite
	}
	
	export enum VoteType {
		Hidden,
		Guilty,
		Innocent,
		Invalid
	}
	
	// These statuses are unique export enums to avoid
	// referencing statuses that are not applicable
	// to different object types, and to avoid
	// doing an incorrect comparison between them
	
	export enum PlayerProfileStatus {
		Created,
		Disabled
	}

	export enum NodeInfoStatus {
		Inactive,
		Active
	}
	
	export enum CompetitionStatus {
		Created,
		Accepted,
		Disabled
	}
	
	export enum GameDefinitionStatus {
		Created,
		Disabled
	}
	
	export enum MatchStatus {
		Created,
		Pending,
		Disabled
	}
	
	export enum MatchDisputeStatus {
		Created,
		Pending, // Calculated
		// the two resolve statuses are not duplicates because
		// votes can still be registered during EarlyResolve
		EarlyResolve, // Calculated
		VotingClosed, // Calculated
		Expired, // Calculated and then saved
		Innocent,
		Guilty
	}
	
	export enum ReputationRank {
		Banned,
		Negative2,
		Negative1,
		Neutral,
		Positive1,
		Positive2,
		Positive3,
		Positive4
	}
	
}

export default Enums;