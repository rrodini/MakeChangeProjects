"use strict";
/*
 change-min.ts - Logic for the minimal coins game.
*/
var gameCoinsMin = {
    title: "Make Change - Minimum Coins",
    description: "You have an unlimited number of quarters, dimes, nickels, and " +
        "pennies. Make change for the amount below using the fewest (minimum)" +
        " coins.",
    probMax: 5,
    tryMax: 3,
    genProblem: function () {
        var amount = Math.floor(Math.random() * 99) + 1;
        var maxCoins = new Coins(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        currentProblem = { amount: amount, maxCoins: maxCoins };
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
    }
};
