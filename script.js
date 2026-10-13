const stageSelect = document.getElementById("stageSelect");
const stageList = document.getElementById("stageList");
const game = document.getElementById("game");

const stageTitle = document.getElementById("stageTitle");
const question = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const romajiHint = document.getElementById("romajiHint");
const message = document.getElementById("message");

const questionNumber = document.getElementById("questionNumber");
const correctCount = document.getElementById("correctCount");
const missCount = document.getElementById("missCount");
const backButton = document.getElementById("backButton");

let currentStage = null;
let currentQuestionIndex = 0;
let currentRomaji = "";

let correct = 0;
let miss = 0;
let completed = false;
let mistakeAlreadyCounted = false;


// ====================================
// 日本語をローマ字に変換する関数
// ====================================

function hiraganaToRomaji(text) {
  const table = {
    "あ": "a",
    "い": "i",
    "う": "u",
    "え": "e",
    "お": "o",

    "か": "ka",
    "き": "ki",
    "く": "ku",
    "け": "ke",
    "こ": "ko",

    "さ": "sa",
    "し": "shi",
    "す": "su",
    "せ": "se",
    "そ": "so",

    "た": "ta",
    "ち": "chi",
    "つ": "tsu",
    "て": "te",
    "と": "to",

    "な": "na",
    "に": "ni",
    "ぬ": "nu",
    "ね": "ne",
    "の": "no",

    "は": "ha",
    "ひ": "hi",
    "ふ": "fu",
    "へ": "he",
    "ほ": "ho",

    "ま": "ma",
    "み": "mi",
    "む": "mu",
    "め": "me",
    "も": "mo",

    "や": "ya",
    "ゆ": "yu",
    "よ": "yo",

    "ら": "ra",
    "り": "ri",
    "る": "ru",
    "れ": "re",
    "ろ": "ro",

    "わ": "wa",
    "を": "wo",
    "ん": "n",

    "が": "ga",
    "ぎ": "gi",
    "ぐ": "gu",
    "げ": "ge",
    "ご": "go",

    "ざ": "za",
    "じ": "ji",
    "ず": "zu",
    "ぜ": "ze",
    "ぞ": "zo",

    "だ": "da",
    "ぢ": "ji",
    "づ": "zu",
    "で": "de",
    "ど": "do",

    "ば": "ba",
    "び": "bi",
    "ぶ": "bu",
    "べ": "be",
    "ぼ": "bo",

    "ぱ": "pa",
    "ぴ": "pi",
    "ぷ": "pu",
    "ぺ": "pe",
    "ぽ": "po",

    "きゃ": "kya",
    "きゅ": "kyu",
    "きょ": "kyo",

    "しゃ": "sha",
    "しゅ": "shu",
    "しょ": "sho",

    "ちゃ": "cha",
    "ちゅ": "chu",
    "ちょ": "cho",

    "にゃ": "nya",
    "にゅ": "nyu",
    "にょ": "nyo",

    "ひゃ": "hya",
    "ひゅ": "hyu",
    "ひょ": "hyo",

    "みゃ": "mya",
    "みゅ": "myu",
    "みょ": "myo",

    "りゃ": "rya",
    "りゅ": "ryu",
    "りょ": "ryo",

    "ぎゃ": "gya",
    "ぎゅ": "gyu",
    "ぎょ": "gyo",

    "じゃ": "ja",
    "じゅ": "ju",
    "じょ": "jo",

    "びゃ": "bya",
    "びゅ": "byu",
    "びょ": "byo",

    "ぴゃ": "pya",
    "ぴゅ": "pyu",
    "ぴょ": "pyo",

    "ふぁ": "fa",
    "ふぃ": "fi",
    "ふぇ": "fe",
    "ふぉ": "fo",

    "うぃ": "wi",
    "うぇ": "we",
    "うぉ": "who",

    "てぃ": "thi",
    "でぃ": "dhi",

    "っ": "",
    "ー": "-",

    "、": ",",
    "。": ".",
    "！": "!",
    "？": "?",
    "「": "\"",
    "」": "\"",
    "（": "(",
    "）": ")",
    "・": "/",
    "　": " "
  };

  let result = "";
  let i = 0;

  while (i < text.length) {
    const twoCharacters = text.substring(i, i + 2);
    const oneCharacter = text.substring(i, i + 1);

    // 拗音など、2文字の組み合わせを優先
    if (table[twoCharacters] !== undefined) {
      result += table[twoCharacters];
      i += 2;
      continue;
    }

    // 小さい「っ」は、次の子音を重ねる
    if (oneCharacter === "っ") {
      const nextTwo = text.substring(i + 1, i + 3);
      const nextOne = text.substring(i + 1, i + 2);

      if (table[nextTwo]) {
        result += table[nextTwo].charAt(0);
      } else if (table[nextOne]) {
        result += table[nextOne].charAt(0);
      }

      i++;
      continue;
    }

    if (table[oneCharacter] !== undefined) {
      result += table[oneCharacter];
    } else {
      // 漢字や英数字など、変換できない文字はそのまま残す
      result += oneCharacter;
    }

    i++;
  }

  return result;
}


// ====================================
// ステージ一覧を作成
// ====================================

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


// ====================================
// ゲームを開始
// ====================================

function startGame(stageIndex) {
  currentStage = stages[stageIndex];
  currentQuestionIndex = 0;

  correct = 0;
  miss = 0;
  completed = false;
  mistakeAlreadyCounted = false;

  stageSelect.classList.add("hidden");
  game.classList.remove("hidden");

  stageTitle.textContent = currentStage.title;
  correctCount.textContent = correct;
  missCount.textContent = miss;

  answerInput.disabled = false;
  answerInput.value = "";
  answerInput.focus();

  showQuestion();
}


// ====================================
// 問題を表示
// ====================================

function showQuestion() {
  const currentQuestion =
    currentStage.questions[currentQuestionIndex];

  currentRomaji = hiraganaToRomaji(currentQuestion);

  question.textContent = currentQuestion;
  romajiHint.textContent = "";

  questionNumber.textContent =
    `${currentQuestionIndex + 1} / ${currentStage.questions.length}`;

  answerInput.value = "";
  answerInput.classList.remove("wrong");
  message.textContent = "";

  mistakeAlreadyCounted = false;
}


// ====================================
// 入力を確認
// ====================================

answerInput.addEventListener("input", () => {
  if (completed || !currentStage) {
    return;
  }

  const typedText = answerInput.value.toLowerCase();

  const isCorrectSoFar =
    currentRomaji.startsWith(typedText);

  if (isCorrectSoFar) {
    answerInput.classList.remove("wrong");
    message.textContent = "";
  } else {
    answerInput.classList.add("wrong");
    message.textContent = "入力が違います";

    if (!mistakeAlreadyCounted) {
      miss++;
      missCount.textContent = miss;
      mistakeAlreadyCounted = true;
    }
  }

  // 正しい入力に戻ったら、次のミスを数えられるようにする
  if (isCorrectSoFar) {
    mistakeAlreadyCounted = false;
  }

  // 完全一致したら次の問題へ
  if (typedText === currentRomaji) {
    correct++;
    correctCount.textContent = correct;

    currentQuestionIndex++;

    if (currentQuestionIndex >= currentStage.questions.length) {
      completed = true;

      question.textContent = "ステージクリア！";
      romajiHint.textContent =
        `正解数：${correct}　ミス：${miss}`;

      message.textContent = "お疲れさまでした！";

      answerInput.value = "";
      answerInput.disabled = true;

      return;
    }

    showQuestion();
  }
});


// ====================================
// ヒント表示
// ====================================

answerInput.addEventListener("focus", () => {
  if (!completed && currentRomaji) {
    romajiHint.textContent =
      "ローマ字で入力してください";
  }
});


// ====================================
// ステージ選択に戻る
// ====================================

backButton.addEventListener("click", () => {
  game.classList.add("hidden");
  stageSelect.classList.remove("hidden");

  currentStage = null;
  currentQuestionIndex = 0;
  currentRomaji = "";

  answerInput.disabled = false;
  answerInput.value = "";
  answerInput.classList.remove("wrong");

  message.textContent = "";
  romajiHint.textContent = "";

  completed = false;
  mistakeAlreadyCounted = false;
});


// ====================================
// 初期処理
// ====================================

createStageButtons();
