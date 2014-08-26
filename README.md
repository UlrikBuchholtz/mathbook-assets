mathbook-assets
===============
Styles and scripts for the Mathbook platform.


Getting Started
---------------
You've just cloned the repo. What now?

1. [Install Ruby](https://www.ruby-lang.org/en/installation/), if it is not
   already installed. You may want to use [RVM](http://rvm.io/) or
   [rbenv](https://github.com/sstephenson/rbenv) so that you can use multiple
   versions of Ruby on the same machine.

2. [Install Compass](http://compass-style.org/install/).

3. Run the boostrap script from the repo's root directory. This performs local
   repository setup like initializing githooks.

        $ ./scripts/bootstrap.sh


Deploying Assets
----------------
To deploy the current state of the repository from an arbitrary directory:

    $ ./path/to/repo/scripts/generate.sh ./path/to/output

To deploy all branches from a directory **outside** the repository:

    $ ./path/to/repo/scripts/generate-branches.sh ./path/to/output

Contributing
------------
Please see the [Contributors Guidelines](CONTRIBUTING.md) before contributing
to this project.


