/************** Set Variables For Game ***************/

const restartButton = document.querySelector('.restart');
const movesCounter = document.querySelector('.moves');
const modal = document.querySelector('.modal');
const timerHours = document.querySelector('#timer .hours');
const timerMins = document.querySelector('#timer .minutes');
const timerSeconds = document.querySelector('#timer .seconds');

// Get deck
const deck = document.querySelector('.deck');
// Get list of cards by calling children of deck class
const cards = Array.from(deck.children);
// List of card symbols
let cardSymbols = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
     'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-bomb',
     'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o',
     'fa-cube'];

// list of "opened" cards
let openCards = [];

// number of moves
let moves = 0;

// number of matches. Total is 8.
let matches = 0;

// game status
let gameOn = false;

// time elapsed since start of game
let totalSeconds = 0;
let sec = 0;
let min = 0;
let hour = 0;

/*************** Functions ***************/

// Reset deck function
function resetDeck() {

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

// Shuffle function from http://stackoverflow.com/a/2450976
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

// Open card function
function openCard(event) {

  // start timer
  startTimer();

  // get target of event
  let target = event.target;


  // if target is not in openCards
  if (!openCards.includes(target)) {
    // show card
    target.classList.add('open', 'show');
    // check if card is already a match
    if (!target.classList.contains('match')) {
      // if card is not part of match pair, add card to openCards
      openCards.push(target);
    }
  }

  if (openCards.length === 2) {
    // check for match
    isMatch();
  }


}

// Close card function
function closeCard(card) {
  // remove classes "open" and "show" and "unmatch" from card
  card.classList.remove('open','show','unmatch');
}

// Add match class function
function matchCard(card) {
  // add class "match" to card
  card.classList.add('match');
}

// Add not match function
function notMatch(card) {
  // add class "unmatch" to card
  card.classList.add('unmatch');
  return card;
}

// Match card function
function isMatch() {

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
    // show unmatch animation
    firstCard = notMatch(firstCard);
    secondCard = notMatch(secondCard);
    // close cards with delay
    setTimeout(function() {
      closeCard(firstCard);
      closeCard(secondCard);
    }, 1000);
  }

  // increment number of moves
  addMove();
  // set openCards to empty
  openCards = [];
  // check if player matched all 8 pairs
  isWin();
}

// increment number of matches
function addMatch() {
  matches++;
}

// increment number of moves
function addMove() {
   moves++;
   // update number of moves in html
   movesCount.textContent = moves;
}

// check if player has all matched pairs and end game
function isWin() {
  if (matches === 8) {
    // stop timer
    stopTimer();
    // open modal
    openModal();
  }
}

// reset scores funciton
function resetScorePanel() {

  // reset moves
  moves = 0;
  movesCounter.textContent = moves;

  // reset matches
  matches = 0;

  // reset time

  // reset rating
  rating = 3;
  //stars.forEach(star )

  // stop timer
  stopTimer();

}
// restart/play game function
function restartGame() {
  // reset deck
  resetDeck();
  // reset score panel
  resetScorePanel();
}

// start timer function
function startTimer() {
  if (!gameOn) {
    // set to true when game is started
    gameOn = true;
    // set timer
    timer = setInterval(gameTimer, 1000);
  }
}

// stop timer function
function stopTimer() {
    // set to false when game has finished
    gameOn = false;
    // clear timer
    clearInterval(timer);
}

// game timer function
function gameTimer() {
  totalSeconds++;
  min = pad(Math.floor(totalSeconds/60));
  console.log(min);
  timerMins.textContent = min;
  sec = pad(totalSeconds%60);
  timerSeconds.textContent = sec;
  hour = pad(Math.floor(min/60));
  timerHours.textContent = hour;
}

// pad number function
function pad(n) {
  // add 0 to number if less than 10
  return (n < 10 ? '0' : '') + n;
}

// close modal pop-up function
function closeModal() {
    modal.style.display = 'none';
}

/*************** Event Listeners ***************/

// Click attached to cards in deck, will open card
deck.addEventListener('click', openCard);

//Click attached to restart button, will restart game
restartButton.addEventListener('click', restartGame);

/*********** Run Game ***************/
restartGame();
