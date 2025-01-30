enum GameType { MIN_COINS, FINITE_COINS, MAX_COINS };

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
  // functions - Implementation should save problem after generation.
  genProblem(): Problem,
  markProblem(userCoins: Coins): ProbFeedback,
  getSolution(): Coins,
  genExample(kind: ProbMark): Example,
}
// Problem is for game-play.
interface Problem {
  amount: number,
  maxCoins: Coins,
}
// Example is for game-help.
interface Example {
  problem: Problem,
  userCoins: Coins,
}

interface ProbFeedback {
  mark: ProbMark,
  feedback: string,
}
// moved to game-common.ts
// Globals
// let currentGameType: GameType;
// let currentProblem: Problem;
// let solnCoins: Coins;
// let currentGame: GameConfig;