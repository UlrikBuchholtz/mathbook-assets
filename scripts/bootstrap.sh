#!/bin/bash

echo "Welcome to the project!"
echo "Configuring git..."

basedir=`git rev-parse --show-toplevel`

$basedir/scripts/install-git-hooks.sh
$basedir/scripts/set-rebase-on-pull.sh

echo "Great! You're all done."
