// ============================================================
// Text Counter — テキストの文字数・単語数・行数をカウント
// ============================================================

var input = document.getElementById('input');
var countChars = document.getElementById('countChars');
var countNoSpaces = document.getElementById('countNoSpaces');
var countWords = document.getElementById('countWords');
var countLines = document.getElementById('countLines');

function updateCounts() {
  var text = input.value;
  countChars.textContent = text.length;
  countNoSpaces.textContent = text.replace(/\s/g, '').length;
  countWords.textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
  countLines.textContent = text === '' ? 0 : text.split(/\n/).length;
}

input.addEventListener('input', updateCounts);
updateCounts();

// ---- Theme ----
function initTheme() {
  if (!window.theme) return;
  var m = document.getElementById('theme-mount');
  if (m) window.theme.mountUI(m);
}

// ---- Drive sync（text-counter はデータ同期不要だが UI は表示） ----
function initDriveSync() {
  if (!window.driveSync) return;
  var m = document.getElementById('sync-mount');
  if (m) window.driveSync.mountUI(m);
  window.driveSync.init();
}

document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  initDriveSync();
});
