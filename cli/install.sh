#!/bin/sh
set -e

REPO="whoami-wiki/whoami"
INSTALL_DIR="${WAI_INSTALL_DIR:-$HOME/.local/bin}"

# ── Helpers ─────────────────────────────────────────────────────────────

info()  { printf '  \033[1;34m%s\033[0m %s\n' "$1" "$2"; }
error() { printf '  \033[1;31merror\033[0m %s\n' "$1" >&2; exit 1; }

# ── Check Node ──────────────────────────────────────────────────────────

check_node() {
  if ! command -v node >/dev/null 2>&1; then
    error "Node.js is required but not installed. Install Node 20+ first."
  fi

  node_version=$(node -v | sed 's/^v//')
  node_major=$(echo "$node_version" | cut -d. -f1)

  if [ "$node_major" -lt 20 ] 2>/dev/null; then
    error "Node 20+ required, found v${node_version}"
  fi

  info "node" "v${node_version}"
}

# ── Fetch latest version ───────────────────────────────────────────────

fetch_latest() {
  info "fetch" "checking latest release..."

  if command -v curl >/dev/null 2>&1; then
    LATEST=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
      -H "Accept: application/vnd.github.v3+json" | \
      grep '"tag_name"' | sed 's/.*"tag_name": *"v\{0,1\}\([^"]*\)".*/\1/')
  elif command -v wget >/dev/null 2>&1; then
    LATEST=$(wget -qO- "https://api.github.com/repos/${REPO}/releases/latest" \
      --header="Accept: application/vnd.github.v3+json" | \
      grep '"tag_name"' | sed 's/.*"tag_name": *"v\{0,1\}\([^"]*\)".*/\1/')
  else
    error "curl or wget required"
  fi

  if [ -z "$LATEST" ]; then
    error "could not determine latest version"
  fi

  info "latest" "v${LATEST}"
}

# ── Download and install ───────────────────────────────────────────────

install() {
  TARBALL_URL="https://github.com/${REPO}/releases/download/v${LATEST}/wai-v${LATEST}.tar.gz"
  TMPDIR=$(mktemp -d)
  trap 'rm -rf "$TMPDIR"' EXIT

  info "download" "$TARBALL_URL"

  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$TARBALL_URL" -o "$TMPDIR/wai.tar.gz"
  else
    wget -qO "$TMPDIR/wai.tar.gz" "$TARBALL_URL"
  fi

  info "extract" "$TMPDIR"
  tar -xzf "$TMPDIR/wai.tar.gz" -C "$TMPDIR"

  # Find the binary
  WAI_BIN=$(find "$TMPDIR" -name "wai" -type f | head -1)
  if [ -z "$WAI_BIN" ]; then
    error "wai binary not found in tarball"
  fi

  mkdir -p "$INSTALL_DIR"
  cp "$WAI_BIN" "$INSTALL_DIR/wai"
  chmod +x "$INSTALL_DIR/wai"

  info "installed" "$INSTALL_DIR/wai"
}

# ── Check PATH ─────────────────────────────────────────────────────────

check_path() {
  case ":$PATH:" in
    *":$INSTALL_DIR:"*) ;;
    *)
      echo ""
      info "warning" "$INSTALL_DIR is not in your PATH"
      echo ""
      echo "  Add this to your shell profile:"
      echo ""
      echo "    export PATH=\"$INSTALL_DIR:\$PATH\""
      echo ""
      ;;
  esac
}

# ── Main ───────────────────────────────────────────────────────────────

main() {
  echo ""
  echo "  Installing wai..."
  echo ""

  check_node
  fetch_latest
  install
  check_path

  echo ""
  info "done" "wai v${LATEST}"
  echo ""
}

main
