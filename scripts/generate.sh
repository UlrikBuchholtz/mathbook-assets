#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

output=$(readlink -m $1)
repodir="$(cd $DIR; git rev-parse --show-toplevel)"

cd $repodir 
echo Generating from $repodir
ls $repodir
mkdir -v -p $output/stylesheets
compass compile --time --css-dir=$output/stylesheets --force
cp -v -r $repodir/js $output
cp -v -r $repodir/fonts $output
cp -v -r $repodir/images $output
