/* 
 change-max.ts - Logic for the maximal coins game.
*/

let maxSolns: Coins[] = []

const gameCoinsMax: GameConfig = {
  title: "Make Change - Maximum Coins",
  description: "You have a limited number of quarters, dimes, nickels, and " +
    "pennies. Make change for the amount below using the most (maximum)" +
    " coins. The change must be EXACT. If it can't be done, enter zeros.",
  type: GameType.MAX_COINS,
  probMax: 5,
  tryMax: 3,
  genProblem: function (): Problem {
    const amount = Math.floor(Math.random() * 99) + 1;
    const maxQ = Math.min(Math.floor(Math.random() * 2) + 1, Math.floor(amount / 25));
    const maxD = Math.min(Math.floor(Math.random() * 5) + 1, Math.floor(amount / 10));
    const maxN = Math.min(Math.floor(Math.random() * 10) + 1, Math.floor(amount / 5));
    const maxP = Math.min(Math.floor(Math.random() * 20) + 1, Math.floor(25));
    const maxCoins = new Coins(maxQ, maxD, maxN, maxP);
    currentProblem = { amount: amount, maxCoins: maxCoins };
    // Now generate solutions
    maxSolns = [];
    for (let amt: number = 1; amt <= amount; amt++) {
      let q: number;
      for (q = maxQ; q >= 0; q--) {
        let d: number;
        for (d = maxD; d >= 0; d--) {
          let n: number;
          for (n = maxN; n >= 0; n--) {
            let p: number;
            for (p = maxP; p >= 0; p--) {
              const testCoins: Coins = new Coins(q, d, n, p);
              if (testCoins.getValue() === amount) {
                maxSolns.push(testCoins);
              }
            }
          }
        }
      }
    }
    // now sort allSolns based on # coins
    maxSolns.sort((a, b) => {
      return a.getCount() - b.getCount();
    })
    // TEMP
    //allSolns.forEach(soln => { console.log(soln.toString()) });
    return currentProblem;
  },
  markProblem: function (userCoins: Coins): ProbFeedback {
    let markFeedback: ProbFeedback = { mark: ProbMark.INCORRECT, feedback: "TBD" };
    if (userCoins.equals(Coins.zeroCoins)) {
      // Is there no solution?
      if (maxSolns.length === 0) {
        markFeedback = { mark: ProbMark.CORRECT, feedback: "Correct." };
      } else {
        markFeedback = { mark: ProbMark.INCORRECT, feedback: "Yes, there is a solution." };
      }
    } else {
      // Do the user coins sum to amount?
      if (userCoins.getValue() !== currentProblem.amount) {
        markFeedback = { mark: ProbMark.INCORRECT, feedback: "Coins don't sum to Amount." };
      } else {
        // Are the user coins maximal?
        const solnCount: number = maxSolns[maxSolns.length - 1].getCount();
        if (solnCount === userCoins.getCount()) {
          markFeedback = { mark: ProbMark.CORRECT, feedback: "Correct." };
        } else {
          markFeedback = { mark: ProbMark.INCORRECT, feedback: "Number of coins not maximum." };
        }
      }
    }
    return markFeedback;
  },

  getSolution: function (): Coins {
    solnCoins = Coins.zeroCoins;
    if (maxSolns.length > 0) {
      solnCoins = maxSolns[maxSolns.length - 1];
    }
    return solnCoins;
  }
}  
