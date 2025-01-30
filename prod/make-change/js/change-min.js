"use strict";
/*
 change-min.ts - Logic for the minimal coins game.
*/
var gameCoinsMin = {
    title: "Minimum Coins",
    description: "You have an <span id='descNumber'>large number</span> of quarters, dimes, nickels, and " +
        "pennies. Make change for the <span id='descAmount'>amount</span> below using the fewest <span id='descCount'>(minimum)</span>" +
        " coins.",
    type: GameType.MIN_COINS,
    probMax: 5,
    tryMax: 3,
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
    markProblem: function (userCoins) {
        if (userCoins.getValue() === currentProblem.amount) {
            if (userCoins.equals(solnCoins)) {
                return { mark: ProbMark.CORRECT, feedback: "Correct." };
            }
            else {
                return { mark: ProbMark.INCORRECT, feedback: "Number of coins not minimum." };
            }
        }
        else {
            return { mark: ProbMark.INCORRECT, feedback: "Coins don't sum to Amount." };
        }
    },
    getSolution: function () {
        return solnCoins;
    },
    // Help functions
    genExample: function (kind) {
        // get values from an array of problems in the future.
        amount = 67;
        var maxQ = 3;
        var maxD = 9;
        var maxN = 19;
        var maxP = 99;
        var maxCoins = new Coins(maxQ, maxD, maxN, maxP);
        var currentProblem = { amount: amount, maxCoins: maxCoins };
        var exampleCoins = new Coins(2, 1, 1, 2);
        solnCoins = exampleCoins;
        return { problem: currentProblem, userCoins: exampleCoins };
    }
};
