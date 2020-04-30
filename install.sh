#!/bin/bash
# Copyright 2013 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

set -e

DIR="$( cd "$( dirname "$0" )" && pwd )"
if [ $(uname -s) == 'Darwin' ]; then
  echo This is not for MAC
else
  if [ "$(whoami)" == "root" ]; then
    TARGET_DIR="/etc/opt/chrome/native-messaging-hosts"
  else
    if [ -x "$HOME/.config/google-chrome-beta" ]; then
      TARGET_DIR="$HOME/.config/google-chrome-beta/NativeMessagingHosts"
    else
      TARGET_DIR="$HOME/.config/chrome/NativeMessagingHosts" # replace chrome with your browser name eg: vivaldi
    fi
  fi
fi

HOST_NAME=com.initiated.chrome_libnotify_notifications

# Create directory to store native messaging host.
mkdir -p $TARGET_DIR

# Copy native messaging host manifest.
cp "$DIR/$HOST_NAME.json" "$TARGET_DIR"

# Update host path in the manifest.
HOST_PATH=$DIR/invoke_notify
ESCAPED_HOST_PATH=${HOST_PATH////\\/}
sed -i -e "s/HOST_PATH/$ESCAPED_HOST_PATH/" $TARGET_DIR/$HOST_NAME.json

# Set permissions for the manifest so that all users can read it.
chmod o+r $TARGET_DIR/$HOST_NAME.json

echo Native messaging host $HOST_NAME has been installed.
