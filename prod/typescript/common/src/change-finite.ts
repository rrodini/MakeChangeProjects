/* 
 change-finite.ts - Logic for the finite coins game.
*/

let finiteSolns: Coins[] = []

const gameCoinsFinite: GameConfig = {
  title: "Make Change - Finite Coins",
  description: "You have a limited number of quarters, dimes, nickels, and " +
    "pennies. Make change for the amount using the" +
    " coins. The change must be EXACT. If it can't be done, enter zeros.",
  type: GameType.FINITE_COINS,
  probMax: 5,
  tryMax: 3,
  genProblem: function (): Problem {
    const amount = Math.floor(Math.random() * 99) + 1;
    const maxQ = Math.min(Math.floor(Math.random() * 2 + 1), Math.floor(amount / 25));
    const maxD = Math.min(Math.floor(Math.random() * 5 + 1), Math.floor(amount / 10));
    const maxN = Math.min(Math.floor(Math.random() * 10 + 1), Math.floor(amount / 5));
    const maxP = Math.min(Math.floor(Math.random() * 20 + 1), Math.floor(25));
    const maxCoins = new Coins(maxQ, maxD, maxN, maxP);
    currentProblem = { amount: amount, maxCoins: maxCoins };
    // Now generate solutions
    finiteSolns = [];
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
                finiteSolns.push(testCoins);
              }
            }
          }
        }
      }
    }
    // now sort finiteSolns based on # coins
    finiteSolns.sort((a, b) => {
      return a.getCount() - b.getCount();
    })
    // TEMP
    //finiteSolns.forEach(soln => { console.log(soln.toString()) });
    return currentProblem;
  },
  markProblem: function (userCoins: Coins): ProbFeedback {
    let markFeedback: ProbFeedback = { mark: ProbMark.INCORRECT, feedback: "TBD" };
    if (userCoins.equals(Coins.zeroCoins)) {
      // Is there no solution?
      if (finiteSolns.length === 0) {
        markFeedback = { mark: ProbMark.CORRECT, feedback: "Correct." };
      } else {
        markFeedback = { mark: ProbMark.INCORRECT, feedback: "Yes, there is a solution." };
      }
    } else {
      // Do the user coins sum to amount?
      if (userCoins.getValue() !== currentProblem.amount) {
        markFeedback = { mark: ProbMark.INCORRECT, feedback: "Coins don't sum to Amount." };
      } else {
        markFeedback = { mark: ProbMark.CORRECT, feedback: "Correct." };
      }
    }
    return markFeedback;
  },

  getSolution: function (): Coins {
    solnCoins = Coins.zeroCoins;
    if (finiteSolns.length > 0) {
      // Any soln can be used. For now, show maximum coins.
      solnCoins = finiteSolns[finiteSolns.length - 1];
    }
    return solnCoins;
  }
}  
