const stageSelect = document.getElementById("stageSelect");
const stageList = document.getElementById("stageList");
const game = document.getElementById("game");

const stageTitle = document.getElementById("stageTitle");
const question = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const message = document.getElementById("message");

const questionNumber = document.getElementById("questionNumber");
const correctCount = document.getElementById("correctCount");
const missCount = document.getElementById("missCount");
const backButton = document.getElementById("backButton");

let currentStage = null;
let currentQuestionIndex = 0;
let correct = 0;
let miss = 0;
let completed = false;


// ステージボタンを作成する
function createStageButtons() {
  stageList.innerHTML = "";

  stages.forEach((stage, index) => {
    const button = document.createElement("button");

    button.textContent = stage.title;
    button.className = "stage-button";

    button.addEventListener("click", () => {
      startGame(index);
    });

    stageList.appendChild(button);
  });
}


// ゲームを開始する
function startGame(stageIndex) {
  currentStage = stages[stageIndex];
  currentQuestionIndex = 0;
  correct = 0;
  miss = 0;
  completed = false;

  stageSelect.classList.add("hidden");
  game.classList.remove("hidden");

  stageTitle.textContent = currentStage.title;
  correctCount.textContent = correct;
  missCount.textContent = miss;

  answerInput.disabled = false;
  answerInput.focus();

  showQuestion();
}


// 問題を表示する
function showQuestion() {
  const currentQuestion =
    currentStage.questions[currentQuestionIndex];

  question.textContent = currentQuestion;

  questionNumber.textContent =
    `${currentQuestionIndex + 1} / ${currentStage.questions.length}`;

  answerInput.value = "";
  message.textContent = "";
}


// 入力を確認する
answerInput.addEventListener("input", () => {
  if (completed || !currentStage) {
    return;
  }

  const currentQuestion =
    currentStage.questions[currentQuestionIndex];

  // 入力途中の間違いを確認
  if (!currentQuestion.startsWith(answerInput.value)) {
    answerInput.classList.add("wrong");
    message.textContent = "入力が違います";
    return;
  }

  answerInput.classList.remove("wrong");
  message.textContent = "";

  // 問題文と完全一致した場合
  if (answerInput.value === currentQuestion) {
    correct++;
    correctCount.textContent = correct;

    currentQuestionIndex++;

    if (currentQuestionIndex >= currentStage.questions.length) {
      completed = true;

      question.textContent = "ステージクリア！";
      message.textContent =
        `正解数：${correct}　ミス：${miss}`;

      answerInput.value = "";
      answerInput.disabled = true;

      return;
    }

    showQuestion();
  }
});


// ミス数を記録する
answerInput.addEventListener("keydown", (event) => {
  if (completed || !currentStage) {
    return;
  }

  if (event.key === "Backspace") {
    return;
  }

  const currentQuestion =
    currentStage.questions[currentQuestionIndex];

  const nextValue =
    answerInput.value + event.key;

  if (!currentQuestion.startsWith(nextValue)) {
    miss++;
    missCount.textContent = miss;
  }
});


// ステージ選択画面に戻る
backButton.addEventListener("click", () => {
  game.classList.add("hidden");
  stageSelect.classList.remove("hidden");

  answerInput.disabled = false;
  answerInput.value = "";
  message.textContent = "";
});


// 最初にステージボタンを作成
createStageButtons();
