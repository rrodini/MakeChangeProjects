/*
 game-play.ts - game play logic.
 */

// START HERE

// switch (gameParamGameType) {
//   case GameType[GameType.MIN_COINS]:
//     currentGame = gameCoinsMin;
//     break;
//   case GameType[GameType.FINITE_COINS]:
//     currentGame = gameCoinsFinite;
//     break;
//   case GameType[GameType.MAX_COINS]:
//     currentGame = gameCoinsMax;
//     break;
// }
// currentGameType = currentGame.type;

// enum GameState {
//   INIT,    // Initializing for type of game
//   START,   // Game in progress
//   SCORE,   // Game score displayed
//   END,     // Game over, clean-up
// }
// let gameState: GameState;  // Current state of game
// enum ProbState {
//   NEXT,      // Set up next problem
//   SHOW,      // Show the problem
//   MARK,      // Mark the problem
//   INCORRECT, // The solution was incorrect
//   CORRECT,   // The solution was correct
//   SOLUTION,  // Show the solution
// }

// let probState: ProbState; // Current state of problem

// const maxQuarters: number = 0;
// const maxDimes: number = 0;
// const maxNickels: number = 0;
// const maxPennies: number = 0;

// let amount: number = 0;
// let quarters: number = 0;
// let dimes: number = 0;
// let nickels: number = 0;
// let pennies: number = 0;

// let probCount: number = 0;
// let correctCount: number = 0;
// let tryCount: number = 0;

// const txtTitle = document.getElementById("txtTitle") as HTMLInputElement;
// const txtDescription = document.getElementById("txtDescription") as HTMLInputElement;
// const txtNoOfCoins = document.getElementById("txtNoOfCoins") as HTMLInputElement;
// const txtAmount = document.getElementById("txtAmount") as HTMLInputElement;
// const txtQ = document.getElementById("txtQ") as HTMLInputElement;
// const txtD = document.getElementById("txtD") as HTMLInputElement;
// const txtN = document.getElementById("txtN") as HTMLInputElement;
// const txtP = document.getElementById("txtP") as HTMLInputElement;
// const btnLeft = document.getElementById("btnLeft") as HTMLButtonElement;
// const btnRight = document.getElementById("btnRight") as HTMLButtonElement;
// const txtProbCount = document.getElementById("txtProbCount") as HTMLInputElement;
// const txtFeedback = document.getElementById("txtFeedback") as HTMLInputElement;

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
/* moved to game-common.ts */
//let maxValMap = new Map();
setGameInfo();
nextProblem();
/* moved to game-common.ts */
// function setGameInfo() {
//   txtTitle.innerHTML = currentGame.title;
//   txtDescription.innerHTML = currentGame.description;
//   setFocusQ();
// }

/* moved to game-common.ts */
// function setFocusQ(): void {
//   txtQ.focus();
//   txtQ.select();
// }
/* moved to game-common.ts */
// function setFeedback(mark: ProbMark, message: string) {
//   switch (mark) {
//     case ProbMark.NONE:
//       txtFeedback.classList.remove('alert-success', 'alert-danger');
//       txtFeedback.innerHTML = "";
//       break;
//     case ProbMark.CORRECT:
//       txtFeedback.classList.remove('alert-danger');
//       txtFeedback.classList.add('alert-success');
//       txtFeedback.innerHTML = message;
//       break;
//     case ProbMark.INCORRECT:
//       txtFeedback.classList.remove('alert-success');
//       txtFeedback.classList.add('alert-danger');
//       txtFeedback.innerHTML = message;
//       break;
//   }
// }
/* moved to game-common.ts */
// function checkCoinValue(valStr: string, maxVal: number): boolean {
//   let valid = false;
//   // remove front and rear whitespace.
//   valStr = valStr.trim();
//   // check there's something.
//   if (valStr.length === 0) {
//     return false;
//   }
//   // check for 1 or 2 digits
//   if (!valStr.match(/^[\d]{1,2}$/)) {
//     return false;
//   }
//   // convert string to number
//   let val = parseInt(valStr);
//   // check against max value
//   if (val > maxVal) {
//     return false;
//   }
//   return true;
// }

/* moved to game-common.ts */
// function setMaxValues() {
//   // key is ID for txtMaxQ, txtMaxD, etc.
//   maxValMap.forEach((val, key) => {
//     let ele: HTMLInputElement = document.getElementById(key) as HTMLInputElement;
//     if (val !== Number.MAX_SAFE_INTEGER) {
//       ele.innerHTML = val;
//       ele.setAttribute('aria-valuenow', val);
//     } else {
//       ele.innerHTML = "";
//       ele.setAttribute('aria-valuetext', 'unlimited');
//     }
//   })
// }

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
/* moved to game-common.ts */
// function setButtons(leftLabel: string, leftDisabled: boolean, rightLabel: string): void {
//   btnLeft.innerText = leftLabel;
//   btnLeft.disabled = leftDisabled;
//   btnRight.innerText = rightLabel;
//   // Right button always enabled.
//   btnRight.disabled = false;
// }

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
/* moved to game-common.ts */
// function clearCoins(): void {
//   txtQ.value = "0";
//   txtQ.classList.remove('border-danger');
//   txtQ.setAttribute('aria-invalid', 'false');
//   txtD.value = "0";
//   txtD.classList.remove('border-danger');
//   txtD.setAttribute('aria-invalid', 'false');
//   txtN.value = "0";
//   txtN.classList.remove('border-danger');
//   txtN.setAttribute('aria-invalid', 'false');
//   txtP.value = "0";
//   txtP.classList.remove('border-danger');
//   txtP.setAttribute('aria-invalid', 'false');
// }

/* moved to game-common.ts */
// function getCoinValues(): Coins {
//   const coinList = document.querySelectorAll('.coinClass') as NodeList;
//   let q = 0;
//   let d = 0;
//   let n = 0;
//   let p = 0;
//   const errCoins: Coins = new Coins(-1, -1, -1, -1);
//   coinList.forEach(coinNode => {
//     const coinElement = coinNode as HTMLInputElement;
//     const id: string = coinElement.getAttribute('id') as string;
//     const valStr: string = coinElement.value as string;
//     if (!checkCoinValue(valStr, maxValMap.get(id))) {
//       return errCoins;
//     } else {
//       if (id === 'txtQ') {
//         q = parseInt(valStr);
//       } else if (id === 'txtD') {
//         d = parseInt(valStr);
//       } else if (id === 'txtN') {
//         n = parseInt(valStr);
//       } else if (id === 'txtP') {
//         p = parseInt(valStr);
//       }
//       console.log(`id: ${id} valStr: ${valStr}`);
//     }
//   });
//   return new Coins(q, d, n, p);
// }

// function logProbState(state: ProbState): void {
//   console.log(`probState: ${ProbState[state]}`);
// }
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
/* moved to game-common.ts */
// Show the problem and wait for button click.
// function showProblem() {
//   probState = ProbState.SHOW;
//   logProbState(probState);
// }
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