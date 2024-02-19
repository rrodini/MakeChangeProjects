/*
 CHANGE-MIN.TS 
 */

enum GameState {
  INIT,    // Initializing for type of game
  START,   // Game in progress
  SCORE,   // Game score displayed
  END,     // Game over, clean-up
}
let gameState: GameState;  // Current state of game
enum ProbState {
  NEXT,      // Set up next problem
  SHOW,      // Show the problem
  MARK,      // Mark the problem
  INCORRECT, // The solution was incorrect
  CORRECT,   // The solution was correct
  SOLUTION,  // Show the solution
}
enum ProbMark {
  NONE,    // Problem not graded.
  CORRECT,
  INCORRECT,
}
interface GameConfig {
  title: string,
  description: string,
  probMax: number,
  tryMax: number,
  // initGame: function
  // genProblem: function
  // markProblem: function
  // solveProblem: function
}

const gameConfig: GameConfig = {
  title: "Minimum Coins",
  description:
    "You have an unlimited number of quarters, dimes, nickels, and " +
    "pennies. Make change for the amount below using the fewest (minimum)" +
    " coins.",
  probMax: 4,
  tryMax: 3,


}

interface coins { quarters: number, dimes: number, nickels: number, pennies: number };

let probState: ProbState; // Current state of problem

const maxQuarters: number = Number.MAX_SAFE_INTEGER;
const maxDimes: number = Number.MAX_SAFE_INTEGER;
const maxNickels: number = Number.MAX_SAFE_INTEGER;
const maxPennies: number = Number.MAX_SAFE_INTEGER;

let amount: number = 0;
let quarters: number = 0;
let dimes: number = 0;
let nickels: number = 0;
let pennies: number = 0;

let probCount: number = 0;
let tryCount: number = 0;

const txtAmount = document.getElementById("txtAmount") as HTMLInputElement;
const txtQ = document.getElementById("txtQ") as HTMLInputElement;
const txtD = document.getElementById("txtD") as HTMLInputElement;
const txtN = document.getElementById("txtN") as HTMLInputElement;
const txtP = document.getElementById("txtP") as HTMLInputElement;
const btnLeft = document.getElementById("btnLeft") as HTMLButtonElement;
const btnRight = document.getElementById("btnRight") as HTMLButtonElement;
const txtFeedback = document.getElementById("txtFeedback") as HTMLInputElement;

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
// START HERE
nextProblem();

function setFeedback(mark: ProbMark, message: string) {
  switch (mark) {
    case ProbMark.NONE:
      txtFeedback.classList.remove('alert-success', 'alert-warning');
      txtFeedback.innerHTML = "";
      break;
    case ProbMark.CORRECT:
      txtFeedback.classList.remove('alert-warning');
      txtFeedback.classList.add('alert-success');
      txtFeedback.innerHTML = message;
      break;
    case ProbMark.INCORRECT:
      txtFeedback.classList.remove('alert-success');
      txtFeedback.classList.add('alert-warning');
      txtFeedback.innerHTML = message;
      break;
  }
}

function checkCoinValue(valStr: string, maxVal: number): boolean {
  let valid = false;
  // remove front and rear whitespace.
  valStr = valStr.trim();
  // check there's something.
  if (valStr.length === 0) {
    return false;
  }
  // check for 1 or 2 digits
  if (!valStr.match(/^[\d]{1,2}$/)) {
    return false;
  }
  // convert string to number
  let val = parseInt(valStr);
  // check against max value
  if (val > maxVal) {
    return false;
  }
  return true;
}

let maxValMap = new Map();
maxValMap.set('txtQ', maxQuarters);
maxValMap.set('txtD', maxDimes);
maxValMap.set('txtN', maxNickels);
maxValMap.set('txtP', maxPennies);

function coinValueChange(this: HTMLDataElement, ev: Event): void {
  const valStr: string = this.value;
  const id: string | null = this.getAttribute('id');
  let maxVal: number = 0;
  if (id !== null) {
    maxVal = maxValMap.get(id);
  }
  // validate val is positive # < max value for this coin
  if (!checkCoinValue(valStr, maxVal)) {
    // change the border to indicate error (don't remove coinClass)
    this.classList.add('border-danger');
    // can't click Check
    btnRight.disabled = true;
  } else {
    // change border back, just in case.
    this.classList.remove('border-danger');
    // can click Check
    btnRight.disabled = false;
  }
}

function setButtons(leftLabel: string, leftDisabled: boolean, rightLabel: string): void {
  btnLeft.innerText = leftLabel;
  btnLeft.disabled = leftDisabled;
  btnRight.innerText = rightLabel;
  // Right button always enabled.
  btnRight.disabled = false;
}

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
    // btnLeft.innerText = 'Clear';
    // btnLeft.disabled = false;
    // btnRight.innerText = 'Check';
    // btnRight.disabled = false;
    setFeedback(ProbMark.NONE, "");
    showProblem()
  } else {
    fatalError(`rightButtonClick: invalid button value: ${text}`);
  }
}

function clearCoins(): void {
  txtQ.value = "0";
  txtQ.classList.remove('border-danger');
  txtN.value = "0";
  txtN.classList.remove('border-danger');
  txtD.value = "0";
  txtD.classList.remove('border-danger');
  txtP.value = "0";
  txtP.classList.remove('border-danger');
}

function getCoinValues(): coins {
  const coinList = document.querySelectorAll('.coinClass') as NodeList;
  let q = 0;
  let d = 0;
  let n = 0;
  let p = 0;
  const errCoins: coins = { quarters: -1, dimes: -1, nickels: -1, pennies: -1 };
  coinList.forEach(coinNode => {
    const coinElement = coinNode as HTMLInputElement;
    const id: string = coinElement.getAttribute('id') as string;
    const valStr: string = coinElement.value as string;
    if (!checkCoinValue(valStr, maxValMap.get(id))) {
      return errCoins;
    } else {
      if (id === 'txtQ') {
        q = parseInt(valStr);
      } else if (id === 'txtD') {
        d = parseInt(valStr);
      } else if (id === 'txtN') {
        n = parseInt(valStr);
      } else if (id === 'txtP') {
        p = parseInt(valStr);
      }
      console.log(`id: ${id} valStr: ${valStr}`);
    }
  });
  return { quarters: q, dimes: d, nickels: n, pennies: p };
}

function logProbState(state: ProbState): void {
  console.log(`probState: ${ProbState[state]}`);
}

function nextProblem() {
  probState = ProbState.NEXT;
  logProbState(probState);
  tryCount = 0;
  probCount++;
  // TODO: get new problem
  amount = Math.floor(Math.random() * 99) + 1;
  txtAmount.innerHTML = `Amount ${amount}&cent;`;
  setFeedback(ProbMark.NONE, "");
  clearCoins();
  setButtons('Clear', false, 'Check');
  // btnLeft.innerText = 'Clear';
  // btnLeft.disabled = false;
  // btnRight.innerText = 'Check';
  // btnRight.disabled = false;
  showProblem();
}

function showProblem() {
  probState = ProbState.SHOW;
  logProbState(probState);
}

function retryProblem() {
  btnLeft.innerText = 'Solution';
  btnLeft.disabled = false;
  btnRight.innerText = 'Retry';
  btnRight.disabled = false;
  tryCount++;
  showProblem();
}
// TODO: eliminate
function coinsSumMatch(amount: number, screenCoins: coins): boolean {
  const screenSum = screenCoins.quarters * 25 +
    screenCoins.dimes * 10 +
    screenCoins.nickels * 5 +
    screenCoins.pennies;
  return amount === screenSum;
}
// TODO: eliminate
function coinsCountMatch(screenCoins: coins, solnCoins: coins): boolean {
  return screenCoins.quarters === solnCoins.quarters &&
    screenCoins.dimes === solnCoins.dimes &&
    screenCoins.nickels === solnCoins.nickels &&
    screenCoins.pennies === solnCoins.pennies;
}
// TODO: eliminate
function getSolution(amount: number): coins {
  let localAmount = amount;
  const q = Math.floor(localAmount / 25);
  localAmount = Math.floor(localAmount % 25);
  const d = Math.floor(localAmount / 10);
  localAmount = Math.floor(localAmount % 10);
  const n = Math.floor(localAmount / 5);
  const p = Math.floor(localAmount % 5);
  return { quarters: q, dimes: d, nickels: n, pennies: p };
}

function markProblem(): void {
  probState = ProbState.MARK;
  logProbState(probState);
  const coins: coins = getCoinValues();
  const solnCoins = getSolution(amount);
  // TODO: gameConfig.markProblem
  if (coinsSumMatch(amount, coins) &&
    coinsCountMatch(coins, solnCoins)) {
    probState = ProbState.CORRECT;
    logProbState(probState);
    // CORRECT
    setFeedback(ProbMark.CORRECT, "Correct!");
    setButtons('Clear', true, 'Next');
    // btnLeft.innerText = 'Clear';
    // btnLeft.disabled = true;
    // btnRight.innerText = 'Next';
    // btnRight.disabled = false;
    if (testProblemCount()) {
      // Do nothing: just wait for Next click
    } else {
      alert("Game over!");
    }
  } else {
    // INCORRECT
    probState = ProbState.INCORRECT;
    logProbState(probState);
    let feedback: string = "";
    if (!coinsSumMatch(amount, coins)) {
      feedback = "Coins don't sum to Amount."
    } else if (!coinsCountMatch(coins, solnCoins)) {
      feedback = "Number of coins not minimum.";
    }
    setFeedback(ProbMark.INCORRECT, feedback);
    retryProblem();
    if (testRetryCount()) {
    } else {
      // Force user to click Next
      setFeedback(ProbMark.INCORRECT, feedback + " Sorry, got to move on.");
      setButtons('Clear', true, 'Next');
      // btnLeft.innerText = 'Clear';
      // btnLeft.disabled = true;
      // btnRight.innerText = 'Next';
      // btnRight.disabled = false;
      if (testProblemCount()) {
        // Do nothing.
      } else {
        alert('Game Over');
      }
    }

  }
}

function showSolution() {
  probState = ProbState.SOLUTION;
  logProbState(probState);
  // TODO: gameConfig.solveProblem()
  const solnCoins: coins = getSolution(amount);
  const feedback: string = `Solution [Q: ${solnCoins.quarters}, D: ${solnCoins.dimes},
 N: ${solnCoins.nickels}, P: ${solnCoins.pennies}]`;
  setFeedback(ProbMark.INCORRECT, feedback);
  // User forced to click 'Next'
  setButtons('Clear', true, 'Next');
  // btnLeft.innerText = 'Clear';
  // btnLeft.disabled = true;
  // btnRight.innerText = 'Next';
  // btnRight.disabled = false;
}

function testProblemCount(): boolean {
  return probCount < gameConfig.probMax;
}

function testRetryCount(): boolean {
  return tryCount < gameConfig.tryMax;
}

function fatalError(messge: string): void {
  // TODO stop the program
  console.log(messge);
}