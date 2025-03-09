"use strict";
/*
 score.ts - Logic for the score page.
*/
var scoreParams = new URLSearchParams(window.location.search);
var scoreParamGame = scoreParams.get("game");
var scoreParamCorrect = scoreParams.get("correct");
var scoreParamTotal = scoreParams.get("total");
var txtScoreTitle = document.getElementById("txtScoreTitle");
var txtScoreRatio = document.getElementById("txtScoreRatio");
var txtScoreFeedback = document.getElementById("txtScoreFeedback");
var scoreTitle = "";
switch (scoreParamGame) {
    case GameType[GameType.MIN_COINS]:
        scoreTitle = "Game Over - Minimum Coins";
        break;
    case GameType[GameType.FINITE_COINS]:
        scoreTitle = "Game Over - Finite Coins";
        break;
    case GameType[GameType.MAX_COINS]:
        scoreTitle = "Game Over - Maximum Coins";
        break;
}
var minCoinsFeedback = [
    // 5 - 5
    "Perfect! You’re ready for the next level.",
    // 3 - 4
    "Good. You just need more practice.",
    // 0 - 2
    "You’re just learning the game. Practice makes perfect.",
];
var finiteCoinsFeedback = [
    // 5 - 5
    "Perfect! You’re ready for the next level.",
    // 3 - 4
    "Good. You just need more practice at this level.",
    // 0 - 2
    "You need more practice, so keep it up.",
];
var maxCoinsFeedback = [
    // 5 - 5
    "Perfect! You have mastered this game.",
    // 3 - 4
    "Good. These problems are hard, aren't they?",
    // 0 - 2
    "This level is pretty hard, isn't it?",
];
var scoreMap = new Map();
scoreMap.set(GameType[GameType.MIN_COINS], minCoinsFeedback);
scoreMap.set(GameType[GameType.FINITE_COINS], finiteCoinsFeedback);
scoreMap.set(GameType[GameType.MAX_COINS], maxCoinsFeedback);
var ratio = (parseInt(scoreParamCorrect) / parseInt(scoreParamTotal)) * 10;
var feedbackIndex = 0;
switch (Math.floor(ratio)) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
        feedbackIndex = 2;
        break;
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
        feedbackIndex = 1;
        break;
    case 10:
        feedbackIndex = 0;
        break;
}
txtScoreTitle.innerHTML = scoreTitle;
txtScoreRatio.innerHTML = "".concat(scoreParamCorrect, " of ").concat(scoreParamTotal);
txtScoreFeedback.innerHTML = scoreMap.get(scoreParamGame)[feedbackIndex];
