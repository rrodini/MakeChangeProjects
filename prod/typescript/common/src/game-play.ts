/*
 game-play.ts - game play logic.
 */

// START HERE

txtQ?.addEventListener("change", coinValueChange);
txtD?.addEventListener("change", coinValueChange);
txtN?.addEventListener("change", coinValueChange);
txtP?.addEventListener("change", coinValueChange);
txtQ?.addEventListener("focus", () => txtQ.select());
txtD?.addEventListener("focus", () => txtD.select());
txtN?.addEventListener("focus", () => txtN.select());
txtP?.addEventListener("focus", () => txtP.select());
txtQ?.addEventListener("blur", coinValueChange);
txtD?.addEventListener("blur", coinValueChange);
txtN?.addEventListener("blur", coinValueChange);
txtP?.addEventListener("blur", coinValueChange);
btnLeft?.addEventListener("click", leftButtonClick);
btnRight?.addEventListener("click", rightButtonClick);

setGameInfo();
nextProblem();
// An input coin value has changed. Give feedback if new
// value is invalid. 
function coinValueChange(this: HTMLDataElement, ev: Event): void {
  const valStr: string = this.value;
  const id: string | null = this.getAttribute('id');
  let maxVal: number = 0;
  if (id !== null) {
    // Map 'txtQ' -> 'txtMaxQ', etc.
    const maxId = id.replace('txt', 'txtMax');
    maxVal = maxValMap.get(maxId);
  }
  // validate val is positive # < max value for this coin
  if (!checkCoinValue(valStr, maxVal)) {
    // change the border to indicate error (don't remove coinClass)
    this.classList.add('border-danger');
    this.setAttribute('aria-invalid', 'true');
    // can't click Check
    btnRight.disabled = true;
  } else {
    // change border back, just in case.
    this.classList.remove('border-danger');
    this.setAttribute('aria-invalid', 'false');
    this.setAttribute('aria-valuenow', valStr);
    // can click Check
    btnRight.disabled = false;
  }
}
// Left button click handler. Use current state to determine what to do.
function leftButtonClick(this: HTMLButtonElement, ev: Event): void {
  const text: string = btnLeft.innerText;
  const disabled: boolean = btnLeft.disabled;
  if (text === 'Clear') {
    clearCoins();
  } else if (text === 'Solution') {
    showSolution();
  } else {
    fatalError(`leftButtonClick: invalid button value: ${text}`);
  }
}
// Right button click handler. Use current state to determine what to do.
function rightButtonClick(this: HTMLButtonElement, ev: Event): void {
  const text: string = btnRight.innerText;
  const disabled: boolean = btnRight.disabled;
  if (text === 'Check') {
    markProblem();
  } else if (text === 'Next') {
    nextProblem()
  } else if (text === 'Retry') {
    setButtons('Clear', false, 'Check');
    setFeedback(ProbMark.NONE, "");
    showProblem()
  } else if (text === 'Game Over') {
    // Transition to score screen here.
    let params: string = `?game=${gameParamGameType}&correct=${correctCount}&total=${probCount}`;
    location.href = "score.html" + params;
  } else {
    fatalError(`rightButtonClick: invalid button value: ${text}`);
  }
}
// Get a new problem.
function nextProblem() {
  probState = ProbState.NEXT;
  logProbState(probState);
  tryCount = 0;
  probCount++;
  currentProblem = currentGame.genProblem();
  txtAmount.innerHTML = `Amount ${currentProblem.amount}&cent;`;
  txtAmount.setAttribute('aria-valuenow', `${currentProblem.amount}`);
  maxValMap.set('txtMaxQ', currentProblem.maxCoins.getQ());
  maxValMap.set('txtMaxD', currentProblem.maxCoins.getD());
  maxValMap.set('txtMaxN', currentProblem.maxCoins.getN());
  maxValMap.set('txtMaxP', currentProblem.maxCoins.getP());
  setMaxValues();
  txtProbCount.innerHTML = `${probCount} of ${currentGame.probMax}`
  setFeedback(ProbMark.NONE, "");
  clearCoins();
  setFocusQ();
  setButtons('Clear', false, 'Check');
  showProblem();
}
// Give user chance to retry the same problem.
function retryProblem() {
  setButtons('Solution', false, 'Retry');
  setFocusQ();
  tryCount++;
  showProblem();
}
// User clicked "Check" so mark the problem.
function markProblem(): void {
  probState = ProbState.MARK;
  logProbState(probState);
  const userCoins: Coins = getCoinValues();
  const probFeedback: ProbFeedback = currentGame.markProblem(userCoins, true);
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
    retryProblem();
    if (testRetryCount()) {
      // Let the user retry.
    } else {
      //  Too many retries. Force user to click "Next".
      setFeedback(ProbMark.INCORRECT, getSolutionString() + ". Sorry, got to move on.");
      setButtons('Clear', true, 'Next');
      if (testProblemCount()) {
        setButtons('Clear', true, 'Next');
      } else {
        setButtons('Clear', true, 'Game Over');
      }
    }
  }
}
// Get the solution to display
function getSolutionString(): string {
  const solnCoins: Coins = currentGame.getSolution();
  const solnString: string = `Solution ${solnCoins.toString()}`;
  return solnString;
}
// Show the solution
function showSolution() {
  probState = ProbState.SOLUTION;
  logProbState(probState);
  setFeedback(ProbMark.INCORRECT, getSolutionString());
  // User forced to click 'Next' or maybe 'Game Over'
  if (testProblemCount()) {
    setButtons('Clear', true, 'Next');
  } else {
    setButtons('Clear', true, 'Game Over');
  }
}
// Game over if user reached problem count.
function testProblemCount(): boolean {
  return probCount < currentGame.probMax;
}
// Retry over if user reached retry count.
function testRetryCount(): boolean {
  return tryCount < currentGame.tryMax;
}
// Record a fatal error.
function fatalError(messge: string): void {
  // Stop the program?
  console.log(messge);
}