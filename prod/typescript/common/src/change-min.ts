/* 
 change-min.ts - Logic for the minimal coins game.
*/
const gameCoinsMin: GameConfig = {
  title: "Minimum Coins",
  description: `You have an <span id='txtDesc1' class='inline-block fw-bold'>large number</span> of quarters, dimes, nickels, and
pennies. Make change for the <span id='txtDesc2' class='inline-block fw-bold'>amount</span> below using the fewest (minimum)
coins.`,
  type: GameType.MIN_COINS,
  probMax: 5,
  tryMax: 3,
  // These are carefully contrived canned problems used by HELP system
  exampleProblems: [
    {
      problem: { amount: 67, maxCoins: new Coins(3, 9, 19, 99) },
      userCoins: new Coins(2, 1, 1, 2), // CORRECT
      solnCoins: new Coins(2, 1, 1, 2)
    },
    {
      problem: { amount: 77, maxCoins: new Coins(3, 9, 19, 99) },
      userCoins: new Coins(2, 1, 1, 2), // INCORRECT
      solnCoins: new Coins(3, 0, 0, 2)
    },
    {
      problem: { amount: 67, maxCoins: new Coins(3, 9, 19, 99) },
      userCoins: new Coins(1, 3, 2, 2), // INCORRECT - 8 coins
      solnCoins: new Coins(2, 1, 1, 2)  // CORRECT   - 6 coins
    },
  ],
  exampleMax: 0,
  exampleIndex: 0,
  genProblem: function (): Problem {
    const minAmount: number = 40;
    let amount: number = 0;
    while (amount < minAmount) {
      amount = Math.floor(Math.random() * 99) + 1;
    }
    const maxQ = 3;
    const maxD = 9;
    const maxN = 19;
    const maxP = 99;
    const maxCoins = new Coins(maxQ, maxD, maxN, maxP);
    let localAmount: number = amount;
    currentProblem = { amount: localAmount, maxCoins: maxCoins };
    // might as well solve it.
    const q = Math.floor(localAmount / 25);
    localAmount = Math.floor(localAmount % 25);
    const d = Math.floor(localAmount / 10);
    localAmount = Math.floor(localAmount % 10);
    const n = Math.floor(localAmount / 5);
    const p = Math.floor(localAmount % 5);
    solnCoins = new Coins(q, d, n, p);
    return currentProblem;
  },
  markProblem: function (userCoins: Coins, terse: boolean): ProbFeedback {
    var msg: string;
    if (userCoins.getValue() === currentProblem.amount) {
      if (userCoins.equals(solnCoins)) {
        return {
          mark: ProbMark.CORRECT,
          feedback: FeedbackMsg.getCorrectMsg(terse, currentProblem.amount, solnCoins)
        };
      } else {
        return {
          mark: ProbMark.INCORRECT,
          feedback: FeedbackMsg.getBadMinMsg(terse, currentProblem.amount, solnCoins)
        };
      }
    } else {
      return {
        mark: ProbMark.INCORRECT,
        feedback: FeedbackMsg.getBadSumMsg(terse, currentProblem.amount, userCoins)
      };
    }
  },
  getSolution: function (): Coins {
    return solnCoins;
  },
  // Help functions
  genExample: function (): Example {
    // get values from an array of examples.
    gameCoinsMin.exampleMax = gameCoinsMin.exampleProblems.length;
    gameCoinsMin.exampleIndex = gameCoinsMin.exampleIndex % gameCoinsMin.exampleMax;
    var exampleProblem: Example = gameCoinsMin.exampleProblems[gameCoinsMin.exampleIndex];
    solnCoins = exampleProblem.solnCoins;
    gameCoinsMin.exampleIndex++;
    return exampleProblem;
  }
}