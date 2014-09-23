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


Using Mathbook.js
-----------------

_Note: `Mathbook.js` currently instantiates `Mathbook` automatically. 
Until that is changed, this section should be disregarded._

You can instantiate a default `Mathbook` instance as follows:
```javascript
// Mathbook must be initialized after the DOM has loaded
$(window).load( function() {
   w.mathbook = new Mathbook();
});
```

You can also pass an `options` object to the constructor. 
This overrides the `defaults` defined in [Mathbook.js](js/Mathbook.js).
For the full list of available options, see that file. 
They are (hopefully) well commented.

Here's an example of a customized `Mathbook` instance:

```javascript
$(window).load( function() {
   // Attach our instance to the window object 
   // so we can find it again
   window.mathbook = new Mathbook({
   
      selectors: {
          // Change the selector used to find section links
          sectionLinks: ".argle-bargle-link"
      },
   
      // Change the attribute used to store the hash 
      // for in-page section links
      sectionLinkHashAttribute: "data-hash",
   
      onEnterSection: function() {
          if(typeof _trackEvent === "function") {
             // push an event to google analytics
             _trackEvent("ENTER_SECTION", this.id);
          }
      },
      onExitSection: function() {
          if(typeof _trackEvent === "function") {
             // push an event to google analytics
             _trackEvent("EXIT_SECTION", this.id);
          }
      },
      
      // Tell it whether or not to only track sections that 
      // are linked from the ToC
      shouldTrackOnlyLinkedSections: false
   });
});
```

Contributing
------------
Please see the [Contributors Guidelines](CONTRIBUTING.md) before contributing
to this project.


