/*
 game-common.ts - Everything that is common between game-play and game-help.
 Types, globals, functions, etc.
 */

// Globals
let currentGameType: GameType;
let currentProblem: Problem;
let solnCoins: Coins;
let currentGame: GameConfig;

const queryParams = new URLSearchParams(window.location.search);
const gameParamGame: string = queryParams.get("game")!;

enum GameKind {
  PLAY,    // Play a real game
  HELP,    // Help on game
}
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
const txtNoOfCoins = document.getElementById("txtNoOfCoins") as HTMLInputElement;
const txtAmount = document.getElementById("txtAmount") as HTMLInputElement;
const txtQ = document.getElementById("txtQ") as HTMLInputElement;
const txtD = document.getElementById("txtD") as HTMLInputElement;
const txtN = document.getElementById("txtN") as HTMLInputElement;
const txtP = document.getElementById("txtP") as HTMLInputElement;
const btnLeft = document.getElementById("btnLeft") as HTMLButtonElement;
const btnRight = document.getElementById("btnRight") as HTMLButtonElement;
const txtProbCount = document.getElementById("txtProbCount") as HTMLInputElement;
const txtFeedback = document.getElementById("txtFeedback") as HTMLInputElement;

function setGameInfo() {
  txtTitle.innerHTML = currentGame.title;
  txtDescription.innerHTML = currentGame.description;
  setFocusQ();
}

function setFocusQ(): void {
  txtQ.focus();
  txtQ.select();
}

function logProbState(state: ProbState): void {
  console.log(`probState: ${ProbState[state]}`);
}
// Show the problem and wait for button click.
function showProblem() {
  probState = ProbState.SHOW;
  logProbState(probState);
}

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