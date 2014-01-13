var $ = jQuery;
var Mathbook = function(options) {

    var settings = $.extend({
        }, options);


    // Private vars
    // -------------------------------------------------------------------------
    var NAVBAR_SELECTOR = "#navbar";
    var TOP_LINK_SELECTOR = "#navbar .top-link";
    var TOC_SELECTOR = "#toc";
    var CONTENT_SELECTOR = "#content";

    var that = this;
    var hashOnLoad;
    var scrollingNavLoaded = false;
    var $w = $(window);
    var scrollingNav = null;
    var $navbar = null;

    // Public vars
    // -------------------------------------------------------------------------
    

    // Methods
    // -------------------------------------------------------------------------
    this.init = function() {
        hashOnLoad = location.hash;
        
        // Cache element references
        $navbar = $(NAVBAR_SELECTOR);
        $toc = $(TOC_SELECTOR);
        $content = $(CONTENT_SELECTOR);

        $w.resize(that.resize);

        that.initScrollingNav();
        scrollingNav.enableSectionTracking();

        // By default, MathJax scrolls the window to the hash location
        // after "End Typeset" event. We need to override this functionality

        // Override MathJax positionToHash configuration
        MathJax.Hub.Register.StartupHook("Begin Config", function() {
            MathJax.Hub.Config({
                positionToHash: false
            });
        });
        
        // when Mathjax is finished rendering
        MathJax.Hub.Register.StartupHook("End Typeset", function () {
            console.log("MathJax End Typeset");

            // we handle the hash positioning so that it lines up
            // nicely with our fixed header 
            scrollingNav.scrollToSection(hashOnLoad.substr(1));
            // TODO expand/MathJax process knowl from hashOnLoad if necessary
        });

    };

    this.initScrollingNav = function() {

        scrollingNav = new ScrollingNav({
            header: NAVBAR_SELECTOR,
            nav: TOC_SELECTOR,
            topLink: TOP_LINK_SELECTOR,
            viewOffset: 100,
            anchorAttr: 'id',
            speed: 300,
            trackSections: false, // we'll enable this when ready
            positionToHash: false, // we'll handle this
            onLoad: that.onScrollingNavLoaded
        });
    };

    this.onScrollingNavLoaded = function() {
        scrollingNavLoaded = true;
        that.resize();
    };

    this.resize = function() {
        // If scrollingNav successfully loaded
        if(scrollingNavLoaded) {
            // set toc height to fill window
            var navbarHeight = $navbar.outerHeight();
            var windowHeight = $w.height();
            var viewportHeight = windowHeight - navbarHeight;

            $toc.height(viewportHeight);
            $content.css({'minHeight': viewportHeight });

            // Set view offset to ratio of viewport height
            // if(scrollingNav) {
            //     scrollingNav.setViewOffset(viewportHeight / 4);
            // }
        }
    };


    // Run init when we are constructed
    this.init();
};

// init when the window is loaded
$(window).load( function() {
    console.log("Window loaded");
    var mathbook = new Mathbook({
    });
});


