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
let safetyTimer = null;

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
    alert("results.json の読み込みに失敗しました。");
  });

function pickRandom() {
  return data[Math.floor(Math.random() * data.length)];
}

function setButtonsDisabled(disabled) {
  btn.disabled = disabled;
  if (again) again.disabled = disabled;
}

function showLoading() {
  home.classList.add("is-hidden");
  result.classList.add("is-hidden");

  // ローディングを有効化
  loadingOverlay.classList.add("is-active");

  // 念のため最上部へ
  try { window.scrollTo(0, 0); } catch {}

  // フェイルセーフ（8秒で復帰）
  if (safetyTimer) clearTimeout(safetyTimer);
  safetyTimer = setTimeout(() => {
    hideLoading();
    home.classList.remove("is-hidden");
    setButtonsDisabled(false);
    alert("読み込みが長引いています。もう一度お試しください。");
  }, 8000);
}

function hideLoading() {
  loadingOverlay.classList.remove("is-active");
  if (safetyTimer) {
    clearTimeout(safetyTimer);
    safetyTimer = null;
  }
}

function showResult(item) {
  kickerEl.textContent = item.kicker ?? "";
  titleEl.textContent = item.title ?? "";
  textEl.textContent = item.text ?? "";
  imgEl.src = item.image ?? "";

  result.classList.remove("is-hidden");

  // 結果先頭へ（スマホでも確実に見せる）
  try { result.scrollIntoView({ behavior: "smooth", block: "start" }); } catch {}
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

btn.addEventListener("click", startUranai);
if (again) again.addEventListener("click", startUranai);
