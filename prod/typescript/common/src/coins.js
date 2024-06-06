/*
Coins is a simple class to group a set of quarters, dimes, nickels, and dimes
into an object with some convenience methods.
*/
var Coins = /** @class */ (function () {
    function Coins(q, d, n, p) {
        this.q = q;
        this.d = d;
        this.n = n;
        this.p = p;
    }
    Coins.prototype.getQ = function () { return this.q; };
    Coins.prototype.getD = function () { return this.d; };
    Coins.prototype.getN = function () { return this.n; };
    Coins.prototype.getP = function () { return this.p; };
    /*
    getCount returns the number of coins (not their value).
    */
    Coins.prototype.getCount = function () {
        return this.q + this.d + this.n + this.p;
    };
    /*
    getValue returns the value of coins (not their count).
    */
    Coins.prototype.getValue = function () {
        return this.q * 25 + this.d * 10 + this.n * 5 + this.p;
    };
    /*
    toString returns a string representation of a Coins object.
    */
    Coins.prototype.toString = function () {
        return "[Q: ".concat(this.q, ", D: ").concat(this.d, ", N: ").concat(this.n, ", P: ").concat(this.p, "]");
    };
    /*
    equals tests two Coins objects for value equality.
    */
    Coins.prototype.equals = function (coins) {
        return this.q === coins.q && this.d === coins.d &&
            this.n === coins.n && this.p === coins.p;
    };
    Coins.zeroCoins = new Coins(0, 0, 0, 0);
    return Coins;
}());
