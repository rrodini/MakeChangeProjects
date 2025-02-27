/*
 game-common.ts - Everything that is common between game-play.ts and game-help.ts.
 Types, globals, functions, etc.
 */

// Globals
let currentGameType: GameType;
let currentGameMode: GameMode;
let currentProblem: Problem;
let solnCoins: Coins;
let currentGame: GameConfig = gameCoinsMin;  // make typescript happy

const queryParams = new URLSearchParams(window.location.search);
const gameParamGameType: string = queryParams.get("gameType")!;
const gameParamGameMode: string = queryParams.get("gameMode")!;

console.log(`gameParamGameType: ${gameParamGameType}`);
console.log(`gameParamGameMode: ${gameParamGameMode}`);

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
// process query parameter gameType
switch (gameParamGameType) {
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
// process query parameter gameMode
switch (gameParamGameMode) {
  case GameMode[GameMode.PLAY]:
    currentGameMode = GameMode.PLAY;
    loadScript("js/game-play.js");
    break;
  case GameMode[GameMode.HELP]:
    currentGameMode = GameMode.HELP;
    loadScript("js/game-help.js");
    break;

}
// load the final script depending on gameMode.
function loadScript(src: string): void {
  const script = document.createElement("script");
  script.src = src;
  script.defer = true; // To maintain execution order
  document.body.appendChild(script);
}
// create the hand image used by game-play.ts
function createImgHand(): HTMLImageElement {
  const img = document.createElement<"img">("img");
  img.src = "img/hand-index-thumb.png";
  img.width = 32;
  img.style.visibility = "hidden";
  document.body.appendChild(img);
  return img;
}
currentGameType = currentGame.type;

let probState: ProbState; // Current state of problem

const maxQuarters: number = 0;
const maxDimes: number = 0;
const maxNickels: number = 0;
const maxPennies: number = 0;

let amount: number = 0;
let quarters: number = 0;
let dimes: number = 0;
let nickels: number = 0;
let pennies: number = 0;

let probCount: number = 0;
let correctCount: number = 0;
let tryCount: number = 0;
let maxValMap = new Map();

const txtTitle = document.getElementById("txtTitle") as HTMLInputElement;
const txtDescription = document.getElementById("txtDescription") as HTMLInputElement;
var txtDesc1: HTMLElement;  // must be set after txtDescription value is assigned.
var txtDesc2: HTMLElement;  // must be set after txtDescription value is assigned.
const txtNoOfCoins = document.getElementById("txtNoOfCoins") as HTMLInputElement;
const txtAmount = document.getElementById("txtAmount") as HTMLInputElement;
const txtQ = document.getElementById("txtQ") as HTMLInputElement;
const txtD = document.getElementById("txtD") as HTMLInputElement;
const txtN = document.getElementById("txtN") as HTMLInputElement;
const txtP = document.getElementById("txtP") as HTMLInputElement;
const txtMaxQ = document.getElementById("txtMaxQ") as HTMLInputElement;
const txtMaxD = document.getElementById("txtMaxD") as HTMLInputElement;
const txtMaxN = document.getElementById("txtMaxN") as HTMLInputElement;
const txtMaxP = document.getElementById("txtMaxP") as HTMLInputElement;
const btnLeft = document.getElementById("btnLeft") as HTMLButtonElement;
const btnRight = document.getElementById("btnRight") as HTMLButtonElement;
const txtProbCount = document.getElementById("txtProbCount") as HTMLInputElement;
const txtFeedback = document.getElementById("txtFeedback") as HTMLInputElement;
const imgHand = createImgHand();
// set the title and the description field.
function setGameInfo() {
  var title: string = "";
  if (currentGameMode === GameMode.HELP) {
    title = "Watch me play<br/>"
  }
  title += currentGame.title;
  txtTitle.innerHTML = title;
  txtDescription.innerHTML = currentGame.description;
  setFocusQ();
}
// put the focus on the quarters input.
function setFocusQ(): void {
  txtQ.focus();
  txtQ.select();
}
// Log the problem state (used for debugging).
function logProbState(state: ProbState): void {
  console.log(`probState: ${ProbState[state]}`);
}
// Show the problem and wait for button click.
function showProblem() {
  probState = ProbState.SHOW;
  logProbState(probState);
}
// Set the max values fields.
function setMaxValues() {
  // key is ID for txtMaxQ, txtMaxD, etc.
  maxValMap.forEach((val, key) => {
    let ele: HTMLInputElement = document.getElementById(key) as HTMLInputElement;
    if (val !== Number.MAX_SAFE_INTEGER) {
      ele.innerHTML = val;
      ele.setAttribute('aria-valuenow', val);
    } else {
      ele.innerHTML = "";
      ele.setAttribute('aria-valuetext', 'unlimited');
    }
  })
}
// Clear the coins values by setting them to zeros.
function clearCoins(): void {
  txtQ.value = "0";
  txtQ.classList.remove('border-danger');
  txtQ.setAttribute('aria-invalid', 'false');
  txtD.value = "0";
  txtD.classList.remove('border-danger');
  txtD.setAttribute('aria-invalid', 'false');
  txtN.value = "0";
  txtN.classList.remove('border-danger');
  txtN.setAttribute('aria-invalid', 'false');
  txtP.value = "0";
  txtP.classList.remove('border-danger');
  txtP.setAttribute('aria-invalid', 'false');
}
// Get the input coin values as Coins object.
function getCoinValues(): Coins {
  const coinList = document.querySelectorAll('.coinClass') as NodeList;
  let q = 0;
  let d = 0;
  let n = 0;
  let p = 0;
  const errCoins: Coins = new Coins(-1, -1, -1, -1);
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
  return new Coins(q, d, n, p);
}
// Validate an input coin value.
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
// Set the left / right buttons according to the state of the problem.
function setButtons(leftLabel: string, leftDisabled: boolean, rightLabel: string): void {
  btnLeft.innerText = leftLabel;
  btnLeft.disabled = leftDisabled;
  btnRight.innerText = rightLabel;
  // Right button always enabled.
  btnRight.disabled = false;
}
// Set the feedback area after marking the problem.
function setFeedback(mark: ProbMark, message: string) {
  switch (mark) {
    case ProbMark.NONE:
      txtFeedback.classList.remove('alert-success', 'alert-danger');
      txtFeedback.innerHTML = "";
      break;
    case ProbMark.CORRECT:
      txtFeedback.classList.remove('alert-danger');
      txtFeedback.classList.add('alert-success');
      txtFeedback.innerHTML = message;
      break;
    case ProbMark.INCORRECT:
      txtFeedback.classList.remove('alert-success');
      txtFeedback.classList.add('alert-danger');
      txtFeedback.innerHTML = message;
      break;
  }
}