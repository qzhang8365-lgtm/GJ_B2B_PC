#!/usr/bin/env bash
# 国金 PC 端 B 端设计系统 Skill —— 升级自检
#
# 用法：bash scripts/check-update.sh [--force] [--check-only]
#   --force       忽略 12 小时检查间隔，立即检查
#   --check-only  只报告是否有新版本，不下载覆盖
#
# 约定（供 SKILL.md 第 0 步解析）：
#   - 升级成功时输出一行「已更新到 V<版本>」
#   - 其它情况（已是最新 / 无网 / 失败 / 跳过）静默或只输出提示，绝不阻断
#   - 退出码恒为 0
#
# 版本源：GitHub Releases 的 latest 版本（tag vX.Y.Z），与规范站「下载 Skill」按钮同源。
# 本地版本：Skill 根目录 package.json 的 "version" 字段（唯一版本号来源）。
# 兼容 macOS 自带 bash 3.2，只依赖 curl / unzip。

REPO="qzhang8365-lgtm/GJ_B2B_PC"
ASSET_PREFIX="gj-b2b-pc-design-skill-v"
INTERVAL_SECONDS=43200   # 12 小时内只查一次
TIMEOUT=5

FORCE=0; CHECK_ONLY=0
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    --check-only) CHECK_ONLY=1 ;;
  esac
done

main() {
  command -v curl >/dev/null 2>&1 || return 0

  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd)" || return 0
  SKILL_DIR="$(cd "$SCRIPT_DIR/.." 2>/dev/null && pwd)" || return 0
  [ -f "$SKILL_DIR/SKILL.md" ] || return 0

  # 维护方的开发仓库不自动覆盖，避免冲掉未发布的改动
  if [ -e "$SKILL_DIR/.git" ]; then
    return 0
  fi

  LOCAL="$(read_version "$SKILL_DIR/package.json")"
  [ -n "$LOCAL" ] || return 0

  # 检查间隔：时间戳放在 Skill 目录内，跟着这份 Skill 走
  STAMP="$SKILL_DIR/.update-check"
  NOW="$(date +%s)"
  if [ "$FORCE" -eq 0 ] && [ -f "$STAMP" ]; then
    LAST="$(cat "$STAMP" 2>/dev/null)"
    case "$LAST" in ''|*[!0-9]*) LAST=0 ;; esac
    [ $((NOW - LAST)) -lt "$INTERVAL_SECONDS" ] && return 0
  fi

  REMOTE="$(latest_version)"
  [ -n "$REMOTE" ] || return 0          # 无网 / 被墙 / GitHub 不可达：放行
  echo "$NOW" > "$STAMP" 2>/dev/null

  version_gt "$REMOTE" "$LOCAL" || return 0   # 已是最新（或本地更新）

  if [ "$CHECK_ONLY" -eq 1 ]; then
    echo "发现新版本 V$REMOTE（当前 V$LOCAL）"
    return 0
  fi

  upgrade "$REMOTE" "$LOCAL"
}

read_version() {
  [ -f "$1" ] || return 0
  sed -n 's/^[[:space:]]*"version"[[:space:]]*:[[:space:]]*"\([0-9][0-9.]*\)".*/\1/p' "$1" | head -n 1
}

latest_version() {
  # 优先：releases/latest 的 302 跳转地址（不走 API，无限流）
  local loc tag
  loc="$(curl -sSI -m "$TIMEOUT" "https://github.com/$REPO/releases/latest" 2>/dev/null \
        | tr -d '\r' | sed -n 's/^[Ll]ocation:[[:space:]]*//p' | tail -n 1)"
  tag="${loc##*/tag/}"
  if [ "$tag" = "$loc" ] || [ -z "$tag" ]; then
    # 兜底：GitHub API
    tag="$(curl -sS -m "$TIMEOUT" "https://api.github.com/repos/$REPO/releases/latest" 2>/dev/null \
          | sed -n 's/.*"tag_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1)"
  fi
  tag="${tag#v}"; tag="${tag#V}"
  case "$tag" in
    [0-9]*.[0-9]*) echo "$tag" ;;
  esac
}

# version_gt A B：A > B 返回 0（逐段数字比较，兼容 bash 3.2）
version_gt() {
  local a="$1" b="$2" x y
  while [ -n "$a" ] || [ -n "$b" ]; do
    x="${a%%.*}"; y="${b%%.*}"
    [ "$a" = "${a#*.}" ] && a="" || a="${a#*.}"
    [ "$b" = "${b#*.}" ] && b="" || b="${b#*.}"
    x="${x%%[!0-9]*}"; y="${y%%[!0-9]*}"
    x=$((10#${x:-0})); y=$((10#${y:-0}))
    [ "$x" -gt "$y" ] && return 0
    [ "$x" -lt "$y" ] && return 1
  done
  return 1
}

upgrade() {
  local ver="$1" old="$2" work zip newdir parent backup
  command -v unzip >/dev/null 2>&1 || { echo "发现新版本 V$ver，但缺少 unzip，未自动升级"; return 0; }

  work="$(mktemp -d 2>/dev/null || mktemp -d -t gjskill)" || return 0
  zip="$work/skill.zip"
  if ! curl -sSfL -m 120 -o "$zip" \
       "https://github.com/$REPO/releases/download/v$ver/$ASSET_PREFIX$ver.zip" 2>/dev/null; then
    rm -rf "$work"; return 0
  fi
  if ! unzip -q "$zip" -d "$work/x" 2>/dev/null; then
    rm -rf "$work"; return 0
  fi

  # 找到包内 SKILL.md 所在目录（zip 顶层通常是 gj-b2b-pc-design-skill-vX.Y.Z/）
  newdir="$(find "$work/x" -maxdepth 3 -name SKILL.md -type f 2>/dev/null | head -n 1)"
  newdir="${newdir%/SKILL.md}"
  if [ -z "$newdir" ] || [ "$(read_version "$newdir/package.json")" != "$ver" ]; then
    rm -rf "$work"; return 0       # 包结构或版本号不对：不覆盖
  fi

  # 保留用户在 Skill 目录里自己装的依赖，免得升级后要重新 npm install
  [ -d "$SKILL_DIR/node_modules" ] && [ ! -e "$newdir/node_modules" ] && \
    cp -R "$SKILL_DIR/node_modules" "$newdir/node_modules" 2>/dev/null
  date +%s > "$newdir/.update-check" 2>/dev/null

  # 整目录替换：旧版先移到备份（放在 skills 目录之外，避免被 Agent 当成第二份 Skill 识别）
  parent="$(dirname "$SKILL_DIR")"
  backup="${HOME:-$work}/.cache/gj-b2b-pc-design-skill/backup-v$old-$(date +%Y%m%d%H%M%S)"
  mkdir -p "$(dirname "$backup")" 2>/dev/null || backup="$work/backup"
  [ -w "$parent" ] || { echo "发现新版本 V$ver，但 Skill 目录不可写，未自动升级"; rm -rf "$work"; return 0; }

  if ! mv "$SKILL_DIR" "$backup" 2>/dev/null; then
    rm -rf "$work"; return 0
  fi
  if ! mv "$newdir" "$SKILL_DIR" 2>/dev/null; then
    mv "$backup" "$SKILL_DIR" 2>/dev/null     # 回滚
    rm -rf "$work"; return 0
  fi
  rm -rf "$work"
  echo "已更新到 V$ver（原 V$old 已备份到 $backup）"
}

main 2>/dev/null
exit 0
