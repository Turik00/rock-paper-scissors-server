interface IPlayingPlayers {
  playersMap: Map<string, string>;
  reversedPlayersMap: Map<string, string>;
  playersState: Map<string, IPlayersState>;
}

interface IWaitingPlayers {
  randomPlayers: string[];
  determinedPlayers: string[];
}

export interface IPlayers {
  playingPlayers: IPlayingPlayers;
  waitingPlayers: IWaitingPlayers;
}

export interface IPlayersState {
  move: Gestures;
  score: number;
}

// TODO: consolidate with client's enum
export enum Gestures {
  noMove = -1,
  rock = 0,
  paper,
  scissors,
}
