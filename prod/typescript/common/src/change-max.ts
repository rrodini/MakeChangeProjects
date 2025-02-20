/* 
 change-max.ts - Logic for the maximal coins game.
*/

let maxSolns: Coins[] = []

const gameCoinsMax: GameConfig = {
  title: "Make Change - Maximum Coins",
  description: `You have an <span id='txtDesc1' class='inline-block fw-bold'>limited number</span> of quarters, dimes, nickels, and
pennies. Make change for the <span id='txtDesc2' class='inline-block fw-bold'>amount</span> below using the most (maximum)
coins. The change must be EXACT. If it can't be done, enter zeros.`,
  type: GameType.MAX_COINS,
  probMax: 5,
  tryMax: 3,
  // HELP variables below.
  exampleProblems: [
    {
      problem: { amount: 79, maxCoins: new Coins(2, 2, 4, 8) },
      userCoins: new Coins(2, 1, 3, 4), // CORRECT
      solnCoins: new Coins(2, 1, 3, 4)
    },
    {
      problem: { amount: 89, maxCoins: new Coins(1, 3, 4, 8) },
      userCoins: new Coins(0, 0, 0, 0), // CORRECT - No exact solution.
      solnCoins: new Coins(0, 0, 0, 0)
    },
    {
      problem: { amount: 79, maxCoins: new Coins(2, 2, 4, 8) },
      userCoins: new Coins(2, 2, 1, 4), // INCORRECT -  9 Coins
      solnCoins: new Coins(2, 1, 3, 4)  // CORRECT   - 10 Coins
    },
    {
      problem: { amount: 79, maxCoins: new Coins(2, 2, 4, 8) },
      userCoins: new Coins(0, 0, 0, 0), // INCORRECT - There is a solution.
      solnCoins: new Coins(2, 1, 3, 4)
    },
  ],
  exampleMax: 0,
  exampleIndex: 0,
  // FUNCTIONS
  genProblem: function (): Problem {
    const minAmount = 60;
    amount = 0;
    while (amount < minAmount) {
      amount = Math.floor(Math.random() * 99) + 1;
    }
    const maxQ = Math.min(Math.floor(Math.random() * 2) + 1, Math.floor(amount / 25));
    const maxD = Math.min(Math.floor(Math.random() * 5) + 1, Math.floor(amount / 10));
    const maxN = Math.min(Math.floor(Math.random() * 10) + 1, Math.floor(amount / 5));
    const maxP = Math.min(Math.floor(Math.random() * 20) + 1, Math.floor(25));
    const maxCoins = new Coins(maxQ, maxD, maxN, maxP);
    currentProblem = { amount: amount, maxCoins: maxCoins };
    // Now generate solutions
    maxSolns = genSolutions.generate(currentProblem);
    return currentProblem;
  },
  markProblem: function (userCoins: Coins, terse: boolean): ProbFeedback {
    let markFeedback: ProbFeedback = { mark: ProbMark.INCORRECT, feedback: "TBD" };
    if (userCoins.equals(Coins.zeroCoins)) {
      // Is there no solution?
      if (maxSolns.length === 0) {
        markFeedback = {
          mark: ProbMark.CORRECT,
          feedback: FeedbackMsg.getNoSolnMsg(terse)
        };
      } else {
        markFeedback = {
          mark: ProbMark.INCORRECT,
          feedback: FeedbackMsg.getSolnExistsMsg(terse, currentProblem.amount, solnCoins)
        }
      }
    } else {
      // Do the user coins sum to amount?
      if (userCoins.getValue() !== currentProblem.amount) {
        markFeedback = {
          mark: ProbMark.INCORRECT, // Coins don't sum to Amount.
          feedback: FeedbackMsg.getBadSumMsg(terse, currentProblem.amount, userCoins)
        };
      } else {
        // Are the user coins maximal?
        const solnCount: number = maxSolns[maxSolns.length - 1].getCount();
        if (solnCount === userCoins.getCount()) {
          markFeedback = {
            mark: ProbMark.CORRECT,
            feedback: FeedbackMsg.getCorrectMsg(terse, currentProblem.amount, solnCoins)
          };
        } else {
          markFeedback = {
            mark: ProbMark.INCORRECT,
            feedback: FeedbackMsg.getBadMaxMsg(terse, currentProblem.amount, solnCoins)
          };
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
  },
  // HELP functions
  genExample: function (): Example {
    // get values from an array of examples.
    gameCoinsMax.exampleMax = gameCoinsMax.exampleProblems.length;
    gameCoinsMax.exampleIndex = gameCoinsMax.exampleIndex % gameCoinsMax.exampleMax;
    var example: Example = gameCoinsMax.exampleProblems[gameCoinsMax.exampleIndex];
    solnCoins = example.solnCoins;
    maxSolns = genSolutions.generate(example.problem);
    gameCoinsMax.exampleIndex++;
    return example;
  }

}  
