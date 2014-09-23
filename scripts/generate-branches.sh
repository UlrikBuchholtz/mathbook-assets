#!/bin/bash

# Generates an output directory for each branch in the outputdir directory.
################################################################################
# IMPORTANT: This script must be calld from a CWD OUTSIDE the repository.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [[ $# != 1 ]]; then
    echo Specify an outputdir
    exit 0
fi

# the git repo root
gitdir=$(cd $DIR; git rev-parse --show-toplevel)
cd $gitdir 

# the output directory
output=$(readlink -m "$1")

# If there are no uncommited changes
if git diff-index --quiet HEAD --; then
    # no changes

    # cache the generate.sh file in a temp directory, 
    # since we'll be changing branches
    timestamp=$(date +%s)
    tempdir=$DIR/.temp-$timestamp
    mkdir -p $tempdir 
    cp $DIR/generate.sh $tempdir/generate.sh

    # iterate through branches 
    branches=()
    eval "$(git for-each-ref --shell --format='branches+=(%(refname:short))' refs/heads/)"
    for branch in "${branches[@]}"; do
        echo Processing $branch
        git checkout $branch 
        echo making directory $output/$branch if it does not exist.
        mkdir -p $output/$branch
        echo generating files...
        $DIR/generate.sh $output/$branch
    done

    # remove the temp directory
    rm -r $tempdir 

else
    echo There are unstaged changes. Stash or commit them first.
fi
