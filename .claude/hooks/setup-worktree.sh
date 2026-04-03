#!/usr/bin/env bash
set -euo pipefail

WORKTREE_ROOT="$(pwd)"

# In main repo, .git is a directory — nothing to do
if [ -d "${WORKTREE_ROOT}/.git" ]; then
  exit 0
fi

# Not a git repo at all
if [ ! -f "${WORKTREE_ROOT}/.git" ]; then
  exit 0
fi

# Resolve main repo root from the common git dir
GIT_COMMON_DIR="$(git rev-parse --git-common-dir 2>/dev/null)" || exit 0
MAIN_REPO_ROOT="$(dirname "${GIT_COMMON_DIR}")"
MAIN_NODE_MODULES="${MAIN_REPO_ROOT}/node_modules"

# Main repo doesn't have node_modules yet — skip
if [ ! -d "${MAIN_NODE_MODULES}" ]; then
  exit 0
fi

WORKTREE_NODE_MODULES="${WORKTREE_ROOT}/node_modules"

# Already symlinked
if [ -L "${WORKTREE_NODE_MODULES}" ]; then
  exit 0
fi

# Real node_modules directory exists — don't clobber
if [ -d "${WORKTREE_NODE_MODULES}" ]; then
  exit 0
fi

ln -s "${MAIN_NODE_MODULES}" "${WORKTREE_NODE_MODULES}"
exit 0
