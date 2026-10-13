const stageSelect = document.getElementById("stageSelect");
const stageList = document.getElementById("stageList");
const game = document.getElementById("game");

const stageTitle = document.getElementById("stageTitle");
const question = document.getElementById("question");
const answerInput = document.getElementById("answerInput");

const progress = document.getElementById("progress");
const message = document.getElementById("message");

const questionNumber = document.getElementById("questionNumber");
const correctCount = document.getElementById("correctCount");
const missCount = document.getElementById("missCount");
const backButton = document.getElementById("backButton");

let currentStage = null;
let currentQuestionIndex = 0;
let currentCandidates = [];

let correct = 0;
let miss = 0;
let completed = false;

let typedText = "";
let mistakeCountedForCurrentInput = false;


// ====================================
// 日本語をローマ字へ変換
// ====================================

function hiraganaToRomaji(text) {
  const table = {
    "あ": ["a"],
    "い": ["i"],
    "う": ["u"],
    "え": ["e"],
    "お": ["o"],

    "か": ["ka"],
    "き": ["ki"],
    "く": ["ku"],
    "け": ["ke"],
    "こ": ["ko"],

    "さ": ["sa"],
    "し": ["shi", "si"],
    "す": ["su"],
    "せ": ["se"],
    "そ": ["so"],

    "た": ["ta"],
    "ち": ["chi", "ti"],
    "つ": ["tsu", "tu"],
    "て": ["te"],
    "と": ["to"],

    "な": ["na"],
    "に": ["ni"],
    "ぬ": ["nu"],
    "ね": ["ne"],
    "の": ["no"],

    "は": ["ha"],
    "ひ": ["hi"],
    "ふ": ["fu", "hu"],
    "へ": ["he"],
    "ほ": ["ho"],

    "ま": ["ma"],
    "み": ["mi"],
    "む": ["mu"],
    "め": ["me"],
    "も": ["mo"],

    "や": ["ya"],
    "ゆ": ["yu"],
    "よ": ["yo"],

    "ら": ["ra"],
    "り": ["ri"],
    "る": ["ru"],
    "れ": ["re"],
    "ろ": ["ro"],

    "わ": ["wa"],
    "を": ["wo", "o"],
    "ん": ["n", "nn"],

    "が": ["ga"],
    "ぎ": ["gi"],
    "ぐ": ["gu"],
    "げ": ["ge"],
    "ご": ["go"],

    "ざ": ["za"],
    "じ": ["ji", "zi"],
    "ず": ["zu"],
    "ぜ": ["ze"],
    "ぞ": ["zo"],

    "だ": ["da"],
    "ぢ": ["ji", "di"],
    "づ": ["zu", "du"],
    "で": ["de"],
    "ど": ["do"],

    "ば": ["ba"],
    "び": ["bi"],
    "ぶ": ["bu"],
    "べ": ["be"],
    "ぼ": ["bo"],

    "ぱ": ["pa"],
    "ぴ": ["pi"],
    "ぷ": ["pu"],
    "ぺ": ["pe"],
    "ぽ": ["po"],

    "きゃ": ["kya"],
    "きゅ": ["kyu"],
    "きょ": ["kyo"],

    "しゃ": ["sha", "sya"],
    "しゅ": ["shu", "syu"],
    "しょ": ["sho", "syo"],

    "ちゃ": ["cha", "tya"],
    "ちゅ": ["chu", "tyu"],
    "ちょ": ["cho", "tyo"],

    "にゃ": ["nya"],
    "にゅ": ["nyu"],
    "にょ": ["nyo"],

    "ひゃ": ["hya"],
    "ひゅ": ["hyu"],
    "ひょ": ["hyo"],

    "みゃ": ["mya"],
    "みゅ": ["myu"],
    "みょ": ["myo"],

    "りゃ": ["rya"],
    "りゅ": ["ryu"],
    "りょ": ["ryo"],

    "ぎゃ": ["gya"],
    "ぎゅ": ["gyu"],
    "ぎょ": ["gyo"],

    "じゃ": ["ja", "jya", "zya"],
    "じゅ": ["ju", "jyu", "zyu"],
    "じょ": ["jo", "jyo", "zyo"],

    "びゃ": ["bya"],
    "びゅ": ["byu"],
    "びょ": ["byo"],

    "ぴゃ": ["pya"],
    "ぴゅ": ["pyu"],
    "ぴょ": ["pyo"],

    "ふぁ": ["fa"],
    "ふぃ": ["fi"],
    "ふぇ": ["fe"],
    "ふぉ": ["fo"],

    "うぃ": ["wi"],
    "うぇ": ["we"],
    "うぉ": ["who"],

    "てぃ": ["thi"],
    "でぃ": ["dhi"],

    "ー": ["-"],
    "、": [","],
    "。": ["."],
    "！": ["!"],
    "？": ["?"],
    "「": ["\""],
    "」": ["\""],
    "（": ["("],
    "）": [")"],
    "・": ["/"],
    "　": [" "],
    " ": [" "]
  };

  // 変換結果を複数パターンで保持する
  let results = [""];
  let i = 0;

  while (i < text.length) {
    const twoCharacters = text.substring(i, i + 2);
    const oneCharacter = text.substring(i, i + 1);

    // 小さい「っ」
    if (oneCharacter === "っ") {
      const nextTwo = text.substring(i + 1, i + 3);
      const nextOne = text.substring(i + 1, i + 2);

      let nextOptions = table[nextTwo] || table[nextOne] || [""];
      let consonants = [];

      nextOptions.forEach((option) => {
        if (option.length > 0) {
          consonants.push(option.charAt(0));
        }
      });

      const newResults = [];

      results.forEach((result) => {
        consonants.forEach((consonant) => {
          newResults.push(result + consonant);
        });
      });

      results = newResults;
      i++;
      continue;
    }

    let options = table[twoCharacters];

    if (options) {
      i += 2;
    } else {
      options = table[oneCharacter];

      if (!options) {
        options = [oneCharacter];
      }

      i++;
    }

    const newResults = [];

    results.forEach((result) => {
      options.forEach((option) => {
        newResults.push(result + option);
      });
    });

    results = newResults;
  }

  return results;
}


// ====================================
// 文字列を正規化
// ====================================

function normalizeInput(text) {
  return text
    .toLowerCase()
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (character) => {
      return String.fromCharCode(character.charCodeAt(0) - 0xfee0);
    });
}


// ====================================
// 連続入力の候補を取得
// ====================================

function createCandidates(text) {
  return hiraganaToRomaji(text).map(normalizeInput);
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
// ゲーム開始
// ====================================

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
  answerInput.value = "";
  answerInput.focus();

  showQuestion();
}


// ====================================
// 現在の問題を表示
// ====================================

function showQuestion() {
  const currentQuestion =
    currentStage.questions[currentQuestionIndex];

  // 個別のromajiが指定されている場合は、それを使う
  if (
    currentStage.romaji &&
    currentStage.romaji[currentQuestionIndex]
  ) {
    currentCandidates =
      currentStage.romaji[currentQuestionIndex]
        .map(normalizeInput);
  } else {
    // 指定がなければ自動変換
    currentCandidates =
      createCandidates(currentQuestion);
  }

  typedText = "";
  mistakeCountedForCurrentInput = false;

  question.textContent = currentQuestion;

  questionNumber.textContent =
    `${currentQuestionIndex + 1} / ${currentStage.questions.length}`;

  progress.textContent = "";
  message.textContent = "";

  answerInput.value = "";
  answerInput.classList.remove("wrong");
}


// ====================================
// 現在の入力が候補の先頭部分か確認
// ====================================

function isValidPrefix(input) {
  return currentCandidates.some((candidate) => {
    return candidate.startsWith(input);
  });
}


// ====================================
// 現在の入力が完全一致か確認
// ====================================

function isComplete(input) {
  return currentCandidates.some((candidate) => {
    return candidate === input;
  });
}


// ====================================
// 入力処理
// ====================================

answerInput.addEventListener("input", () => {
  if (completed || !currentStage) {
    return;
  }

  typedText = normalizeInput(answerInput.value);

  // 入力途中が正しい場合
  if (isValidPrefix(typedText)) {
    answerInput.classList.remove("wrong");
    message.textContent = "";
  } else {
    // 間違っても入力は止めない
    answerInput.classList.add("wrong");
    message.textContent = "ミスがあります。そのまま続けてください";

    if (!mistakeCountedForCurrentInput) {
      miss++;
      missCount.textContent = miss;
      mistakeCountedForCurrentInput = true;
    }
  }

  // 進捗表示
  const longestCandidate =
    currentCandidates.reduce((longest, candidate) => {
      return candidate.length > longest.length
        ? candidate
        : longest;
    }, "");

  progress.textContent =
    `${typedText.length} / ${longestCandidate.length}`;

  // 完全一致した場合
  if (isComplete(typedText)) {
    correct++;
    correctCount.textContent = correct;

    currentQuestionIndex++;

    if (currentQuestionIndex >= currentStage.questions.length) {
      completed = true;

      question.textContent = "ステージクリア！";
      progress.textContent = "";
      message.textContent =
        `正解数：${correct}　ミス：${miss}`;

      answerInput.value = "";
      answerInput.disabled = true;

      return;
    }

    showQuestion();
  }
});


// ====================================
// ステージ選択へ戻る
// ====================================

backButton.addEventListener("click", () => {
  game.classList.add("hidden");
  stageSelect.classList.remove("hidden");

  currentStage = null;
  currentQuestionIndex = 0;
  currentCandidates = [];

  answerInput.disabled = false;
  answerInput.value = "";
  answerInput.classList.remove("wrong");

  progress.textContent = "";
  message.textContent = "";

  completed = false;
});


// ====================================
// 初期処理
// ====================================

createStageButtons();
