#!/usr/bin/env bash
set -o errexit

STORAGE_DIR=/opt/render/project/.render

if [[ ! -d "$STORAGE_DIR/chrome" ]]; then
  mkdir -p "$STORAGE_DIR/chrome"
  cd "$STORAGE_DIR/chrome"

  wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  dpkg -x google-chrome-stable_current_amd64.deb .
fi