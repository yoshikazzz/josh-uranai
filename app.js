const home = document.getElementById("home");
const btn = document.getElementById("btn");
const again = document.getElementById("again");

const result = document.getElementById("result");
const loadingOverlay = document.getElementById("loadingOverlay");

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
    const isFile = location.protocol === "file:";
    if (isFile) {
      alert("results.json を読むにはローカルサーバが必要です。例: python3 -m http.server 8000 → http://localhost:8000/");
    } else {
      alert("results.json の読み込みに失敗しました。ファイル名・配置・パスを確認してください。");
    }
  });

function pickRandom() {
  return data[Math.floor(Math.random() * data.length)];
}

function showLoading() {
  // ホームを隠す＆結果も隠す
  home.hidden = true;
  result.hidden = true;

  // 画面最上部へ（ローディングが確実に見える）
  window.scrollTo({ top: 0, behavior: "instant" });

  // 全画面ローディング表示
  loadingOverlay.hidden = false;
}

function hideLoading() {
  loadingOverlay.hidden = true;
}

function showResult(item) {
  kickerEl.textContent = item.kicker ?? "";
  titleEl.textContent = item.title ?? "";
  textEl.textContent = item.text ?? "";
  imgEl.src = item.image ?? "";

  result.hidden = false;

  // 結果の先頭へスクロール（モバイルで確実に表示）
  result.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const DURATION = 1600;

  setButtonsDisabled(true);
  showLoading();

  setTimeout(() => {
    hideLoading();
    showResult(pickRandom());
    setButtonsDisabled(false);
  }, DURATION);
}

// 「もう一度引く」では、結果画面からそのまま再抽選でOK（全画面ローディングに戻す）
btn.addEventListener("click", startUranai);
if (again) again.addEventListener("click", startUranai);
