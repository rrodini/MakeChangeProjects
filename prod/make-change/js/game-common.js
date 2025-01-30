"use strict";
/*
 game-common.ts - Everything that is common between game-play and game-help.
 Types, globals, functions, etc.
 */
// Globals
var currentGameType;
var currentProblem;
var solnCoins;
var currentGame;
var queryParams = new URLSearchParams(window.location.search);
var gameParamGame = queryParams.get("game");
var GameKind;
(function (GameKind) {
    GameKind[GameKind["PLAY"] = 0] = "PLAY";
    GameKind[GameKind["HELP"] = 1] = "HELP";
})(GameKind || (GameKind = {}));
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
var txtNoOfCoins = document.getElementById("txtNoOfCoins");
var txtAmount = document.getElementById("txtAmount");
var txtQ = document.getElementById("txtQ");
var txtD = document.getElementById("txtD");
var txtN = document.getElementById("txtN");
var txtP = document.getElementById("txtP");
var btnLeft = document.getElementById("btnLeft");
var btnRight = document.getElementById("btnRight");
var txtProbCount = document.getElementById("txtProbCount");
var txtFeedback = document.getElementById("txtFeedback");
function setGameInfo() {
    txtTitle.innerHTML = currentGame.title;
    txtDescription.innerHTML = currentGame.description;
    setFocusQ();
}
function setFocusQ() {
    txtQ.focus();
    txtQ.select();
}
function logProbState(state) {
    console.log("probState: ".concat(ProbState[state]));
}
// Show the problem and wait for button click.
function showProblem() {
    probState = ProbState.SHOW;
    logProbState(probState);
}
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
