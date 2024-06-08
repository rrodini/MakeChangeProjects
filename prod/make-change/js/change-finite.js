"use strict";
/*
 change-finite.ts - Logic for the finite coins game.
*/
var finiteSolns = [];
var gameCoinsFinite = {
    title: "Make Change - Finite Coins",
    description: "You have a limited number of quarters, dimes, nickels, and " +
        "pennies. Make change for the amount using the" +
        " coins. The change must be EXACT. If it can't be done, enter zeros.",
    type: GameType.FINITE_COINS,
    probMax: 5,
    tryMax: 3,
    genProblem: function () {
        var minAmount = 50;
        amount = 0;
        while (amount < minAmount) {
            amount = Math.floor(Math.random() * 99) + 1;
        }
        var maxQ = Math.min(Math.floor(Math.random() * 2 + 1), Math.floor(amount / 25));
        var maxD = Math.min(Math.floor(Math.random() * 5 + 1), Math.floor(amount / 10));
        var maxN = Math.min(Math.floor(Math.random() * 10 + 1), Math.floor(amount / 5));
        var maxP = Math.min(Math.floor(Math.random() * 20 + 1), Math.floor(25));
        var maxCoins = new Coins(maxQ, maxD, maxN, maxP);
        currentProblem = { amount: amount, maxCoins: maxCoins };
        // Now generate solutions
        finiteSolns = [];
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
                                finiteSolns.push(testCoins);
                            }
                        }
                    }
                }
            }
        }
        // now sort finiteSolns based on # coins
        finiteSolns.sort(function (a, b) {
            return a.getCount() - b.getCount();
        });
        // TEMP
        //finiteSolns.forEach(soln => { console.log(soln.toString()) });
        return currentProblem;
    },
    markProblem: function (userCoins) {
        var markFeedback = { mark: ProbMark.INCORRECT, feedback: "TBD" };
        if (userCoins.equals(Coins.zeroCoins)) {
            // Is there no solution?
            if (finiteSolns.length === 0) {
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
                markFeedback = { mark: ProbMark.CORRECT, feedback: "Correct." };
            }
        }
        return markFeedback;
    },
    getSolution: function () {
        solnCoins = Coins.zeroCoins;
        if (finiteSolns.length > 0) {
            // Any soln can be used. For now, show maximum coins.
            solnCoins = finiteSolns[finiteSolns.length - 1];
        }
        return solnCoins;
    }
};
