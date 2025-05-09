let deck = [];
let currentCard = null;
let flippedThisTurn = 0;

let scores = {
  player: 0,
  bot1: 0,
  bot2: 0,
};

const players = ["player", "bot1", "bot2"];
let currentPlayerIndex = 0;

function createDeck() {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const values = Array.from({ length: 13 }, (_, i) => i + 2);
  let newDeck = [];

  for (let suit of suits) {
    for (let value of values) {
      newDeck.push({ suit, value });
    }
  }

  return newDeck.sort(() => Math.random() - 0.5);
}

function getCardSymbol(card) {
  const symbols = {
    "hearts": "♥",
    "diamonds": "♦",
    "clubs": "♣",
    "spades": "♠",
  };
  return `${card.value}${symbols[card.suit]}`;
}

function showCard(card) {
  document.getElementById("current-card").textContent = getCardSymbol(card);
}

function updateScores() {
  document.getElementById("player-score").textContent = scores.player;
  document.getElementById("bot1-score").textContent = scores.bot1;
  document.getElementById("bot2-score").textContent = scores.bot2;
}

function showDrinkAnimation(seconds, player) {
  const beer = document.getElementById("beer-animation");
  beer.textContent = `🍺 ${player} drinks for ${seconds} seconds...`;
  beer.classList.remove("hidden");
  setTimeout(() => {
    beer.classList.add("hidden");
  }, seconds * 1000);
}

function drawCard() {
  if (deck.length === 0) deck = createDeck();
  return deck.pop();
}

function isRed(card) {
  return ["hearts", "diamonds"].includes(card.suit);
}

function isBlack(card) {
  return ["clubs", "spades"].includes(card.suit);
}

function botGuess() {
  const safeGuesses = [];

  if (deck.length === 0) return "red"; // Fallback

  const nextCard = deck[deck.length - 1];
  if (nextCard.value > currentCard.value) safeGuesses.push("higher");
  if (nextCard.value < currentCard.value) safeGuesses.push("lower");
  if (isRed(nextCard)) safeGuesses.push("red");
  if (isBlack(nextCard)) safeGuesses.push("black");

  // Occasionally take a risk
  if (safeGuesses.length === 0 || Math.random() < 0.2) safeGuesses.push("purple");

  return safeGuesses[Math.floor(Math.random() * safeGuesses.length)];
}

function handleGuess(guess, player) {
  let nextCard = drawCard();
  let correct = false;

  if (guess === "purple") {
    const card2 = drawCard();
    correct = isRed(nextCard) !== isRed(card2);
    currentCard = card2;
  } else {
    if (guess === "higher") correct = nextCard.value > currentCard.value;
    if (guess === "lower") correct = nextCard.value < currentCard.value;
    if (guess === "red") correct = isRed(nextCard);
    if (guess === "black") correct = isBlack(nextCard);
    currentCard = nextCard;
  }

  showCard(currentCard);
  flippedThisTurn++;

  if (!correct) {
    scores[player] += flippedThisTurn;
    updateScores();
    showDrinkAnimation(flippedThisTurn, player);
    flippedThisTurn = 0;
    currentPlayerIndex = players.indexOf(player);
    setTimeout(startNewRound, 3000);
  } else {
    if (flippedThisTurn >= 3 && player !== "player") {
      // Bot may choose to pass
      if (Math.random() < 0.5) {
        nextTurn();
        return;
      }
    }
    setTimeout(() => nextTurn(), 1000);
  }
}

function startNewRound() {
  deck = createDeck();
  currentCard = drawCard();
  showCard(currentCard);
  flippedThisTurn = 0;

  document.getElementById("status-message").textContent = `${players[currentPlayerIndex]}'s turn`;

  if (players[currentPlayerIndex] !== "player") {
    setTimeout(() => botPlay(), 1000);
  }
}

function nextTurn() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  document.getElementById("status-message").textContent = `${players[currentPlayerIndex]}'s turn`;

  if (players[currentPlayerIndex] === "player") {
    // Wait for user input
  } else {
    setTimeout(() => botPlay(), 1000);
  }
}

function botPlay() {
  const guess = botGuess();
  handleGuess(guess, players[currentPlayerIndex]);
}

document.querySelectorAll(".guess-buttons button").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (players[currentPlayerIndex] === "player") {
      handleGuess(btn.dataset.guess, "player");
    }
  });
});

window.onload = () => {
  deck = createDeck();
  currentCard = drawCard();
  showCard(currentCard);
  updateScores();
  document.getElementById("status-message").textContent = `${players[currentPlayerIndex]}'s turn`;
};
