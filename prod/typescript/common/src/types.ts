enum GameType { MIN_COINS, FINITE_COINS, MAX_COINS };

enum ProbMark {
  NONE,    // Problem not graded.
  CORRECT,
  INCORRECT,
}

interface GameConfig {
  title: string,
  description: string,
  probMax: number,
  tryMax: number,
  // functions - Implementation should save problem after generation.
  genProblem(): Problem,
  markProblem(userCoins: Coins): ProbFeedback,
  getSolution(): Coins,
}

interface Problem {
  amount: number,
  maxCoins: Coins,
}

interface ProbFeedback {
  mark: ProbMark,
  feedback: string,
}
// Globals
let gameType: GameType;
let currentProblem: Problem;
let solnCoins: Coins;
let currentGame: GameConfig;