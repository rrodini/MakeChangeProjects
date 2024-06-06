/*
 change-max.ts - Logic for the maximal coins game.
*/
var maxSolns = [];
var gameCoinsMax = {
    title: "Make Change - Maximum Coins",
    description: "You have a limited number of quarters, dimes, nickels, and " +
        "pennies. Make change for the amount below using the most (maximum)" +
        " coins. The change must be EXACT. If it can't be done, enter zeros.",
    type: GameType.MAX_COINS,
    probMax: 5,
    tryMax: 3,
    genProblem: function () {
        var minAmount = 60;
        amount = 0;
        while (amount < minAmount) {
            amount = Math.floor(Math.random() * 99) + 1;
        }
        var maxQ = Math.min(Math.floor(Math.random() * 2) + 1, Math.floor(amount / 25));
        var maxD = Math.min(Math.floor(Math.random() * 5) + 1, Math.floor(amount / 10));
        var maxN = Math.min(Math.floor(Math.random() * 10) + 1, Math.floor(amount / 5));
        var maxP = Math.min(Math.floor(Math.random() * 20) + 1, Math.floor(25));
        var maxCoins = new Coins(maxQ, maxD, maxN, maxP);
        currentProblem = { amount: amount, maxCoins: maxCoins };
        // Now generate solutions
        maxSolns = [];
        for (var amt = 1; amt <= amount; amt++) {
            var q = void 0;
            for (q = maxQ; q >= 0; q--) {
                var d = void 0;
                for (d = maxD; d >= 0; d--) {
                    var n = void 0;
                    for (n = maxN; n >= 0; n--) {
                        var p = void 0;
                        for (p = maxP; p >= 0; p--) {
                            var testCoins = new Coins(q, d, n, p);
                            if (testCoins.getValue() === amount) {
                                maxSolns.push(testCoins);
                            }
                        }
                    }
                }
            }
        }
        // now sort allSolns based on # coins
        maxSolns.sort(function (a, b) {
            return a.getCount() - b.getCount();
        });
        // TEMP
        //allSolns.forEach(soln => { console.log(soln.toString()) });
        return currentProblem;
    },
    markProblem: function (userCoins) {
        var markFeedback = { mark: ProbMark.INCORRECT, feedback: "TBD" };
        if (userCoins.equals(Coins.zeroCoins)) {
            // Is there no solution?
            if (maxSolns.length === 0) {
                markFeedback = { mark: ProbMark.CORRECT, feedback: "Correct." };
            }
            else {
                markFeedback = { mark: ProbMark.INCORRECT, feedback: "Yes, there is a solution." };
            }
        }
        else {
            // Do the user coins sum to amount?
            if (userCoins.getValue() !== currentProblem.amount) {
                markFeedback = { mark: ProbMark.INCORRECT, feedback: "Coins don't sum to Amount." };
            }
            else {
                // Are the user coins maximal?
                var solnCount = maxSolns[maxSolns.length - 1].getCount();
                if (solnCount === userCoins.getCount()) {
                    markFeedback = { mark: ProbMark.CORRECT, feedback: "Correct." };
                }
                else {
                    markFeedback = { mark: ProbMark.INCORRECT, feedback: "Number of coins not maximum." };
                }
            }
        }
        return markFeedback;
    },
    getSolution: function () {
        solnCoins = Coins.zeroCoins;
        if (maxSolns.length > 0) {
            solnCoins = maxSolns[maxSolns.length - 1];
        }
        return solnCoins;
    }
};
