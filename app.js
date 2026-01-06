const btn = document.getElementById("btn");
const again = document.getElementById("again");
const result = document.getElementById("result");
const loading = document.getElementById("loading");

const kickerEl = document.getElementById("kicker");
const titleEl = document.getElementById("title");
const textEl = document.getElementById("text");
const imgEl = document.getElementById("img");

let data = [];

// results.json を読み込み
fetch("./results.json")
  .then((res) => {
    if (!res.ok) throw new Error(`Failed to load results.json: ${res.status}`);
    return res.json();
  })
  .then((json) => {
    if (!Array.isArray(json) || json.length === 0) {
      throw new Error("results.json must be a non-empty array");
    }
    data = json;
  })
  .catch((err) => {
    console.error(err);
    alert("results.json の読み込みに失敗しました。GitHub Pages 上で確認してください。");
  });

function pickRandom() {
  return data[Math.floor(Math.random() * data.length)];
}

function showResult(item) {
  kickerEl.textContent = item.kicker ?? "";
  titleEl.textContent = item.title ?? "";
  textEl.textContent = item.text ?? "";
  imgEl.src = item.image ?? "";

  loading.hidden = true;
  result.hidden = false;
}

function setButtonsDisabled(disabled) {
  btn.disabled = disabled;
  if (again) again.disabled = disabled;
}

function startUranai() {
  if (!data || data.length === 0) {
    alert("占いデータ（results.json）を読み込み中です。少し待ってからもう一度押してください。");
    return;
  }

  // 結果を隠して占い中へ
  result.hidden = true;
  loading.hidden = false;

  const DURATION = 1600;

  // 連打防止
  setButtonsDisabled(true);
  setTimeout(() => {
    showResult(pickRandom());
    setButtonsDisabled(false);
  }, DURATION);
}

btn.addEventListener("click", startUranai);
if (again) again.addEventListener("click", startUranai);
