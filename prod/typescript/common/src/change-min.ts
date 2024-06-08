/* 
 change-min.ts - Logic for the minimal coins game.
*/
const gameCoinsMin: GameConfig = {
  title: "Make Change - Minimum Coins",
  description: "You have an unlimited number of quarters, dimes, nickels, and " +
    "pennies. Make change for the amount below using the fewest (minimum)" +
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
    const maxCoins = new Coins(Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    currentProblem = { amount: amount, maxCoins: maxCoins };
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
  }
}