"use strict";
/*
 genSolutions - generates all solutions to a problem and
                returns them in a sorted array.
*/
var genSolutions = /** @class */ (function () {
    function genSolutions() {
    }
    genSolutions.generate = function (prob) {
        var amount = prob.amount;
        var maxQ = prob.maxCoins.getQ();
        var maxD = prob.maxCoins.getD();
        var maxN = prob.maxCoins.getN();
        var maxP = prob.maxCoins.getP();
        var solns = [];
        var q;
        for (q = maxQ; q >= 0; q--) {
            var d = void 0;
            for (d = maxD; d >= 0; d--) {
                var n = void 0;
                for (n = maxN; n >= 0; n--) {
                    var p = void 0;
                    for (p = maxP; p >= 0; p--) {
                        var testCoins = new Coins(q, d, n, p);
                        if (testCoins.getValue() === amount) {
                            solns.push(testCoins);
                        }
                    }
                }
            }
        }
        // now sort allSolns based on # coins
        solns.sort(function (a, b) {
            return a.getCount() - b.getCount();
        });
        return solns;
    };
    return genSolutions;
}());
