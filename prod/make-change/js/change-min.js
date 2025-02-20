"use strict";
/*
 change-min.ts - Logic for the minimal coins game.
*/
var gameCoinsMin = {
    title: "Minimum Coins",
    description: "You have an <span id='txtDesc1' class='inline-block fw-bold'>large number</span> of quarters, dimes, nickels, and\npennies. Make change for the <span id='txtDesc2' class='inline-block fw-bold'>amount</span> below using the fewest (minimum)\ncoins.",
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
            solnCoins: new Coins(2, 1, 1, 2) // CORRECT   - 6 coins
        },
    ],
    exampleMax: 0,
    exampleIndex: 0,
    genProblem: function () {
        var minAmount = 40;
        amount = 0;
        while (amount < minAmount) {
            amount = Math.floor(Math.random() * 99) + 1;
        }
        var maxQ = 3;
        var maxD = 9;
        var maxN = 19;
        var maxP = 99;
        var maxCoins = new Coins(maxQ, maxD, maxN, maxP);
        var currentProblem = { amount: amount, maxCoins: maxCoins };
        // might as well solve it.
        var localAmount = currentProblem.amount;
        var q = Math.floor(localAmount / 25);
        localAmount = Math.floor(localAmount % 25);
        var d = Math.floor(localAmount / 10);
        localAmount = Math.floor(localAmount % 10);
        var n = Math.floor(localAmount / 5);
        var p = Math.floor(localAmount % 5);
        solnCoins = new Coins(q, d, n, p);
        return currentProblem;
    },
    markProblem: function (userCoins, terse) {
        var msg;
        if (userCoins.getValue() === currentProblem.amount) {
            if (userCoins.equals(solnCoins)) {
                return {
                    mark: ProbMark.CORRECT,
                    feedback: FeedbackMsg.getCorrectMsg(terse, currentProblem.amount, solnCoins)
                };
            }
            else {
                return {
                    mark: ProbMark.INCORRECT,
                    feedback: FeedbackMsg.getBadMinMsg(terse, currentProblem.amount, solnCoins)
                };
            }
        }
        else {
            return {
                mark: ProbMark.INCORRECT,
                feedback: FeedbackMsg.getBadSumMsg(terse, currentProblem.amount, userCoins)
            };
        }
    },
    getSolution: function () {
        return solnCoins;
    },
    // Help functions
    genExample: function () {
        // get values from an array of examples.
        gameCoinsMin.exampleMax = gameCoinsMin.exampleProblems.length;
        gameCoinsMin.exampleIndex = gameCoinsMin.exampleIndex % gameCoinsMin.exampleMax;
        var exampleProblem = gameCoinsMin.exampleProblems[gameCoinsMin.exampleIndex];
        solnCoins = exampleProblem.solnCoins;
        gameCoinsMin.exampleIndex++;
        return exampleProblem;
    }
};
