"use strict";
/*
 types.ts - Global types for Make Change.
*/
var GameType;
(function (GameType) {
    GameType[GameType["MIN_COINS"] = 0] = "MIN_COINS";
    GameType[GameType["FINITE_COINS"] = 1] = "FINITE_COINS";
    GameType[GameType["MAX_COINS"] = 2] = "MAX_COINS";
})(GameType || (GameType = {}));
;
var GameMode;
(function (GameMode) {
    GameMode[GameMode["PLAY"] = 0] = "PLAY";
    GameMode[GameMode["HELP"] = 1] = "HELP";
})(GameMode || (GameMode = {}));
var ProbMark;
(function (ProbMark) {
    ProbMark[ProbMark["NONE"] = 0] = "NONE";
    ProbMark[ProbMark["CORRECT"] = 1] = "CORRECT";
    ProbMark[ProbMark["INCORRECT"] = 2] = "INCORRECT";
})(ProbMark || (ProbMark = {}));
// moved to game-common.ts
// Globals
// let currentGameType: GameType;
// let currentGameMode: GameMode;
// let currentProblem: Problem;
// let solnCoins: Coins;
// let currentGame: GameConfig;
