"use strict";
/*
 game-common.ts - Everything that is common between game-play.ts and game-help.ts.
 Types, globals, functions, etc.
 */
// Globals
var currentGameType;
var currentGameMode;
var currentProblem;
var solnCoins;
var currentGame = gameCoinsMin; // make typescript happy
var queryParams = new URLSearchParams(window.location.search);
var gameParamGameType = queryParams.get("gameType");
var gameParamGameMode = queryParams.get("gameMode");
console.log("gameParamGameType: ".concat(gameParamGameType));
console.log("gameParamGameMode: ".concat(gameParamGameMode));
var GameState;
(function (GameState) {
    GameState[GameState["INIT"] = 0] = "INIT";
    GameState[GameState["START"] = 1] = "START";
    GameState[GameState["SCORE"] = 2] = "SCORE";
    GameState[GameState["END"] = 3] = "END";
})(GameState || (GameState = {}));
var gameState; // Current state of game
var ProbState;
(function (ProbState) {
    ProbState[ProbState["NEXT"] = 0] = "NEXT";
    ProbState[ProbState["SHOW"] = 1] = "SHOW";
    ProbState[ProbState["MARK"] = 2] = "MARK";
    ProbState[ProbState["INCORRECT"] = 3] = "INCORRECT";
    ProbState[ProbState["CORRECT"] = 4] = "CORRECT";
    ProbState[ProbState["SOLUTION"] = 5] = "SOLUTION";
})(ProbState || (ProbState = {}));
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
function loadScript(src) {
    var script = document.createElement("script");
    script.src = src;
    script.defer = true; // To maintain execution order
    document.body.appendChild(script);
}
// create the hand image used by game-play.ts
function createImgHand() {
    var img = document.createElement("img");
    img.src = "img/hand-index-thumb.png";
    img.width = 32;
    img.style.visibility = "hidden";
    document.body.appendChild(img);
    return img;
}
currentGameType = currentGame.type;
var probState; // Current state of problem
var maxQuarters = 0;
var maxDimes = 0;
var maxNickels = 0;
var maxPennies = 0;
var amount = 0;
var quarters = 0;
var dimes = 0;
var nickels = 0;
var pennies = 0;
var probCount = 0;
var correctCount = 0;
var tryCount = 0;
var maxValMap = new Map();
var txtTitle = document.getElementById("txtTitle");
var txtDescription = document.getElementById("txtDescription");
var txtDesc1; // must be set after txtDescription value is assigned.
var txtDesc2; // must be set after txtDescription value is assigned.
var txtNoOfCoins = document.getElementById("txtNoOfCoins");
var txtAmount = document.getElementById("txtAmount");
var txtQ = document.getElementById("txtQ");
var txtD = document.getElementById("txtD");
var txtN = document.getElementById("txtN");
var txtP = document.getElementById("txtP");
var txtMaxQ = document.getElementById("txtMaxQ");
var txtMaxD = document.getElementById("txtMaxD");
var txtMaxN = document.getElementById("txtMaxN");
var txtMaxP = document.getElementById("txtMaxP");
var btnLeft = document.getElementById("btnLeft");
var btnRight = document.getElementById("btnRight");
var txtProbCount = document.getElementById("txtProbCount");
var txtFeedback = document.getElementById("txtFeedback");
var imgHand = createImgHand();
// set the title and the description field.
function setGameInfo() {
    var title = "";
    if (currentGameMode === GameMode.HELP) {
        title = "Watch me play<br/>";
    }
    title += currentGame.title;
    txtTitle.innerHTML = title;
    txtDescription.innerHTML = currentGame.description;
    setFocusQ();
}
// put the focus on the quarters input.
function setFocusQ() {
    txtQ.focus();
    txtQ.select();
}
// Log the problem state (used for debugging).
function logProbState(state) {
    console.log("probState: ".concat(ProbState[state]));
}
// Show the problem and wait for button click.
function showProblem() {
    probState = ProbState.SHOW;
    logProbState(probState);
}
// Set the max values fields.
function setMaxValues() {
    // key is ID for txtMaxQ, txtMaxD, etc.
    maxValMap.forEach(function (val, key) {
        var ele = document.getElementById(key);
        if (val !== Number.MAX_SAFE_INTEGER) {
            ele.innerHTML = val;
            ele.setAttribute('aria-valuenow', val);
        }
        else {
            ele.innerHTML = "";
            ele.setAttribute('aria-valuetext', 'unlimited');
        }
    });
}
// Clear the coins values by setting them to zeros.
function clearCoins() {
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
function getCoinValues() {
    var coinList = document.querySelectorAll('.coinClass');
    var q = 0;
    var d = 0;
    var n = 0;
    var p = 0;
    var errCoins = new Coins(-1, -1, -1, -1);
    coinList.forEach(function (coinNode) {
        var coinElement = coinNode;
        var id = coinElement.getAttribute('id');
        var valStr = coinElement.value;
        if (!checkCoinValue(valStr, maxValMap.get(id))) {
            return errCoins;
        }
        else {
            if (id === 'txtQ') {
                q = parseInt(valStr);
            }
            else if (id === 'txtD') {
                d = parseInt(valStr);
            }
            else if (id === 'txtN') {
                n = parseInt(valStr);
            }
            else if (id === 'txtP') {
                p = parseInt(valStr);
            }
            console.log("id: ".concat(id, " valStr: ").concat(valStr));
        }
    });
    return new Coins(q, d, n, p);
}
// Validate an input coin value.
function checkCoinValue(valStr, maxVal) {
    var valid = false;
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
    var val = parseInt(valStr);
    // check against max value
    if (val > maxVal) {
        return false;
    }
    return true;
}
// Set the left / right buttons according to the state of the problem.
function setButtons(leftLabel, leftDisabled, rightLabel, rightDisabled) {
    btnLeft.innerText = leftLabel;
    btnLeft.disabled = leftDisabled;
    btnRight.innerText = rightLabel;
    // Right button disabled only in HELP mode.
    btnRight.disabled = rightDisabled;
}
// Set the feedback area after marking the problem.
function setFeedback(mark, message) {
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
