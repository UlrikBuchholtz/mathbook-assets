FCLA Styles
===========
Styling for Rob Beezer's First Course In Linear Algebra.

Getting Started
---------------
You've just cloned the repo and you're at a loss for what to do... 

Start by installing Compass: http://compass-style.org/install/

Then run the boostrap script from the repo root directory:
    $ ./scripts/bootstrap.sh

SASS / Compass
--------------
This project uses the [SASS](http://sass-lang.com/) css precompiler and [Compass](http://compass-style.org/) CSS Authoring Framework. If you are a designer and you are not familiar with SASS, don't worry, it is absolutely worth learning to use it.

To compile SASS scss files to css:

    $ compass compile [path/to/project]

To watch the scss directory for changes and automatically compile:

    $ compass watch [path/to/project]
You might want to use a [tmux](http://tmux.sourceforge.net/) tab for this so you can keep using your terminal 
for other things.

You can find the full list of Compass commands [here](http://compass-style.org/help/tutorials/command-line/).

Generating the FCLA HTML
------------------------
Okay. You're all set up and you want to start working, but how do you get the
FCLA html? Well, there's a script for that. Before you run the script, though,
you'll need a copy of the FCLA xml source and the `flca2html.xsl` transform 
file.

Then, from the repo root, run:

    $ ./scripts/flca-gen.sh

The script will walk you through generating a `.flca-gen-config` file, which is
ignored by git. When you're all done, it will generate the fcla html files in 
`gen/fcla` (note that `gen` is listed in our `.gitignore`).

Need Help?
----------
Contact
* [Michael DuBois](mailto:michael@michaeldubois.com)
