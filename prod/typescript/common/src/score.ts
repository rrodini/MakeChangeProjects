/*
 score.ts - Logic for the score page.
*/
const scoreParams = new URLSearchParams(window.location.search);
const scoreParamGame: string = scoreParams.get("game")!;
const scoreParamCorrect: string = scoreParams.get("correct")!;
const scoreParamTotal: string = scoreParams.get("total")!;
const txtScoreTitle = document.getElementById("txtScoreTitle") as HTMLInputElement;
const txtScoreRatio = document.getElementById("txtScoreRatio") as HTMLInputElement;
const txtScoreFeedback = document.getElementById("txtScoreFeedback") as HTMLInputElement;
let scoreTitle = "";
switch (scoreParamGame) {
  case GameType[GameType.MIN_COINS]:
    scoreTitle = "Game Over - Minimum Coins";
    break;
  case GameType[GameType.FINITE_COINS]:
    scoreTitle = "Game Over - Finite Coins"
    break;
  case GameType[GameType.MAX_COINS]:
    scoreTitle = "Game Over - Maximum Coins"
    break;
}
const minCoinsFeedback: string[] = [
  // 5 - 5
  "Perfect! You’re ready for the next level.",
  // 3 - 4
  "Good. You just need more practice.",
  // 0 - 2
  "You’re just learning the game. Practice makes perfect.",
]
const finiteCoinsFeedback: string[] = [
  // 5 - 5
  "Perfect! You’re ready for the next level.",
  // 3 - 4
  "Good. You just need more practice at this level.",
  // 0 - 2
  "You need more practice, so keep it up.",
]
const maxCoinsFeedback: string[] = [
  // 5 - 5
  "Perfect! You have mastered this game.",
  // 3 - 4
  "Good. These problems are hard, aren't they?",
  // 0 - 2
  "This level is pretty hard, isn't it?",
]
const scoreMap: Map<string, string[]> = new Map()!;
scoreMap.set(GameType[GameType.MIN_COINS], minCoinsFeedback);
scoreMap.set(GameType[GameType.FINITE_COINS], finiteCoinsFeedback);
scoreMap.set(GameType[GameType.MAX_COINS], maxCoinsFeedback);
const ratio: number = (parseInt(scoreParamCorrect) / parseInt(scoreParamTotal)) * 10;
let feedbackIndex: number = 0;
switch (Math.floor(ratio)) {
  case 0: case 1: case 2: case 3: case 4:
    feedbackIndex = 2;
    break;
  case 5: case 6: case 7: case 8: case 9:
    feedbackIndex = 1;
    break;
  case 10:
    feedbackIndex = 0;
    break;
}
txtScoreTitle.innerHTML = scoreTitle;
txtScoreRatio.innerHTML = `${scoreParamCorrect} of ${scoreParamTotal}`;
txtScoreFeedback.innerHTML = scoreMap.get(scoreParamGame)![feedbackIndex];
