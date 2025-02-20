"use strict";
/*
  game-help.ts - game help logic.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// START HERE
// disable all inputs and buttons
txtQ.readOnly = true;
txtD.readOnly = true;
txtN.readOnly = true;
txtP.readOnly = true;
btnRight.addEventListener("click", checkButtonClick);
setGameInfo(); // set the innerHtml of txtDescription
txtDesc1 = document.getElementById("txtDesc1");
console.log("txtDesc1 reference assigned.");
txtDesc1.style.willChange = "auto";
txtDesc2 = document.getElementById("txtDesc2");
txtDesc2.style.willChange = "auto";
var userCoins; // set in nextExample()
var animateDuration1 = 1000; // Most animations are 1 second
var animateDuration2 = 2000; // But some are 2 seconds
nextExample(); // starts animations
function doAnimations() {
    // Now simulate a game thru animation.
    Promise.all(animation1()).then(function () {
        return Promise.all(animation2()).then(function () {
            return animationCoinsEntry().then(function () {
                return animateCheckClick().then(function () {
                    checkButtonClick(); // => markExample
                });
            });
        });
    });
}
// Get a new example.
function nextExample() {
    probState = ProbState.NEXT;
    logProbState(probState);
    tryCount = 0;
    probCount++;
    var example = currentGame.genExample();
    currentProblem = example.problem;
    // userCoins may give CORRECT or INCORRECT answer.
    userCoins = example.userCoins;
    txtAmount.innerHTML = "Amount ".concat(currentProblem.amount, "&cent;");
    txtAmount.setAttribute('aria-valuenow', "".concat(currentProblem.amount));
    maxValMap.set('txtMaxQ', currentProblem.maxCoins.getQ());
    maxValMap.set('txtMaxD', currentProblem.maxCoins.getD());
    maxValMap.set('txtMaxN', currentProblem.maxCoins.getN());
    maxValMap.set('txtMaxP', currentProblem.maxCoins.getP());
    setMaxValues();
    txtProbCount.innerHTML = "".concat(probCount, " of ").concat(currentGame.exampleMax);
    setFeedback(ProbMark.NONE, "");
    clearCoins();
    setButtons('Clear', false, 'Check');
    btnRight.blur();
    showProblem();
    doAnimations();
}
// function setCoinValues(coins: Coins) {
//   txtQ.value = coins.getQ().toString();
//   txtD.value = coins.getD().toString();
//   txtN.value = coins.getN().toString();
//   txtP.value = coins.getP().toString();
// }
function checkButtonClick() {
    var text = btnRight.innerText;
    if (text === 'Check') {
        markExample();
    }
    else if (text === 'Next') {
        nextExample();
        // } else if (text === 'Retry') {
        //   setButtons('Clear', false, 'Check');
        //   setFeedback(ProbMark.NONE, "");
        //   showProblem()
    }
    else if (text === 'Help Over') {
        // Transition to home screen here.
        location.href = "index.html";
    }
    else {
        fatalError("rightButtonClick: invalid button value: ".concat(text));
    }
}
// simplified version of markProblem (see game-play.ts)
function markExample() {
    probState = ProbState.MARK;
    logProbState(probState);
    var userCoins = getCoinValues();
    var probFeedback = currentGame.markProblem(userCoins, false);
    if (probFeedback.mark === ProbMark.CORRECT) {
        probState = ProbState.CORRECT;
        logProbState(probState);
        // CORRECT
        correctCount++;
        setFeedback(ProbMark.CORRECT, probFeedback.feedback);
        if (testExampleCount()) {
            // Help not done.
            setButtons('Clear', true, 'Next');
        }
        else {
            // Help is over.
            setButtons('Clear', true, 'Help Over');
        }
    }
    else {
        // INCORRECT
        probState = ProbState.INCORRECT;
        logProbState(probState);
        var feedback = probFeedback.feedback;
        setFeedback(ProbMark.INCORRECT, feedback);
        // No user retries - move to the next example
        if (testExampleCount()) {
            setButtons('Clear', true, 'Next');
        }
        else {
            setButtons('Clear', true, 'Help Over');
        }
    }
}
// Game over if user reached problem count.
function testExampleCount() {
    return probCount < currentGame.exampleMax;
}
/*
 animateTextFields - animate (scale) multiple text fields simultaneously.
 Parameters:
 HTMLElement array.
 Return:
 Promise array.
*/
function animateTextFields(eles) {
    var animated = [];
    for (var _i = 0, eles_1 = eles; _i < eles_1.length; _i++) {
        var ele = eles_1[_i];
        var ani = ele.animate([{ transform: "scale(1.0)" },
            { transform: "scale(1.5)" },
            { transform: "scale(1.0)" },
        ], animateDuration2);
        animated.push(ani.finished);
    }
    return animated;
}
/*
 animation1 - animate the first part of the instructions.
 You have a LARGE NUMBER of...
 Return:
 Promise array.
*/
function animation1() {
    console.log("txtDesc1 reference animated");
    return animateTextFields([txtDesc1, txtNoOfCoins, txtMaxQ, txtMaxD, txtMaxN, txtMaxP]);
}
/*
 animation2 - animate the second part of the instructions.
 Make change for the AMOUNT...
 Return:
 Promise array.
*/
function animation2() {
    return animateTextFields([txtDesc2, txtAmount]);
    //  return animateTextFields([txtAmount]);
}
/*
 displayHand - Make the hand cursor visible, pointing
 at the center of the element parameter. Set focus on the element.
 Parameters:
 ele - element to point to, gain focus.
*/
function displayHand(ele) {
    //  console.log("displayHand called")
    var rect = ele.getBoundingClientRect();
    var left = rect.left;
    var right = rect.right;
    var top = rect.top;
    var bottom = rect.bottom;
    var handWidth = imgHand.clientWidth;
    var midX = Math.floor((right - (left + handWidth)) / 2);
    var midY = Math.floor((bottom - top) / 2);
    imgHand.style.position = "absolute"; // Must be "absolute"
    imgHand.style.left = "".concat(rect.left + midX, "px"); // left;
    imgHand.style.top = "".concat(rect.top + midY, "px"); // top;
    imgHand.style.visibility = "visible";
    ele.focus();
}
/*
 undisplayHand - Hide the hand cursor. Remove focus from the element.
 Parameters:
 ele - element to lose focus.
*/
function undisplayHand(ele) {
    //  console.log("undisplayHand called")
    //  const imgHand: (HTMLImageElement | any) = document.getElementById("imgHand");
    imgHand.style.visibility = "hidden";
    //ele.blur();
}
/*
 animateHandDisplay - Display the hand cursor for a period of time
 using a Promise object.
 Parameters:
 ele - element to point to.
 Return
 Promise for further animation.
*/
function animateHandDisplay(ele) {
    displayHand(ele);
    var ani1 = imgHand.animate([
    // { content-visibility: "visible" }, // attribute not accepted (?)
    // { content-visibility: "hidden" },  // attribute not accepted (?)
    // { opacity: 1 },
    // { opacity: 0 },
    ], animateDuration1);
    return ani1.finished;
}
/*
 animateCoinEntry - Animate the data entry of a coin value into one of
 the coin input fields on the screen.
 Parameters:
 ele - one of txtQ, txtD, txtN, txtP
 val - number to enter into ele.
 return Promise for further animation.
*/
function animateCoinEntry(ele, val) {
    //  console.log("animateCoinEntry called");
    undisplayHand(ele);
    // give focus and set value.
    ele.value = val.toString();
    var ani1 = ele.animate([
        { transform: "scale(1.0)" },
        { transform: "scale(1.5)" },
        { transform: "scale(1.0)" },
    ], animateDuration1);
    return ani1.finished;
}
/*
 animationCoinsEntry - Animate the entry of the coins in all of the
 coin input fields (txtQ, txtD, txtN, txtP).
*/
function animationCoinsEntry() {
    return __awaiter(this, void 0, void 0, function () {
        var coinsArray, txtCoins, len, index, _loop_1, val, _i, txtCoins_1, txtCoin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    coinsArray = [userCoins.getQ(), userCoins.getD(), userCoins.getN(), userCoins.getP()];
                    txtCoins = [txtQ, txtD, txtN, txtP];
                    if (currentGameType === GameType.MAX_COINS) {
                        // Must solve right to left for MAX-COINS game.
                        coinsArray.reverse();
                        txtCoins.reverse();
                    }
                    len = txtCoins.length;
                    index = 0;
                    _loop_1 = function (txtCoin) {
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    val = coinsArray[index++];
                                    return [4 /*yield*/, animateHandDisplay(txtCoin).then(function () {
                                            return animateCoinEntry(txtCoin, val).then(function () { console.log("animation coin over"); });
                                        })];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, txtCoins_1 = txtCoins;
                    _a.label = 1;
                case 1:
                    if (!(_i < txtCoins_1.length)) return [3 /*break*/, 4];
                    txtCoin = txtCoins_1[_i];
                    return [5 /*yield**/, _loop_1(txtCoin)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: 
                // just to continue chaining
                return [2 /*return*/, new Promise(function (resolve) {
                        resolve(true);
                    })];
            }
        });
    });
}
/*
 animateCheckClick - animate the click on the Check button.
 Eventually this will trigger the check on the user coins.
*/
function animateCheckClick() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                //  console.log("animationCheckClick called");
                return [4 /*yield*/, animateHandDisplay(btnRight).then(function () {
                        undisplayHand(btnRight);
                    })];
                case 1:
                    //  console.log("animationCheckClick called");
                    _a.sent();
                    // just to continue chaining
                    return [2 /*return*/, new Promise(function (resolve) {
                            resolve(true);
                        })];
            }
        });
    });
}
