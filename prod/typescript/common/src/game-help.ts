/*
  game-help.ts - game help logic. Animations here.
 */

// START HERE

// disable all inputs and buttons
txtQ.readOnly = true;
txtD.readOnly = true;
txtN.readOnly = true;
txtP.readOnly = true;
btnRight.addEventListener("click", checkButtonClick);
setGameInfo(); // set the innerHtml of txtDescription
txtDesc1 = document.getElementById("txtDesc1") as HTMLElement;
txtDesc2 = document.getElementById("txtDesc2") as HTMLElement;
var userCoins: Coins; // set in nextExample()
const animateDuration1: number = 1000; // Most animations are 1 second
const animateDuration2: number = 2000; // But some are 2 seconds

nextExample();  // starts animations

// Get a new example and do animations.
function nextExample() {
  probState = ProbState.NEXT;
  logProbState(probState);
  tryCount = 0;
  probCount++;
  const example: Example = currentGame.genExample();
  currentProblem = example.problem;
  // userCoins may give CORRECT or INCORRECT answer.
  userCoins = example.userCoins;
  txtAmount.innerHTML = `Amount ${currentProblem.amount}&cent;`;
  txtAmount.setAttribute('aria-valuenow', `${currentProblem.amount}`);
  maxValMap.set('txtMaxQ', currentProblem.maxCoins.getQ());
  maxValMap.set('txtMaxD', currentProblem.maxCoins.getD());
  maxValMap.set('txtMaxN', currentProblem.maxCoins.getN());
  maxValMap.set('txtMaxP', currentProblem.maxCoins.getP());
  setMaxValues();
  txtProbCount.innerHTML = `${probCount} of ${currentGame.exampleMax}`
  setFeedback(ProbMark.NONE, "");
  clearCoins();
  setButtons('Clear', true, 'Check');
  btnRight.blur();
  showProblem();
  doAnimations();
}

// Check the result of canned example problem.
function checkButtonClick(): void {
  const text: string = btnRight.innerText;
  if (text === 'Check') {
    markExample();
  } else if (text === 'Next') {
    nextExample()
    // } else if (text === 'Retry') {
    //   setButtons('Clear', false, 'Check');
    //   setFeedback(ProbMark.NONE, "");
    //   showProblem()
  } else if (text === 'Help Over') {
    // Transition to home screen here.
    location.href = "index.html";
  } else {
    fatalError(`rightButtonClick: invalid button value: ${text}`);
  }
}
// Simplified version of markProblem (see game-play.ts)
function markExample(): void {
  probState = ProbState.MARK;
  logProbState(probState);
  const userCoins: Coins = getCoinValues();
  const probFeedback: ProbFeedback = currentGame.markProblem(userCoins, false);
  if (probFeedback.mark === ProbMark.CORRECT) {
    probState = ProbState.CORRECT;
    logProbState(probState);
    // CORRECT
    correctCount++;
    setFeedback(ProbMark.CORRECT, probFeedback.feedback);
    if (testExampleCount()) {
      // Help not done.
      setButtons('Clear', true, 'Next');
    } else {
      // Help is over.
      setButtons('Clear', true, 'Help Over');
    }
  } else {
    // INCORRECT
    probState = ProbState.INCORRECT;
    logProbState(probState);
    let feedback: string = probFeedback.feedback;
    setFeedback(ProbMark.INCORRECT, feedback);
    // No user retries - move to the next example
    if (testExampleCount()) {
      setButtons('Clear', true, 'Next');
    } else {
      setButtons('Clear', true, 'Help Over');
    }
  }
}
// Game over if user reached problem count.
function testExampleCount(): boolean {
  return probCount < currentGame.exampleMax;
}

/*
 animateTextFields - animate (scale) multiple text fields simultaneously.
 Parameters:
 HTMLElement array.
 Return:
 Promise array.
*/
function animateTextFields(eles: HTMLElement[]): Promise<any>[] {
  var animated: Promise<any>[] = [];
  for (const ele of eles) {
    const ani = ele.animate(
      [{ transform: "scale(1.0)" },
      { transform: "scale(1.5)" },
      { transform: "scale(1.0)" },
      ],
      animateDuration2
    );
    animated.push(ani.finished);
  }
  return animated;
}
/*
 animation0 - animate the first part of the instructions.
 WATCH ME PLAY...
 Return:
 Promise array.
*/
function animation0(): Promise<any>[] {
  return animateTextFields([txtTitle]);
}
/*
 animation1 - animate the first part of the instructions.
 You have a LARGE NUMBER of...
 Return:
 Promise array.
*/
function animation1(): Promise<any>[] {
  //  console.log("txtDesc1 reference animated");
  return animateTextFields([txtDesc1, txtNoOfCoins, txtMaxQ, txtMaxD, txtMaxN, txtMaxP]);
}
/*
 animation2 - animate the second part of the instructions.
 Make change for the AMOUNT...
 Return:
 Promise array.
*/
function animation2(): Promise<any>[] {
  return animateTextFields([txtDesc2, txtAmount]);
  //  return animateTextFields([txtAmount]);
}
/*
 displayHand - Make the hand cursor visible, pointing
 at the center of the element parameter. Set focus on the element.
 Parameters:
 ele - element to point to, gain focus.
*/
function displayHand(ele: HTMLElement): void {
  //  console.log("displayHand called")
  const rect = ele.getBoundingClientRect();
  var left: number = rect.left;
  var right: number = rect.right;
  var top: number = rect.top;
  var bottom: number = rect.bottom;
  var handWidth: number = imgHand.clientWidth;
  var midX: number = Math.floor((right - (left + handWidth)) / 2);
  var midY: number = Math.floor((bottom - top) / 2);
  imgHand.style.position = "absolute"; // Must be "absolute"
  imgHand.style.left = `${rect.left + midX}px`; // left;
  imgHand.style.top = `${rect.top + midY}px`; // top;
  imgHand.style.visibility = "visible";
  ele.focus();
}
/*
 undisplayHand - Hide the hand cursor. Remove focus from the element.
 Parameters:
 ele - element to lose focus.
*/
function undisplayHand(ele: HTMLElement) {
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
function animateHandDisplay(ele: HTMLElement): Promise<any> {
  displayHand(ele);
  const ani1: Animation = imgHand.animate([
    // { content-visibility: "visible" }, // attribute not accepted (?)
    // { content-visibility: "hidden" },  // attribute not accepted (?)
    // { opacity: 1 },
    // { opacity: 0 },
  ],
    animateDuration1
  );
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
function animateCoinEntry(ele: HTMLInputElement, val: number): Promise<any> {
  //  console.log("animateCoinEntry called");
  undisplayHand(ele);
  // give focus and set value.
  ele.value = val.toString();
  const ani1: Animation = ele.animate([
    { transform: "scale(1.0)" },
    { transform: "scale(1.5)" },
    { transform: "scale(1.0)" },
  ],
    animateDuration1
  );
  return ani1.finished;
}
/*
 animationCoinsEntry - Animate the entry of the coins in all of the
 coin input fields (txtQ, txtD, txtN, txtP).
*/
async function animationCoinsEntry(): Promise<any> {
  //  console.log("animationCoinsEntry called");
  const coinsArray: number[] = [userCoins.getQ(), userCoins.getD(), userCoins.getN(), userCoins.getP()];
  const txtCoins: HTMLInputElement[] = [txtQ, txtD, txtN, txtP];
  if (currentGameType === GameType.MAX_COINS) {
    // Must solve right to left for MAX-COINS game.
    coinsArray.reverse();
    txtCoins.reverse();
  }
  const len: number = txtCoins.length;
  var index: number = 0;
  for (const txtCoin of txtCoins) {
    var val: number = coinsArray[index++];
    await animateHandDisplay(txtCoin).then(() =>
      animateCoinEntry(txtCoin, val).then(() => { /* console.log("animation coin over") */ }));
  }
  // just to continue chaining
  return new Promise((resolve) => {
    resolve(true);
  });
}
/*
 animateCheckClick - animate the click on the Check button.
 Eventually this will trigger the check on the user coins.
*/
async function animateCheckClick(): Promise<any> {
  //  console.log("animationCheckClick called");
  await animateHandDisplay(btnRight).then(() => {
    undisplayHand(btnRight);
  });
  // just to continue chaining
  return new Promise((resolve) => {
    resolve(true);
  });
}
/*
 doAnimiations - Do the entire animation sequence using
 promises to sequence through them.
*/
function doAnimations(): void {
  // Now simulate a game thru animation.
  Promise.all(animation0()).then(() =>
    Promise.all(animation1()).then(() =>
      Promise.all(animation2()).then(() =>
        animationCoinsEntry().then(() =>
          animateCheckClick().then(() => {
            checkButtonClick(); // => markExample
          })))));
}
