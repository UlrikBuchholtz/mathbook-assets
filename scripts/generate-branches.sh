#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [[ $# != 1 ]]; then
    echo Specify an outputdir
    exit 0
fi

gitdir=$(cd $DIR; git rev-parse --show-toplevel)
cd $gitdir 

output=$(readlink -m "$1")

if git diff-index --quiet HEAD --; then
    # no changes

    timestamp=$(date +%s)
    tempdir=$DIR/.temp-$timestamp

    # cache the generate.sh file since we'll be changing branches
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
