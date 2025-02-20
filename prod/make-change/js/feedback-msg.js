"use strict";
/*
 FeedbackMsg is a class of static methods that produce the message for problem marking.
 (see any of change-min.ts, change-finite.ts. change-max.tx).
*/
var FeedbackMsg = /** @class */ (function () {
    function FeedbackMsg() {
    }
    // Correct (also exact) message.
    FeedbackMsg.getCorrectMsg = function (terse, amount, solnCoins) {
        var msg = "Correct. ";
        if (!terse) {
            msg += "".concat(amount, " = ").concat(solnCoins.getValueString(), ".");
        }
        return msg;
    };
    // Correct since there is no solution message.
    FeedbackMsg.getNoSolnMsg = function (terse) {
        var msg = "Correct. ";
        if (!terse) {
            msg += "Exact change cannot be made.";
        }
        return msg;
    };
    // Incorrect since coins don't sum to amount message.
    FeedbackMsg.getBadSumMsg = function (terse, amount, userCoins) {
        var msg = "Coins don't sum to ammount. ";
        if (!terse) {
            msg += "".concat(amount, " &ne; ").concat(userCoins.getValueString(), ".");
        }
        return msg;
    };
    // Incorrect since a solution exists message.
    FeedbackMsg.getSolnExistsMsg = function (terse, amount, solnCoins) {
        var msg = "There is a solution. ";
        if (!terse) {
            msg += "".concat(amount, " = ").concat(solnCoins.getValueString(), ".");
        }
        return msg;
    };
    // Incorrect since user coins not minimum message.
    FeedbackMsg.getBadMinMsg = function (terse, amount, solnCoins) {
        var msg = "Number of coins not minimum. ";
        if (!terse) {
            msg += "".concat(amount, " = ").concat(solnCoins.getValueString(), " (").concat(solnCoins.getCount(), " coins).");
        }
        return msg;
    };
    // Incorrect since user coins not maximum message.
    FeedbackMsg.getBadMaxMsg = function (terse, amount, solnCoins) {
        var msg = "Number of coins not maximum. ";
        if (!terse) {
            msg += "".concat(amount, " = ").concat(solnCoins.getValueString(), " (").concat(solnCoins.getCount(), " coins).");
        }
        return msg;
    };
    return FeedbackMsg;
}());
