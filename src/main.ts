import "./style.css"
import { Selection } from "./enums/Selection"
import { Result } from "./enums/Result"

const gameElements = {
  gameScoreWrapper: document.querySelector(".scoreboard-wrapper") as HTMLDivElement,
  gameScore: document.querySelector(".scoreboard-score") as HTMLParagraphElement,
  gameWrapper: document.querySelector(".game-selection-wrapper") as HTMLDivElement,
  gameButtons: Array.from(document.querySelectorAll(".game-selection-btn")) as HTMLButtonElement[],
  gameResultWrapper: document.querySelector(".game-result-wrapper") as HTMLDivElement,
  playerSelectionButton: document.querySelector(".player-selection-btn") as HTMLButtonElement,
  houseSelectionButton: document.querySelector(".house-selection-btn") as HTMLButtonElement,
  resultWrapper: document.querySelector(".result-wrapper") as HTMLDivElement,
  gameResult: document.querySelector(".game-result") as HTMLParagraphElement,
  playAgain: document.querySelector(".play-again-btn") as HTMLButtonElement,
  rulesButton: document.querySelector(".rules-btn") as HTMLButtonElement,
  rulesModal: document.querySelector(".rules-modal") as HTMLDivElement,
  rulesCloseButton: document.querySelector(".rules-close-btn") as HTMLButtonElement,
}

const gameButtonClasses = ["game-paper-btn", "game-rock-btn", "game-lizard-btn", "game-spock-btn", "game-scissors-btn"]

const defeatTable = [
  { defeats: [Selection.ROCK, Selection.SPOCK] },
  { defeats: [Selection.SCISSORS, Selection.LIZARD] },
  { defeats: [Selection.PAPER, Selection.SPOCK] },
  { defeats: [Selection.SCISSORS, Selection.ROCK] },
  { defeats: [Selection.PAPER, Selection.LIZARD] },
]

let playerSelection: Selection
let houseSelection: Selection
let score: number = Number(localStorage.getItem("score")) ?? 0
if (score) {
  updateScore(false)
}
let result: Result

function computerSelection(): Selection {
  return Math.floor(Math.random() * gameElements.gameButtons.length)
}

function updateScore(setScore: boolean = true): void {
  if (setScore) {
    localStorage.setItem("score", score.toFixed())
  }
  gameElements.gameScore.textContent = score.toFixed()
}

function getResult(): Result {
  if (playerSelection === houseSelection) {
    result = Result.DRAW
  } else if (defeatTable[playerSelection].defeats.includes(houseSelection)) {
    score++
    result = Result.WIN
    updateScore()
  } else {
    score--
    result = Result.LOSE
    updateScore()
  }
  return result
}

function highlightWinner(): void {
  if (result != Result.DRAW) {
    if (result === Result.WIN) {
      gameElements.playerSelectionButton.classList.add("win-animation")
    } else {
      gameElements.houseSelectionButton.classList.add("win-animation")
    }
  }
}

function displayResult(): void {
  setTimeout(() => {
    gameElements.gameResult.textContent = getResult()
    gameElements.resultWrapper.style.display = "flex"
    highlightWinner()
  }, 500)
}

function restartGame(): void {
  gameElements.playerSelectionButton.classList.remove(gameButtonClasses[playerSelection])
  gameElements.gameWrapper.style.display = "initial"
  gameElements.gameResultWrapper.style.display = "none"
  gameElements.houseSelectionButton.classList.toggle("house-selection-btn")
  gameElements.houseSelectionButton.classList.toggle("no-animation")
  gameElements.houseSelectionButton.classList.remove(gameButtonClasses[houseSelection])
  gameElements.gameResult.textContent = ""
  gameElements.resultWrapper.style.display = "none"
  gameElements.playerSelectionButton.classList.remove("win-animation")
  gameElements.houseSelectionButton.classList.remove("win-animation")
}

function toggleRulesModal() {
  if (gameElements.rulesModal.style.display == "flex") {
    gameElements.rulesModal.style.display = "none"
    gameElements.rulesCloseButton.style.opacity = "0"
    gameElements.rulesCloseButton.style.cursor = "initial"
    gameElements.rulesCloseButton.removeEventListener("click", toggleRulesModal)
    window.removeEventListener("click", toggleRulesModal)
  } else {
    gameElements.rulesModal.style.display = "flex"
    setTimeout(() => {
      gameElements.rulesCloseButton.addEventListener("click", toggleRulesModal)
      window.addEventListener("click", toggleRulesModal)
      gameElements.rulesCloseButton.style.opacity = "1"
      gameElements.rulesCloseButton.style.cursor = "pointer"
    }, 500)
  }
}

gameElements.gameScoreWrapper.addEventListener("dblclick", () => {
  if (window.confirm("Do you want to reset the score?")) {
    localStorage.clear()
    score = 0
    updateScore(false)
  }
})

gameElements.gameButtons.forEach((button) => {
  button.addEventListener("click", () => {
    playerSelection = gameElements.gameButtons.indexOf(button)
    houseSelection = computerSelection()
    gameElements.playerSelectionButton.classList.add(gameButtonClasses[playerSelection])
    gameElements.gameWrapper.style.display = "none"
    gameElements.gameResultWrapper.style.display = "flex"

    setTimeout(() => {
      gameElements.houseSelectionButton.classList.toggle("house-selection-btn")
      gameElements.houseSelectionButton.classList.toggle("no-animation")
      gameElements.houseSelectionButton.classList.add(gameButtonClasses[houseSelection])
      displayResult()
    }, 3000)
  })
})

gameElements.playAgain.addEventListener("click", () => {
  restartGame()
})

gameElements.rulesButton.addEventListener("click", () => {
  toggleRulesModal()
})
