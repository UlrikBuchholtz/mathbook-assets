#!/bin/bash

basedir=`git rev-parse --show-toplevel`
git_hooks_source=$basedir/scripts/git-hooks
git_hooks_dest=$basedir/.git/hooks

for filename in `ls $git_hooks_source`; do
    ln -s -f "$git_hooks_source/$filename" "$git_hooks_dest/$filename";
done
