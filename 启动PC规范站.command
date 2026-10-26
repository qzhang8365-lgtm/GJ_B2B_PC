#!/bin/bash

# 双击此文件：启动本地 HTTP 预览，并使用 Safari 打开 PC 端规范站。
# 关闭此终端窗口或按 Control+C，会同步停止本地预览服务。

PROJECT_DIR="$(cd "$(dirname "$0")" 2>/dev/null && pwd)" || exit 1
cd "$PROJECT_DIR" || exit 1

show_error() {
  /usr/bin/osascript -e "display alert \"无法启动 PC 规范站\" message \"$1\" as critical" >/dev/null 2>&1 || echo "$1"
}

if ! command -v node >/dev/null 2>&1; then
  show_error "未检测到 Node.js，请先安装 Node.js 后重试。"
  exit 1
fi

PORT=4173
MAX_PORT=4183

# 已有同一预览服务时直接复用；端口被其他程序占用时自动尝试下一个端口。
while [ "$PORT" -le "$MAX_PORT" ]; do
  URL="http://localhost:$PORT/preview/"
  if /usr/bin/curl -fsS --max-time 1 "$URL" 2>/dev/null | /usr/bin/grep -q "GJ B端设计系统"; then
    /usr/bin/open -a Safari "$URL"
    exit 0
  fi
  if ! /usr/sbin/lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    break
  fi
  PORT=$((PORT + 1))
done

if [ "$PORT" -gt "$MAX_PORT" ]; then
  show_error "4173–4183 端口均被占用，请关闭占用程序后重试。"
  exit 1
fi

URL="http://localhost:$PORT/preview/"
node scripts/serve-preview.mjs "$PORT" --no-open &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM HUP

ATTEMPT=0
while [ "$ATTEMPT" -lt 50 ]; do
  if /usr/bin/curl -fsS --max-time 1 "$URL" 2>/dev/null | /usr/bin/grep -q "GJ B端设计系统"; then
    /usr/bin/open -a Safari "$URL"
    echo ""
    echo "PC 规范站已在 Safari 打开：$URL"
    echo "保持此窗口开启；按 Control+C 可停止预览。"
    wait "$SERVER_PID"
    exit $?
  fi
  if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    show_error "本地预览服务启动失败，请检查终端输出。"
    exit 1
  fi
  /bin/sleep 0.1
  ATTEMPT=$((ATTEMPT + 1))
done

show_error "本地预览服务启动超时，请稍后重试。"
exit 1
