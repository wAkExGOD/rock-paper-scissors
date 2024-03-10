const userItemsContainer = document.querySelector(".left .items");
const computerItemsContainer = document.querySelector(".right .items");
const userItems = document.querySelectorAll(".left .item");
const computerItems = document.querySelectorAll(".right .item");
const userScore = document.querySelector(".score.left");
const computerScore = document.querySelector(".score.right");
const roundStatus = document.querySelector(".roundStatus");
const resultContainer = document.querySelector(".result");
const playAgainButton = document.querySelector(".play");
const loadingIndicator = document.querySelector(".loading");

const items = {
  ROCK: "rock",
  PAPER: "paper",
  SCISSORS: "scissors",
};

const winMap = {
  [items.ROCK]: items.SCISSORS,
  [items.PAPER]: items.ROCK,
  [items.SCISSORS]: items.PAPER,
};
const sidesMap = {
  USER: "user",
  COMPUTER: "computer",
  DRAW: "draw",
};

const score = {
  [sidesMap.USER]: 0,
  [sidesMap.COMPUTER]: 0,
};
const MAX_SCORE = 3;
let isRoundActive = true;

initGame();

userItemsContainer.addEventListener("click", (event) => {
  if (!isRoundActive) {
    return;
  }

  try {
    const userItem = event.target.dataset.item;
    const computerItem = Object.values(items)[Math.floor(Math.random() * 3)];

    setItems(userItem, computerItem);

    const roundWinner = getRoundWinner(userItem, computerItem);
    setRoundWinner(roundWinner);
    isRoundActive = false;

    setRoundLoading(false);
    setTimeout(() => {
      initItems();
      if (score[sidesMap.USER] > 2 || score[sidesMap.COMPUTER] > 2) {
        setGameWinner();
        setRoundLoading(false);
        userItemsContainer.classList.add("hidden");
        computerItemsContainer.classList.add("hidden");
      } else {
        isRoundActive = true;
        setRoundLoading();
      }
      roundStatus.classList.add("hidden");
    }, 1000);
  } catch (error) {
    console.error(error);
  }
});

playAgainButton.addEventListener("click", () => {
  initGame();
});

function initGame() {
  score[sidesMap.USER] = 0;
  score[sidesMap.COMPUTER] = 0;
  initItems();
  setRoundLoading();
  playAgainButton.classList.add("hidden");

  resultContainer.classList.remove("win");
  resultContainer.classList.remove("lose");
  resultContainer.classList.add("hidden");

  userItemsContainer.classList.remove("hidden");
  computerItemsContainer.classList.remove("hidden");

  userScore.textContent = `0 / ${MAX_SCORE}`;
  computerScore.textContent = `0 / ${MAX_SCORE}`;

  isRoundActive = true;
}

function getRoundWinner(userItem, computerItem) {
  if (winMap[userItem] === computerItem) {
    return sidesMap.USER;
  } else if (winMap[computerItem] === userItem) {
    return sidesMap.COMPUTER;
  } else {
    return null;
  }
}

function setRoundWinner(winnerSide) {
  roundStatus.classList.add("hidden");

  if (score[winnerSide] !== undefined) {
    score[winnerSide] += 1;
    userScore.textContent = `${score[sidesMap.USER]} / ${MAX_SCORE}`;
    computerScore.textContent = `${score[sidesMap.COMPUTER]} / ${MAX_SCORE}`;

    let isUserWinning = winnerSide === sidesMap.USER;
    roundStatus.textContent = isUserWinning ? "Победа!" : "Проигрыш";
    if (isUserWinning) {
      roundStatus.classList.add("win");
      roundStatus.classList.remove("lose");
    } else {
      roundStatus.classList.add("lose");
      roundStatus.classList.remove("win");
    }
  } else {
    roundStatus.textContent = "Ничья";
  }
  roundStatus.classList.remove("hidden");
}

function setItems(userItem, computerItem) {
  const setItem = (items, neededItem) =>
    items.forEach((item) => {
      if (neededItem !== item.dataset.item) {
        item.classList.add("hidden");
      } else {
        item.classList.remove("hidden");
      }
    });

  setItem(userItems, userItem);
  setItem(computerItems, computerItem);
}

function initItems() {
  userItems.forEach((item) => item.classList.remove("hidden"));
  computerItems.forEach((item) => item.classList.add("hidden"));
}

function setGameWinner() {
  const winner = score[sidesMap.USER] === 3 ? sidesMap.USER : sidesMap.COMPUTER;

  if (!Object.values(sidesMap).includes(winner)) {
    throw new Error("Непредвиденная ошибка");
  }

  isRoundActive = false;

  resultContainer.classList.remove("hidden");
  resultContainer.classList.add(winner === sidesMap.USER ? "win" : "lose");
  resultContainer.textContent =
    winner === sidesMap.USER ? "Поздравляю! Вы победили!" : "Вы проиграли :(";

  playAgainButton.classList.remove("hidden");
}

function setRoundLoading(status = true) {
  if (status) {
    loadingIndicator.classList.remove("hidden");
  } else {
    loadingIndicator.classList.add("hidden");
  }
}
