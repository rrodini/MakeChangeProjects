enum GameType { MIN_COINS, FINITE_COINS, MAX_COINS };
enum GameMode {
  PLAY,    // Play a real game
  HELP,    // Help on a game
}
enum ProbMark {
  NONE,    // Problem not graded.
  CORRECT,
  INCORRECT,
}

interface GameConfig {
  title: string,
  description: string,
  type: GameType,
  probMax: number,
  tryMax: number,
  exampleProblems: Example[]; // for help
  exampleMax: number,  // for help
  exampleIndex: number,// for help
  // functions - Implementation should save problem after generation.
  genProblem(): Problem,
  markProblem(userCoins: Coins, terse: boolean): ProbFeedback,
  getSolution(): Coins,
  genExample(): Example, // for help
}
// Problem is for game-play.
interface Problem {
  amount: number,
  maxCoins: Coins,
}
// Example is for game-help.
interface Example {
  problem: Problem,
  userCoins: Coins,  // CORRECT and INCORRECT
  solnCoins: Coins,  // Always CORRECT
}

interface ProbFeedback {
  mark: ProbMark,   // See above
  feedback: string, // TERSE or VERBOSE
}
// moved to game-common.ts
// Globals
// let currentGameType: GameType;
// let currentGameMode: GameMode;
// let currentProblem: Problem;
// let solnCoins: Coins;
// let currentGame: GameConfig;