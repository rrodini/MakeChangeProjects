"use strict";
var GameType;
(function (GameType) {
    GameType[GameType["MIN_COINS"] = 0] = "MIN_COINS";
    GameType[GameType["FINITE_COINS"] = 1] = "FINITE_COINS";
    GameType[GameType["MAX_COINS"] = 2] = "MAX_COINS";
})(GameType || (GameType = {}));
;
var ProbMark;
(function (ProbMark) {
    ProbMark[ProbMark["NONE"] = 0] = "NONE";
    ProbMark[ProbMark["CORRECT"] = 1] = "CORRECT";
    ProbMark[ProbMark["INCORRECT"] = 2] = "INCORRECT";
})(ProbMark || (ProbMark = {}));
// moved to game-common.ts
// Globals
// let currentGameType: GameType;
// let currentProblem: Problem;
// let solnCoins: Coins;
// let currentGame: GameConfig;
