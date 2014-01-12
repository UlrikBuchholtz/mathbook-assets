#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

output=$(readlink -m $1)
repodir="$(cd $DIR; git rev-parse --show-toplevel)"

cd $repodir 
echo Generating from $repodir
ls $repodir
cp -v -r $repodir/js $output
cp -v -r $repodir/stylesheets $output
cp -v -r $repodir/images $output
compass compile --time --css-dir=$output/stylesheets --force
