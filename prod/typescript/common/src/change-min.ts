/* 
 change-min.ts - Logic for the minimal coins game.
*/
const gameCoinsMin: GameConfig = {
  title: "Minimum Coins",
  description: "You have an <span id='descNumber'>large number</span> of quarters, dimes, nickels, and " +
    "pennies. Make change for the <span id='descAmount'>amount</span> below using the fewest <span id='descCount'>(minimum)</span>" +
    " coins.",
  type: GameType.MIN_COINS,
  probMax: 5,
  tryMax: 3,
  genProblem: function (): Problem {
    const minAmount = 40;
    amount = 0;
    while (amount < minAmount) {
      amount = Math.floor(Math.random() * 99) + 1;
    }
    const maxQ = 3;
    const maxD = 9;
    const maxN = 19;
    const maxP = 99;
    const maxCoins = new Coins(maxQ, maxD, maxN, maxP);
    const currentProblem = { amount: amount, maxCoins: maxCoins };
    // might as well solve it.
    let localAmount = currentProblem.amount;
    const q = Math.floor(localAmount / 25);
    localAmount = Math.floor(localAmount % 25);
    const d = Math.floor(localAmount / 10);
    localAmount = Math.floor(localAmount % 10);
    const n = Math.floor(localAmount / 5);
    const p = Math.floor(localAmount % 5);
    solnCoins = new Coins(q, d, n, p);
    return currentProblem;
  },
  markProblem: function (userCoins: Coins): ProbFeedback {
    if (userCoins.getValue() === currentProblem.amount) {
      if (userCoins.equals(solnCoins)) {
        return { mark: ProbMark.CORRECT, feedback: "Correct." };
      } else {
        return { mark: ProbMark.INCORRECT, feedback: "Number of coins not minimum." };
      }
    } else {
      return { mark: ProbMark.INCORRECT, feedback: "Coins don't sum to Amount." };
    }
  },
  getSolution: function (): Coins {
    return solnCoins;
  },
  // Help functions
  genExample: function (kind: ProbMark): Example {
    // get values from an array of problems in the future.
    amount = 67;
    const maxQ = 3;
    const maxD = 9;
    const maxN = 19;
    const maxP = 99;
    const maxCoins = new Coins(maxQ, maxD, maxN, maxP);
    const currentProblem: Problem = { amount: amount, maxCoins: maxCoins };
    const exampleCoins = new Coins(2, 1, 1, 2);
    solnCoins = exampleCoins;
    return { problem: currentProblem, userCoins: exampleCoins };
  }
}