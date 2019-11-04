# -*- python -*-

import fnmatch
import os

env = Environment()

matches = []
for root, dirnames, filenames in os.walk('scss'):
    for filename in fnmatch.filter(filenames, '*.scss'):
        matches.append(os.path.join(root, filename))

env.Command(['build/mathbook-gt.css', 'build/lib/ionicons/ionicons.css'],
            matches,
            'compass compile --time --css-dir=build --force')
