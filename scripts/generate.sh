#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Generates the current state of the repo into the given output directory 
################################################################################

output=$(readlink -m $1)
repodir="$(cd $DIR; git rev-parse --show-toplevel)"

cd $repodir 
echo Generating from $repodir
mkdir -p $output
cp -v -r $repodir/js $output
cp -v -r $repodir/stylesheets $output
cp -v -r $repodir/images $output
compass compile --time --css-dir=$output/stylesheets --force
