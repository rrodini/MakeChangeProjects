"use strict";
/*
 CHANGE-MIN.TS
 */
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
var ProbMark;
(function (ProbMark) {
    ProbMark[ProbMark["NONE"] = 0] = "NONE";
    ProbMark[ProbMark["CORRECT"] = 1] = "CORRECT";
    ProbMark[ProbMark["INCORRECT"] = 2] = "INCORRECT";
})(ProbMark || (ProbMark = {}));
var gameConfig = {
    title: "Minimum Coins",
    description: "You have an unlimited number of quarters, dimes, nickels, and " +
        "pennies. Make change for the amount below using the fewest (minimum)" +
        " coins.",
    probMax: 4,
    tryMax: 3,
};
;
var probState; // Current state of problem
var maxQuarters = Number.MAX_SAFE_INTEGER;
var maxDimes = Number.MAX_SAFE_INTEGER;
var maxNickels = Number.MAX_SAFE_INTEGER;
var maxPennies = Number.MAX_SAFE_INTEGER;
var amount = 0;
var quarters = 0;
var dimes = 0;
var nickels = 0;
var pennies = 0;
var probCount = 0;
var tryCount = 0;
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
// START HERE
nextProblem();
function setFeedback(mark, message) {
    switch (mark) {
        case ProbMark.NONE:
            // txtFeedback.classList.remove('alert-success', 'alert-warning');
            // txtFeedback.innerHTML = "";
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
var maxValMap = new Map();
maxValMap.set('txtQ', maxQuarters);
maxValMap.set('txtD', maxDimes);
maxValMap.set('txtN', maxNickels);
maxValMap.set('txtP', maxPennies);
function coinValueChange(ev) {
    var valStr = this.value;
    var id = this.getAttribute('id');
    var maxVal = 0;
    if (id !== null) {
        maxVal = maxValMap.get(id);
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
        // btnLeft.innerText = 'Clear';
        // btnLeft.disabled = false;
        // btnRight.innerText = 'Check';
        // btnRight.disabled = false;
        setFeedback(ProbMark.NONE, "");
        showProblem();
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
    var errCoins = { quarters: -1, dimes: -1, nickels: -1, pennies: -1 };
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
    return { quarters: q, dimes: d, nickels: n, pennies: p };
}
function logProbState(state) {
    console.log("probState: ".concat(ProbState[state]));
}
function nextProblem() {
    probState = ProbState.NEXT;
    logProbState(probState);
    tryCount = 0;
    probCount++;
    // TODO: get new problem
    amount = Math.floor(Math.random() * 99) + 1;
    txtAmount.innerHTML = "Amount ".concat(amount, "&cent;");
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
function coinsSumMatch(amount, screenCoins) {
    var screenSum = screenCoins.quarters * 25 +
        screenCoins.dimes * 10 +
        screenCoins.nickels * 5 +
        screenCoins.pennies;
    return amount === screenSum;
}
// TODO: eliminate
function coinsCountMatch(screenCoins, solnCoins) {
    return screenCoins.quarters === solnCoins.quarters &&
        screenCoins.dimes === solnCoins.dimes &&
        screenCoins.nickels === solnCoins.nickels &&
        screenCoins.pennies === solnCoins.pennies;
}
// TODO: eliminate
function getSolution(amount) {
    var localAmount = amount;
    var q = Math.floor(localAmount / 25);
    localAmount = Math.floor(localAmount % 25);
    var d = Math.floor(localAmount / 10);
    localAmount = Math.floor(localAmount % 10);
    var n = Math.floor(localAmount / 5);
    var p = Math.floor(localAmount % 5);
    return { quarters: q, dimes: d, nickels: n, pennies: p };
}
function markProblem() {
    probState = ProbState.MARK;
    logProbState(probState);
    var coins = getCoinValues();
    var solnCoins = getSolution(amount);
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
        }
        else {
            alert("Game over!");
        }
    }
    else {
        // INCORRECT
        probState = ProbState.INCORRECT;
        logProbState(probState);
        var feedback = "";
        if (!coinsSumMatch(amount, coins)) {
            feedback = "Coins don't sum to Amount.";
        }
        else if (!coinsCountMatch(coins, solnCoins)) {
            feedback = "Number of coins not minimum.";
        }
        setFeedback(ProbMark.INCORRECT, feedback);
        retryProblem();
        if (testRetryCount()) {
        }
        else {
            // Force user to click Next
            setFeedback(ProbMark.INCORRECT, feedback + " Sorry, got to move on.");
            setButtons('Clear', true, 'Next');
            // btnLeft.innerText = 'Clear';
            // btnLeft.disabled = true;
            // btnRight.innerText = 'Next';
            // btnRight.disabled = false;
            if (testProblemCount()) {
                // Do nothing.
            }
            else {
                alert('Game Over');
            }
        }
    }
}
function showSolution() {
    probState = ProbState.SOLUTION;
    logProbState(probState);
    // TODO: gameConfig.solveProblem()
    var solnCoins = getSolution(amount);
    var feedback = "Solution [Q: ".concat(solnCoins.quarters, ", D: ").concat(solnCoins.dimes, ",\n N: ").concat(solnCoins.nickels, ", P: ").concat(solnCoins.pennies, "]");
    setFeedback(ProbMark.INCORRECT, feedback);
    // User forced to click 'Next'
    setButtons('Clear', true, 'Next');
    // btnLeft.innerText = 'Clear';
    // btnLeft.disabled = true;
    // btnRight.innerText = 'Next';
    // btnRight.disabled = false;
}
function testProblemCount() {
    return probCount < gameConfig.probMax;
}
function testRetryCount() {
    return tryCount < gameConfig.tryMax;
}
function fatalError(messge) {
    // TODO stop the program
    console.log(messge);
}
