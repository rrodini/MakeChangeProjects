"use strict";
/*
 change-finite.ts - Logic for the finite coins game.
*/
var finiteSolns = [];
var gameCoinsFinite = {
    title: "Make Change - Finite Coins",
    description: "You have a <span id='txtDesc1' class='inline-block fw-bold'>limited number</span> of quarters, dimes, nickels, and\npennies. Make change for the <span id='txtDesc2' class='inline-block fw-bold'>amount</span> below using the\ncoins. The change must be EXACT. If it can't be done, enter zeros.",
    type: GameType.FINITE_COINS,
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
            userCoins: new Coins(2, 2, 2, 4), // INCORRECT -  Coins don't sum to amount.
            solnCoins: new Coins(2, 1, 3, 4) //
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
        finiteSolns = genSolutions.generate(currentProblem);
        return currentProblem;
    },
    markProblem: function (userCoins, terse) {
        var markFeedback = { mark: ProbMark.INCORRECT, feedback: "TBD" };
        var msg;
        if (userCoins.equals(Coins.zeroCoins)) {
            // Is there no solution?
            if (finiteSolns.length === 0) {
                markFeedback = {
                    mark: ProbMark.CORRECT,
                    feedback: FeedbackMsg.getNoSolnMsg(terse)
                };
            }
            else {
                markFeedback = {
                    mark: ProbMark.INCORRECT,
                    feedback: FeedbackMsg.getSolnExistsMsg(terse, currentProblem.amount, solnCoins)
                };
            }
        }
        else {
            // Do the user coins sum to amount?
            if (userCoins.getValue() !== currentProblem.amount) {
                markFeedback = {
                    mark: ProbMark.INCORRECT, // Coins don't sum to Amount.
                    feedback: FeedbackMsg.getBadSumMsg(terse, currentProblem.amount, userCoins)
                };
            }
            else {
                markFeedback = {
                    mark: ProbMark.CORRECT,
                    feedback: FeedbackMsg.getCorrectMsg(terse, currentProblem.amount, solnCoins)
                };
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
    },
    // HELP functions
    genExample: function () {
        // get values from an array of examples.
        gameCoinsFinite.exampleMax = gameCoinsFinite.exampleProblems.length;
        gameCoinsFinite.exampleIndex = gameCoinsFinite.exampleIndex % gameCoinsFinite.exampleMax;
        var example = gameCoinsFinite.exampleProblems[gameCoinsFinite.exampleIndex];
        solnCoins = example.solnCoins;
        finiteSolns = genSolutions.generate(example.problem);
        gameCoinsFinite.exampleIndex++;
        return example;
    }
};
