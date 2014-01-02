#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

output=$(readlink -m $1)

cd "$(git rev-parse --show-toplevel)"
mkdir -p $output/stylesheets
compass compile --time --css-dir=$output/stylesheets --force
cp -r js $output/js
cp -r fonts $output/fonts
cp -r images $output/images
