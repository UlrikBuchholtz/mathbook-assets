var $ = jQuery;
var Mathbook = function(options) {

    var settings = $.extend({
        }, options);


    // Private vars
    // -------------------------------------------------------------------------
    var NAVBAR_SELECTOR = "#navbar";
    var TOP_LINK_SELECTOR = "#navbar .top-link";
    var TOC_SELECTOR = "#toc";

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

        $w.resize(that.resize);

        that.initScrollingNav();

        // TODO expand/MathJax process knowl from hashOnLoad if necessary
    };

    this.initScrollingNav = function() {

        scrollingNav = new ScrollingNav({
            header: NAVBAR_SELECTOR,
            nav: TOC_SELECTOR,
            topLink: TOP_LINK_SELECTOR,
            viewOffset: 50,
            anchorAttr: 'id',
            speed: 300,
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
            $toc.height(windowHeight - navbarHeight);
        }
    };

    // Run init when we are constructed
    this.init();
};

// init when the document is ready
$(document).ready( function() {
    var mathbook = new Mathbook({
    });
});
