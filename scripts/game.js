
let deck = [];
let currentCard = null;
let flippedThisTurn = 0;

let scores = {
  player: 0,
  bot1: 0,
  bot2: 0,
};

function createDeck() {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const values = Array.from({ length: 13 }, (_, i) => i + 2); // 2 to 14 (Ace)
  let newDeck = [];

  for (let suit of suits) {
    for (let value of values) {
      newDeck.push({ suit, value });
    }
  }

  return newDeck.sort(() => Math.random() - 0.5); // shuffle
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

function showDrinkAnimation(seconds) {
  const beer = document.getElementById("beer-animation");
  beer.textContent = `🍺 Drinking for ${seconds} seconds...`;
  beer.classList.remove("hidden");
  setTimeout(() => {
    beer.classList.add("hidden");
  }, seconds * 1000);
}

function drawCard() {
  if (deck.length === 0) deck = createDeck();
  return deck.pop();
}

function handleGuess(guess) {
  const nextCard = drawCard();
  let correct = false;

  switch (guess) {
    case "higher":
      correct = nextCard.value > currentCard.value;
      break;
    case "lower":
      correct = nextCard.value < currentCard.value;
      break;
    case "red":
      correct = ["hearts", "diamonds"].includes(nextCard.suit);
      break;
    case "black":
      correct = ["clubs", "spades"].includes(nextCard.suit);
      break;
    case "purple":
      const card2 = drawCard();
      correct = (["hearts", "diamonds"].includes(nextCard.suit) !== ["hearts", "diamonds"].includes(card2.suit));
      break;
  }

  currentCard = nextCard;
  showCard(currentCard);
  flippedThisTurn++;

  if (!correct) {
    scores.player += flippedThisTurn;
    updateScores();
    showDrinkAnimation(flippedThisTurn);
    flippedThisTurn = 0;
    setTimeout(startNewRound, 3000);
  }
}

function startNewRound() {
  deck = createDeck();
  currentCard = drawCard();
  flippedThisTurn = 0;
  showCard(currentCard);
  document.getElementById("status-message").textContent = "Your turn!";
}

document.querySelectorAll(".guess-buttons button").forEach((btn) => {
  btn.addEventListener("click", () => handleGuess(btn.dataset.guess));
});

window.onload = () => {
  startNewRound();
  updateScores();
};
