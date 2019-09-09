/************** Set Variables For Game ***************/

const restartButton = document.querySelector('.restart');
const replayButton = document.querySelector('.replay-button');
const movesCounter = document.querySelector('.moves');
const winMoves = document.querySelector('.win-body .moves');
const modal = document.querySelector('.win');
const container = document.querySelector('.container');
const timerHours = document.querySelector('.timer .hours');
const timerMinutes = document.querySelector('.timer .minutes');
const timerSeconds = document.querySelector('.timer .seconds');
const winTimerHours = document.querySelector('.win-body .hours');
const winTimerMinutes = document.querySelector('.win-body .minutes');
const winTimerSeconds = document.querySelector('.win-body .seconds');
const secondStar = document.querySelector('#second-star');
const thirdStar = document.querySelector('#third-star');
const finalRating = document.querySelector('.final-rating');

// Get deck
const deck = document.querySelector('.deck');
// Get list of cards by calling children of deck class
const cards = Array.from(deck.children);
// List of card symbols
let cardSymbols = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
     'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-bomb',
     'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o',
     'fa-cube'];

// string of empty star symbol
const emptyStar = 'fa-star-o';

// string of full star symbol
const fullStar = 'fa-star';

// list of "opened" cards
let openCards = [];

// number of moves
let moves = 0;

// number of matches. Total is 8.
let matches = 0;

// game status
let gameOn = false;

// time elapsed since start of game
let elapsedSeconds = 0;
let sec = 0;
let min = 0;
let hour = 0;

// set star rating to 3
let starRating = 3;

/*************** Functions ***************/

/**
* @description Resets board
*/
function resetBoard() {
  // set list of "opened" cards to empty
  openCards = [];

  // shuffle list of card symbols
  cardSymbols = shuffle(cardSymbols);

  // list of classes to remove
  const cls = ['open', 'match', 'show'];

  // iterate over each card to return to "closed" state and add new symbol
  cards.forEach((card, index) => {
    // remove classes
    card.classList.remove(...cls);
    /*
    * NOTE that first element of card.children is "fa"
    * and second element is symbol. Remove symbol class.
    */
    card.children[0].classList.remove(card.children[0].classList[1]);
    // attach new symbol to card
    const symbol = cardSymbols[index];
    card.children[0].classList.add(symbol);
  });
}

/**
* @description Shuffle function from http://stackoverflow.com/a/2450976
* @param {array} array
* @returns {array} array
*/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/**
* @description Shows card that user clicked on and checks for matches
* @param {event} event
*/
function openCard(event) {
  // start timer if not already started
  startTimer();

  // get target of event
  let targetCard = event.target;

  // if target is not in openCards and has "card" class
  if (!openCards.includes(targetCard) && targetCard.classList.contains('card')) {
    // show card
    targetCard.classList.add('open', 'show');
    // check if card is already a match
    if (!targetCard.classList.contains('match')) {
      // if card is not part of match pair, add card to openCards
      openCards.push(targetCard);
    }
  }

  if (openCards.length === 2) {
    // check for match
    checkMatch();
  }
}

/**
* @description Closes card by removing classes "open" and "show". Also removes
* "not-match" class
* @param {DOM element} card
* @returns {DOM element} card
*/
function closeCard(card) {
  // remove classes "open" and "show" and "not-match" from card
  card.classList.remove('open','show','not-match');
  return card;
}

/**
* @description Add "match" class if two cards match
* @param {DOM element} card
* @returns {DOM element} card
*/
function matchCard(card) {
  // add class "match" to card
  card.classList.add('match');
  return card;
}

/**
* @description Add "not-match" class if two cards don't match
* @param {DOM element} card
* @returns {DOM element} card
*/
function notmatchCard(card) {
  // add class "unmatch" to card
  card.classList.add('not-match');
  return card;
}

/**
* @description Checks if two cards are a match, makes changes to score panel,
* and tracks number of matches
*/
function checkMatch() {
  // set first and second card of pair
  let firstCard = openCards[0];
  let secondCard = openCards[1];
  /*
  * Compare the first and last card in openCards and
  * check if they match. If they don't match, "close" cards.
  */
  if (firstCard.children[0].classList.toString() ===
      secondCard.children[0].classList.toString()) {
        // increment number of matches
        addMatch();
        // set cards to match
        matchCard(firstCard);
        matchCard(secondCard);
  } else {
    // show not-match animation
    firstCard = notmatchCard(firstCard);
    secondCard = notmatchCard(secondCard);
    // close cards with delay of 1 second
    setTimeout(function() {
      closeCard(firstCard);
      closeCard(secondCard);
    }, 1000);
  }

  // increment number of moves
  addMove();
  // determine star rating
  setRating(moves);
  // set openCards to empty
  openCards = [];
  // check if player matched all 8 pairs
  isWin(matches);
}

/**
* @description Increments number of matches
*/
function addMatch() {
  matches++;
}

/*
* @description Increments number of moves and updates HTML element
*/
function addMove() {
   moves++;
   // update number of moves in html
   movesCounter.textContent = moves;
}

/**
* @description Check if player has all matched pairs and end game
* @param {number} matches
*/
function isWin(matches) {
  //total number of matched pairs possible in game is 8
  if (matches === 8) {
    // stop timer
    stopTimer();
    // open modal
    openModal();
  }
}

/**
* @description Set star rating based on number of moves
* @param {number} moves
*/
function setRating(moves) {
  if (moves > 15 && moves <= 31) {
    thirdStar.children[0].classList.remove(thirdStar.children[0].classList[1]);
    thirdStar.children[0].classList.add(emptyStar);
    starRating = 2;
  } else if (moves > 31) {
    secondStar.children[0].classList.remove(secondStar.children[0].classList[1]);
    secondStar.children[0].classList.add(emptyStar);
    starRating = 1;
  }
}

/**
* @description Resets score panel
*/
function resetScorePanel() {
  // reset moves and update HTML element
  moves = 0;
  movesCounter.textContent = moves;

  // reset matches
  matches = 0;

  // reset stars
  secondStar.children[0].classList.remove(secondStar.children[0].classList[1]);
  secondStar.children[0].classList.add(fullStar);
  thirdStar.children[0].classList.remove(thirdStar.children[0].classList[1]);
  thirdStar.children[0].classList.add(fullStar);
}

/**
* @description restart/play game
*/
function startGame() {
  // close win modal if open
  closeModal();
  // reset deck
  resetBoard();
  // reset score panel
  resetScorePanel();
  // reset timer
  resetTimer();
}

/**
* @description start timer
*/
function startTimer() {
  if (!gameOn) {
    // set to true when game is started
    gameOn = true;
    // set timer
    timer = setInterval(gameTimer, 1000);
  }
}

/**
* @description Stop timer
*/
function stopTimer() {
    // set to false when game has finished
    gameOn = false;
    // clear timer
    clearInterval(timer);
}

/**
* @description Format timer based on elapsedSeconds
*/
function gameTimer() {
  // increment elapsedSeconds
  elapsedSeconds++;
  // get minutes
  min = pad(Math.floor(elapsedSeconds/60));
  // update HTML element for minutes
  timerMinutes.textContent = min;
  // get seconds
  sec = pad(elapsedSeconds%60);
  // update HTML element for seconds
  timerSeconds.textContent = sec;
  // get hour
  hour = pad(Math.floor(min/60));
  // update HTML element for hours
  timerHours.textContent = hour;
}

/**
* @description Pad timer elements with 0
* @param {number} n
*/
function pad(n) {
  // add prefix 0 to number if less than 10
  return (n < 10 ? '0' : '') + n;
}

/**
* @description Reset timer
*/
function resetTimer() {
  if (gameOn) {
    // stop time
    stopTimer();
  }
  // reset variables to 0
  elapsedSeconds = 0;
  timerSeconds.textContent = '00';
  timerMinutes.textContent = '00';
  timerHours.textContent = '00';
}

/**
* @description open win modal when game is won
*/
function openModal() {
  // set final moves in HTML
  winMoves.textContent = moves;
  // set final time in HTML
  winTimerMinutes.textContent = min;
  winTimerSeconds.textContent = sec;
  winTimerHours.textContent = hour;
  // set final star rating in HTML
  finalRating.textContent = starRating;
  // hide game
  container.style.display = 'none';
  // show win modal
  modal.style.display ='block';
}

/**
* @description close win modal during play
*/
function closeModal() {
  // hide win modal
  modal.style.display = 'none';
  // show game
  container.style.display = 'flex';
}

/*************** Event Listeners ***************/

// Click attached to cards in deck, will open card
deck.addEventListener('click', openCard);

//Click attached to restart button, will restart game
restartButton.addEventListener('click', startGame);

//Click attached to replay button, will restart game
replayButton.addEventListener('click', startGame);

/*********** Run Game ***************/
startGame();
