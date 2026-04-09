#!/bin/bash
# lib/screenshot.sh — Chrome headless でスクリーンショットを撮る
#
# 使い方:
#   bash lib/screenshot.sh <対象HTMLパス> [出力先PNG] [幅x高さ] [テーマ]
#
# 例:
#   bash lib/screenshot.sh appstore-preview/index.html          # → /tmp/screenshot.png (1280x900 light)
#   bash lib/screenshot.sh er-diagram/index.html /tmp/erd.png 1280x900 dark
#
# テーマ指定 (dark) する場合:
#   対象 HTML と同ディレクトリに一時ファイルを生成し、
#   localStorage にテーマを仕込んだ上でスクリーンショットを撮る。
#   撮影後に一時ファイルは自動削除される。
#
# 制限:
#   - Chrome が /Applications/Google Chrome.app にインストールされていること
#   - viewportが 500px 未満の場合 headless では一部レイアウトが崩れることがある（既知の制限）
#   - file:// で開くため Google OAuth（Drive sync）は動かない

set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TARGET="${1:?使い方: bash lib/screenshot.sh <HTMLパス> [出力PNG] [幅x高さ] [テーマ]}"
OUTPUT="${2:-/tmp/screenshot.png}"
SIZE="${3:-1280x900}"
THEME="${4:-light}"

WIDTH="${SIZE%x*}"
HEIGHT="${SIZE#*x}"

# 対象の絶対パスを解決
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
if [[ "$TARGET" = /* ]]; then
  ABS_TARGET="$TARGET"
else
  ABS_TARGET="$SCRIPT_DIR/$TARGET"
fi

if [ ! -f "$ABS_TARGET" ]; then
  echo "エラー: $ABS_TARGET が見つかりません" >&2
  exit 1
fi

CLEANUP=""

if [ "$THEME" = "dark" ]; then
  # dark テーマ用の一時ファイルを同ディレクトリに生成
  DIR="$(dirname "$ABS_TARGET")"
  TMPFILE="$DIR/_screenshot-dark-tmp.html"
  CLEANUP="$TMPFILE"

  # 元ファイルを読んで、<head> 直後に localStorage 書き込みを注入
  sed 's|<head>|<head><script>localStorage.setItem("devtools_theme","dark");</script>|' "$ABS_TARGET" > "$TMPFILE"
  # html 要素に data-theme="dark" を付ける
  sed -i '' 's|<html|<html data-theme="dark"|' "$TMPFILE"

  ABS_TARGET="$TMPFILE"
fi

"$CHROME" \
  --headless=new \
  --screenshot="$OUTPUT" \
  --window-size="$WIDTH,$HEIGHT" \
  --disable-gpu \
  --no-sandbox \
  "$ABS_TARGET" 2>/dev/null

# 一時ファイルの後始末
if [ -n "$CLEANUP" ] && [ -f "$CLEANUP" ]; then
  rm "$CLEANUP"
fi

echo "✅ $OUTPUT ($SIZE, $THEME)"
