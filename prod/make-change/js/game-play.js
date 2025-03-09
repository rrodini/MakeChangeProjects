"use strict";
/*
 game-play.ts - game play logic.
 */
// START HERE
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
setGameInfo();
nextProblem();
// An input coin value has changed. Give feedback if new
// value is invalid. 
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
        this.setAttribute('aria-invalid', 'true');
        // can't click Check
        btnRight.disabled = true;
    }
    else {
        // change border back, just in case.
        this.classList.remove('border-danger');
        this.setAttribute('aria-invalid', 'false');
        this.setAttribute('aria-valuenow', valStr);
        // can click Check
        btnRight.disabled = false;
    }
}
// Left button click handler. Use current state to determine what to do.
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
// Right button click handler. Use current state to determine what to do.
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
        setButtons('Clear', false, 'Check', false);
        setFeedback(ProbMark.NONE, "");
        showProblem();
    }
    else if (text === 'Game Over') {
        // Transition to score screen here.
        var params = "?game=".concat(gameParamGameType, "&correct=").concat(correctCount, "&total=").concat(probCount);
        location.href = "score.html" + params;
    }
    else {
        fatalError("rightButtonClick: invalid button value: ".concat(text));
    }
}
// Get a new problem.
function nextProblem() {
    probState = ProbState.NEXT;
    logProbState(probState);
    tryCount = 0;
    probCount++;
    currentProblem = currentGame.genProblem();
    txtAmount.innerHTML = "Amount ".concat(currentProblem.amount, "&cent;");
    txtAmount.setAttribute('aria-valuenow', "".concat(currentProblem.amount));
    maxValMap.set('txtMaxQ', currentProblem.maxCoins.getQ());
    maxValMap.set('txtMaxD', currentProblem.maxCoins.getD());
    maxValMap.set('txtMaxN', currentProblem.maxCoins.getN());
    maxValMap.set('txtMaxP', currentProblem.maxCoins.getP());
    setMaxValues();
    txtProbCount.innerHTML = "".concat(probCount, " of ").concat(currentGame.probMax);
    setFeedback(ProbMark.NONE, "");
    clearCoins();
    setFocusQ();
    setButtons('Clear', false, 'Check', false);
    showProblem();
}
// Give user chance to retry the same problem.
function retryProblem() {
    setButtons('Solution', false, 'Retry', false);
    setFocusQ();
    tryCount++;
    showProblem();
}
// User clicked "Check" so mark the problem.
function markProblem() {
    probState = ProbState.MARK;
    logProbState(probState);
    var userCoins = getCoinValues();
    var probFeedback = currentGame.markProblem(userCoins, true);
    if (probFeedback.mark === ProbMark.CORRECT) {
        probState = ProbState.CORRECT;
        logProbState(probState);
        // CORRECT
        correctCount++;
        setFeedback(ProbMark.CORRECT, probFeedback.feedback);
        if (testProblemCount()) {
            // Game not done.
            setButtons('Clear', true, 'Next', false);
        }
        else {
            // Game is over.
            setButtons('Clear', true, 'Game Over', false);
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
            setButtons('Clear', true, 'Next', false);
            if (testProblemCount()) {
                setButtons('Clear', true, 'Next', false);
            }
            else {
                setButtons('Clear', true, 'Game Over', false);
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
    // User forced to click 'Next' or maybe 'Game Over'
    if (testProblemCount()) {
        setButtons('Clear', true, 'Next', false);
    }
    else {
        setButtons('Clear', true, 'Game Over', false);
    }
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
