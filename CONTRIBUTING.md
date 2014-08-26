Contributor Guidelines
======================
Welcome to the project!

Below are a few guidelines that help us maintain consistency throughout the
codebase.


Semver and git-flow
-------------------
It is important that this project utilize [semantic
versioning](http://semver.org/) so that Mathbook generators can reference a
copy of these assets by version.

To achieve this, it is **highly recommended** that you use the
[git-flow](http://nvie.com/posts/a-successful-git-branching-model/) branching
model. The best way to do so is to use the [git-flow git
plugin](https://github.com/nvie/gitflow).


Githooks
--------
Be sure to run the `boostrap.sh` script after cloning the repository for the
first time. This will set up githooks that, in turn, handle installing/updating
githooks in the `scripts/githooks` directory when they are modified later.


Editor Config
-------------
Use the `.editorconfig` file included in the repository to configure 
your editor. See [editorconfig.org](http://editorconfig.org/) 
to find more information and a plugin for your editor.


JSHint
------
It's recommended that you set up JSHint. Javascript is finicky language and
it's easy to make mistakes without realizing it. Sometimes seemingly innoucous
mistakes (like placing a comma after the last property in an object) can break
your code in less forgiving browsers (*cough* IE). JSHint lints your javascript
to help you catch these mistakes before committing your code to the repository.

To install JSHint, see http://www.jshint.com/install/


Javascript Style Guide
----------------------
Follow the [Airbnb javascript style
guide](https://github.com/airbnb/javascript) with the following exceptions:

 * Use **4 spaces** for indentation

If you use the `.editorconfig` and `.jshintrc` files included in the repo, you
won't have to think about it.


Understanding SASS
------------------
This project uses the [SASS](http://sass-lang.com/) css precompiler. If you are
not familiar with SASS, don't worry, the SCSS syntax is just a strict superset
of vanilla CSS with some helpful superpowers.

Start by reading [Sass: Sass Basics](http://sass-lang.com/guide), for a quick
overview.

You should also familiarize yourself with

 * [The Almighty Ampersand](http://unakravets.tumblr.com/post/78744593423/sass-snippets-the-almighty-ampersand)
 * [Placeholder selectors](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#placeholder_selectors_)
 * [Guarded Variable Assignment](http://compass-style.org/help/tutorials/configurable-variables/) (using `!default`)


SASS Guidelines
---------------

 * Comments

    * Use `/* comment */` for comments that should be output in the CSS
    * Use `// comment` for comments that should **not** be output in the CSS

 * Variables

   * should take the dash-seperated form `$my-variable` (unfortunately, the
     standard in the SASS community)
   * should be semantic
     * i.e. `$color-primary` instead of  `$color-red`
   * should go from general to specific
     * i.e. `$link-color-hover` instead of `$hover-link-color`
   * should be defined at the top of their context (generally the file)

 * Files

   * Should use the extension `.scss`.
   * Should be prefixed with an underscore `_` if they should not be compiled
     to a CSS file directly.
   * Should be named with lower-case, dash-seperated names
     * i.e. `_my-partial-file.scss`

 * Modules

   * should be a directory containing components and partials describing a
     complete, standalone portion of an application.
   * should contain a `_module-name_config.scss` file containing `!default`
     variables used throughout the module.
   * should contain a `_module-name.scss` partial in the module root that
     imports the entire module.

 * Mixins

   * should **not** output CSS when imported.
   * should be grouped together into sets with configurable default variables
   * should be prefixed by the set name
     * i.e. `button-state-hover` and `button-icon`
   * should describe all or part of a standalone, reusable component or pattern
     that could be dropped into another project
   * should be as lightweight as possible. Let the caller decide anything that
     isn't essential to the mixin's pattern.
   * should (usually) utilize the set's default variables as parameter defaults
   * should not be overused. See "Placeholders".

 * Partials

   * **should** output CSS when they are imported.
   * should describe styles specific to this project
   * should be used to describe the way components are combined to produce the
     final product

 * Placeholders (`%placeholder-selector-name`)

   * should be defined in only one place
   * should occur only in partials
   * can be used to reduce the total CSS output of mixins. 
     If a mixin is used with the same parameters in more than one place, 
     consider `@include`ing the mixin in a placeholder and `@extend`ing the 
     placeholder instead. Here's an example:

     Bad:
         
          // Both of these call the mixin with the same parameters.
          // This results in double the CSS.
          .my-selector-1 {
            @include my-mixin(a,b);
          }
          
          .my-selector-2 {
             @include my-mixin(a,b);
          }

     Good:
     
          // With the placeholder selector, 
          // they will be added to a comma-seperated list in the CSS output
          %my-thingy-a-b {
           @include my-mixin(a, b); 
          }
          
          .my-selector-1 {
            @extend %my-thingy-a-b;
          }
          
          .my-selector-2 {
             @extend %my-thingy-a-b;
          }
         
      Also good:
        
          // These use different parameters, so it's okay to create more CSS output.
          // They generate only as much CSS as is necessary.
          .my-selector-1 {
            @include my-mixin(a,b);
          }
          
          .my-selector-2 {
             @include my-mixin(c,d);
          }
          
      That said, don't worry too much about this.


Compass
-------
[Compass](http://compass-style.org/) is a toolkit built on top of SASS. It
offers SASS mixins for common patterns and provides a CLI for compiling SASS
and installing dependencies (we won't use it for dependencies though). See the
[Compass reference documentation](http://compass-style.org/reference/compass/)
for available modules and mixins.

Compass configuration lives in `config.rb`. See the [Compass Config
Reference](http://compass-style.org/help/documentation/configuration-reference/)
for more info.

You can use `compass compile` or `compass watch` to compile the scss to the
output directory specified in the config.rb. `compass watch` simply watches for
changes and re-compiles automatically.

You can find the full list of Compass commands
[here](http://compass-style.org/help/tutorials/command-line/).


Vertical Rhythm
---------------
**DO NOT** break the vertical rhythm!

*This is the most important part of the design!*

Humans are hard-wired to seek patterns and repetition. In typography,
**vertical rhythm** refers to the consistent vertical spacing of text and other
block-level content. When the spacing is derived from multiples of the text's
base line-height the reader can easily find the next line of text. A consistent
rhythm throughout, lends a feeling of balance and structure to the design.

In this project, we utilize the [Compass Vertical Rhythm
module](http://compass-style.org/reference/compass/typography/vertical_rhythm/)
to manage the vertical rhythm. You can access it simply by importing our own
`_typography.scss` module:

    @import "[path/to/]shared/typography";


### Follow these very important rules:

 * **Use the vertical rhythm mixins and functions to define all vertical
   margins/padding/borders.**

   * These round the `$lines` parameter to the nearest full or half line,
     depending on the value of the variable `$round-to-nearest-half-line`
     (set in the main `_config.scss` file).
  * The mixins then set the margin/padding/border correctly
    (with the units defined in `$rhythm-unit`) using the given font-size.

 * **Use our `typography-heading-size()` mixin to set the font size of headings.**

    * This sets the correct leader and trailer for headings.

 * **Use `adjust-font-size-to()` to adjust all other font sizes.**

    * This adjusts the font-size *and* the line-height to ensure alignment
      with the vertical rhythm.

### Notes

* It is acceptable for the `height` of tables, figures, and mathematical
  equations to break from the vertical rhythm as long as the vertical rhythm is
  re-established by their margins.
* While it is not essential that you derive horizontal spacing from the
  vertical rhythm, it often provides a comforting sense of symmetry between the
  vertical and horizontal margins. Either way, you should strive to keep the
  horizontal margins consistent throughout.


Need Help?
----------
Contact [Michael DuBois](mailto:michael@michaeldubois.com)
