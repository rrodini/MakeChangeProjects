"use strict";
/*
 game.ts - logic that is independent of the game type (except for startup).
 */
// START HERE
var queryParams = new URLSearchParams(window.location.search);
var gameParamGame = queryParams.get("game");
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
var txtTitle = document.getElementById("txtTitle");
var txtDescription = document.getElementById("txtDescription");
var txtAmount = document.getElementById("txtAmount");
var txtQ = document.getElementById("txtQ");
var txtD = document.getElementById("txtD");
var txtN = document.getElementById("txtN");
var txtP = document.getElementById("txtP");
var btnLeft = document.getElementById("btnLeft");
var btnRight = document.getElementById("btnRight");
var txtFeedback = document.getElementById("txtFeedback");
txtQ === null || txtQ === void 0 ? void 0 : txtQ.addEventListener("change", coinValueChange);
txtD === null || txtD === void 0 ? void 0 : txtD.addEventListener("change", coinValueChange);
txtN === null || txtN === void 0 ? void 0 : txtN.addEventListener("change", coinValueChange);
txtP === null || txtP === void 0 ? void 0 : txtP.addEventListener("change", coinValueChange);
txtQ === null || txtQ === void 0 ? void 0 : txtQ.addEventListener("focus", function () { return txtQ.select(); });
txtD === null || txtD === void 0 ? void 0 : txtD.addEventListener("focus", function () { return txtD.select(); });
txtN === null || txtN === void 0 ? void 0 : txtN.addEventListener("focus", function () { return txtN.select(); });
txtP === null || txtP === void 0 ? void 0 : txtP.addEventListener("focus", function () { return txtP.select(); });
txtQ === null || txtQ === void 0 ? void 0 : txtQ.addEventListener("blur", coinValueChange);
txtD === null || txtD === void 0 ? void 0 : txtD.addEventListener("blur", coinValueChange);
txtN === null || txtN === void 0 ? void 0 : txtN.addEventListener("blur", coinValueChange);
txtP === null || txtP === void 0 ? void 0 : txtP.addEventListener("blur", coinValueChange);
btnLeft === null || btnLeft === void 0 ? void 0 : btnLeft.addEventListener("click", leftButtonClick);
btnRight === null || btnRight === void 0 ? void 0 : btnRight.addEventListener("click", rightButtonClick);
var maxValMap = new Map();
setGameInfo();
nextProblem();
function setGameInfo() {
    txtTitle.innerHTML = currentGame.title;
    txtDescription.innerHTML = currentGame.description;
    setFocusQ();
}
function setFocusQ() {
    txtQ.focus();
    txtQ.select();
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
function setMaxValues() {
    // key is ID for txtMaxQ, txtMaxD, etc.
    maxValMap.forEach(function (val, key) {
        var ele = document.getElementById(key);
        if (val !== Number.MAX_SAFE_INTEGER) {
            ele.innerHTML = val;
        }
        else {
            ele.innerHTML = "";
        }
    });
}
function coinValueChange(ev) {
    var valStr = this.value;
    var id = this.getAttribute('id');
    var maxVal = 0;
    if (id !== null) {
        // Map 'txtQ' -> 'txtMaxQ', etc.
        var maxId = id.replace('txt', 'txtMax');
        maxVal = maxValMap.get(maxId);
    }
    // validate val is positive # < max value for this coin
    if (!checkCoinValue(valStr, maxVal)) {
        // change the border to indicate error (don't remove coinClass)
        this.classList.add('border-danger');
        // can't click Check
        btnRight.disabled = true;
    }
    else {
        // change border back, just in case.
        this.classList.remove('border-danger');
        // can click Check
        btnRight.disabled = false;
    }
}
function setButtons(leftLabel, leftDisabled, rightLabel) {
    btnLeft.innerText = leftLabel;
    btnLeft.disabled = leftDisabled;
    btnRight.innerText = rightLabel;
    // Right button always enabled.
    btnRight.disabled = false;
}
function leftButtonClick(ev) {
    var text = btnLeft.innerText;
    var disabled = btnLeft.disabled;
    if (text === 'Clear') {
        clearCoins();
    }
    else if (text === 'Solution') {
        showSolution();
    }
    else {
        fatalError("leftButtonClick: invalid button value: ".concat(text));
    }
}
function rightButtonClick(ev) {
    var text = btnRight.innerText;
    var disabled = btnRight.disabled;
    if (text === 'Check') {
        markProblem();
    }
    else if (text === 'Next') {
        nextProblem();
    }
    else if (text === 'Retry') {
        setButtons('Clear', false, 'Check');
        setFeedback(ProbMark.NONE, "");
        showProblem();
    }
    else if (text === 'Game Over') {
        // Transition to score screen here.
        var params = "?game=".concat(gameParamGame, "&correct=").concat(correctCount, "&total=").concat(probCount);
        location.href = "score.html" + params;
    }
    else {
        fatalError("rightButtonClick: invalid button value: ".concat(text));
    }
}
function clearCoins() {
    txtQ.value = "0";
    txtQ.classList.remove('border-danger');
    txtN.value = "0";
    txtN.classList.remove('border-danger');
    txtD.value = "0";
    txtD.classList.remove('border-danger');
    txtP.value = "0";
    txtP.classList.remove('border-danger');
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
function logProbState(state) {
    console.log("probState: ".concat(ProbState[state]));
}
// Get a new problem.
function nextProblem() {
    probState = ProbState.NEXT;
    logProbState(probState);
    tryCount = 0;
    probCount++;
    var problem = currentGame.genProblem();
    txtAmount.innerHTML = "Amount ".concat(problem.amount, "&cent;");
    maxValMap.set('txtMaxQ', problem.maxCoins.getQ());
    maxValMap.set('txtMaxD', problem.maxCoins.getD());
    maxValMap.set('txtMaxN', problem.maxCoins.getN());
    maxValMap.set('txtMaxP', problem.maxCoins.getP());
    setMaxValues();
    setFeedback(ProbMark.NONE, "");
    clearCoins();
    setFocusQ();
    setButtons('Clear', false, 'Check');
    showProblem();
}
// Show the problem and wait for button click.
function showProblem() {
    probState = ProbState.SHOW;
    logProbState(probState);
}
// Give user chance to retry the same problem.
function retryProblem() {
    setButtons('Solution', false, 'Retry');
    setFocusQ();
    tryCount++;
    showProblem();
}
// User clicked "Check" so mark the problem.
function markProblem() {
    probState = ProbState.MARK;
    logProbState(probState);
    var userCoins = getCoinValues();
    var probFeedback = currentGame.markProblem(userCoins);
    if (probFeedback.mark === ProbMark.CORRECT) {
        probState = ProbState.CORRECT;
        logProbState(probState);
        // CORRECT
        correctCount++;
        setFeedback(ProbMark.CORRECT, probFeedback.feedback);
        if (testProblemCount()) {
            // Game not done.
            setButtons('Clear', true, 'Next');
        }
        else {
            // Game is over.
            setButtons('Clear', true, 'Game Over');
        }
    }
    else {
        // INCORRECT
        probState = ProbState.INCORRECT;
        logProbState(probState);
        var feedback = probFeedback.feedback;
        setFeedback(ProbMark.INCORRECT, feedback);
        retryProblem();
        if (testRetryCount()) {
            // Let the user retry.
        }
        else {
            //  Too many retries. Force user to click "Next".
            setFeedback(ProbMark.INCORRECT, getSolutionString() + ". Sorry, got to move on.");
            setButtons('Clear', true, 'Next');
            if (testProblemCount()) {
                setButtons('Clear', true, 'Next');
            }
            else {
                setButtons('Clear', true, 'Game Over');
            }
        }
    }
}
// Get the solution to display
function getSolutionString() {
    var solnCoins = currentGame.getSolution();
    var solnString = "Solution ".concat(solnCoins.toString());
    return solnString;
}
// Show the solution
function showSolution() {
    probState = ProbState.SOLUTION;
    logProbState(probState);
    setFeedback(ProbMark.INCORRECT, getSolutionString());
    // User forced to click 'Next'
    setButtons('Clear', true, 'Next');
}
// Game over if user reached problem count.
function testProblemCount() {
    return probCount < currentGame.probMax;
}
// Retry over if user reached retry count.
function testRetryCount() {
    return tryCount < currentGame.tryMax;
}
// Record a fatal error.
function fatalError(messge) {
    // Stop the program?
    console.log(messge);
}
