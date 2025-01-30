/*
  game-help.ts - game help logic.
 */

// START HERE

switch (gameParamGame) {
  case GameType[GameType.MIN_COINS]:
    currentGame = gameCoinsMin;
    break;
  case GameType[GameType.FINITE_COINS]:
    currentGame = gameCoinsFinite;
    break;
  case GameType[GameType.MAX_COINS]:
    currentGame = gameCoinsMax;
    break;
}
currentGameType = currentGame.type;

// txtQ?.addEventListener("change", coinValueChange);
// txtD?.addEventListener("change", coinValueChange);
// txtN?.addEventListener("change", coinValueChange);
// txtP?.addEventListener("change", coinValueChange);
// txtQ?.addEventListener("focus", () => txtQ.select());
// txtD?.addEventListener("focus", () => txtD.select());
// txtN?.addEventListener("focus", () => txtN.select());
// txtP?.addEventListener("focus", () => txtP.select());
// txtQ?.addEventListener("blur", coinValueChange);
// txtD?.addEventListener("blur", coinValueChange);
// txtN?.addEventListener("blur", coinValueChange);
// txtP?.addEventListener("blur", coinValueChange);
// btnLeft?.addEventListener("click", leftButtonClick);
btnRight?.addEventListener("click", checkButtonClick);

//let maxValMap = new Map();
setGameInfo();
// disable all inputs and buttons
txtQ.readOnly = true;
txtD.readOnly = true;
txtN.readOnly = true;
txtP.readOnly = true;
btnLeft?.addEventListener("click", (ev) => {
  ev.preventDefault();
});
btnRight?.addEventListener("click", (ev) => {
  ev.preventDefault();
});
nextExample();


// Get a new example.
function nextExample() {
  probState = ProbState.NEXT;
  logProbState(probState);
  tryCount = 0;
  probCount++;
  const example: Example = currentGame.genExample(ProbMark.CORRECT);
  currentProblem = example.problem;
  // exampleCoins may give CORRECT or INCORRECT answer.
  const exampleCoins: Coins = example.userCoins;
  txtAmount.innerHTML = `Amount ${currentProblem.amount}&cent;`;
  txtAmount.setAttribute('aria-valuenow', `${currentProblem.amount}`);
  maxValMap.set('txtMaxQ', currentProblem.maxCoins.getQ());
  maxValMap.set('txtMaxD', currentProblem.maxCoins.getD());
  maxValMap.set('txtMaxN', currentProblem.maxCoins.getN());
  maxValMap.set('txtMaxP', currentProblem.maxCoins.getP());
  setMaxValues();
  txtProbCount.innerHTML = `${probCount} of ${currentGame.probMax}`
  // setFeedback(ProbMark.NONE, "");
  // clearCoins();
  // setFocusQ();
  // setButtons('Clear', false, 'Check');
  // show the problem
  showProblem();
  // simulate user coin entry
  setCoinValues(exampleCoins);
  // simulate the click on Check
  btnRight.click();
}

function setCoinValues(coins: Coins) {
  txtQ.value = coins.getQ().toString();
  txtD.value = coins.getD().toString();
  txtN.value = coins.getN().toString();
  txtP.value = coins.getP().toString();
}

function checkButtonClick(): void {
  markExample();
}
// simplified version of markProblem (see game-play.ts)
function markExample(): void {
  probState = ProbState.MARK;
  logProbState(probState);
  const userCoins: Coins = getCoinValues();
  const probFeedback: ProbFeedback = currentGame.markProblem(userCoins);
  if (probFeedback.mark === ProbMark.CORRECT) {
    probState = ProbState.CORRECT;
    logProbState(probState);
    // CORRECT
    correctCount++;
    setFeedback(ProbMark.CORRECT, probFeedback.feedback);
    if (testProblemCount()) {
      // Game not done.
      setButtons('Clear', true, 'Next');
    } else {
      // Game is over.
      setButtons('Clear', true, 'Game Over');
    }
  } else {
    // INCORRECT
    probState = ProbState.INCORRECT;
    logProbState(probState);
    let feedback: string = probFeedback.feedback;
    setFeedback(ProbMark.INCORRECT, feedback);
    // No user retries - move to the next example
    // retryProblem();
    // if (testRetryCount()) {
    //   // Let the user retry.
    // } else {
    //   //  Too many retries. Force user to click "Next".
    //   setFeedback(ProbMark.INCORRECT, getSolutionString() + ". Sorry, got to move on.");
    //   setButtons('Clear', true, 'Next');
    //   if (testProblemCount()) {
    //     setButtons('Clear', true, 'Next');
    //   } else {
    //     setButtons('Clear', true, 'Game Over');
    //   }
    // }
  }

}