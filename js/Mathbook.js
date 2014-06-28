var $ = jQuery;
var Mathbook = function(options) {

    var settings = $.extend({
    }, options);


    // Private vars
    // -------------------------------------------------------------------------
    var NAVBAR_SELECTOR = "#navbar";
    var TOP_LINK_SELECTOR = "#navbar .top-link";
    var TOC_SELECTOR = "#toc";
    var TOC_BUTTON_SELECTOR = "#toc-navbar-item .navbar-item-text";
    var CONTENT_SELECTOR = "#content";

    var TOC_CLASS_OPEN = "toc-open";
    var TOC_CLASS_CLOSED = "toc-closed";

    var that = this;
    var hashOnLoad;
    var scrollingNavLoaded = false;
    var $body;
    var $w = $(window);
    var scrollingNav = null;
    var $navbar = null;

    // Constructor for layouts at different sizes
    var Layout = function(debugName, minWidth, isTocOpen) {
        this.minWidth = minWidth;
        this.isTocOpen = isTocOpen;
        this.debugName = debugName;
    }
    // IMPORTANT: LAYOUTS MUST MATCH MEDIA QUERIES IN CSS!!! 
    var layouts = Object.freeze({
        // Since layouts rely on the minWidth, add one pixel
        SMALL : new Layout("small", 0, false),
        LARGE : new Layout("large", 769, true),
    });
    var currentLayout = layouts.LARGE;
    var isTocOpen = true;

    // Public vars
    // -------------------------------------------------------------------------
    

    // Methods
    // -------------------------------------------------------------------------
    this.initialize = function() {
        hashOnLoad = location.hash;
        
        // Cache element references
        $body = $("body");
        $navbar = $(NAVBAR_SELECTOR);
        $toc = $(TOC_SELECTOR);
        $content = $(CONTENT_SELECTOR);
        $tocButton = $(TOC_BUTTON_SELECTOR);

        $w.resize(that.resize);

        that.initScrollingNav();
        scrollingNav.enableSectionTracking();

        // Enact current layout
        that.changeLayout( that.findLayout($w.width()) );

        // Toggle toc when clicking on toc button
        $tocButton.on('click', function() { that.toggleToc(); });

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

    this.initializeSlidingToc = function() {
        if(typeof enquire !== "undefined") {
            enquire.register("screen and (min-width:"+(tocBreakpoint+1)+"px)",
                             that.openToc);
            enquire.register("screen and (max-width:"+tocBreakpoint+")",
                             that.closeToc);
        }
    };

    this.onScrollingNavLoaded = function() {
        scrollingNavLoaded = true;
        that.resize();
    };

    this.resize = function() {
        var navbarHeight, 
            viewportHeight, 
            newLayout;

        var windowWidth = $w.width();
        var windowHeight = $w.height();

        // If scrollingNav successfully loaded
        if(scrollingNavLoaded) {
            // set toc height to fill window
            navbarHeight = $navbar.outerHeight();
            viewportHeight = windowHeight - navbarHeight;

            // Force the toc to be exactly as tall as viewport
            $toc.height(viewportHeight);
            // Force the content to be at least as tall as the viewport.
            $content.css({'minHeight': viewportHeight });

            newLayout = that.findLayout(windowWidth);
            if(newLayout !== currentLayout) {
                that.changeLayout(newLayout);
            }

            // Set view offset to ratio of viewport height
            // if(scrollingNav) {
            //     scrollingNav.setViewOffset(viewportHeight / 4);
            // }
        }
    };

    // Returns the correct layout for given width
    this.findLayout= function(width) {
        var newLayout = null;
        for (var property in layouts) {
            if (layouts.hasOwnProperty(property)) {
                var layout = layouts[property]
                // If current width is in layout range
                // and layout.minwidth is bigger than any other match
                    console.log("width:" + width + ", layout.minWidth:" + layout.minWidth);
                if(width >= layout.minWidth 
                        && (newLayout == null 
                            || layout.minWidth > newLayout.minWidth)) 
                {
                    // then this is our best match yet.
                    newLayout = layout;
                    console.log("Best layout so far is " + newLayout.debugName);
                } else {
                    console.log("Rejecting layout" + layout.debugName);
                }
            }
        }
        return newLayout;
    }

    // Changes to the given layout
    this.changeLayout = function(newLayout) {
        if(newLayout.constructor !== Layout) {
            throw new Error("changeLayout requires a paramater of type Layout");
        }

        console.log("Changing layout to " + newLayout.debugName);

        if(newLayout.isTocOpen) {
            that.toggleToc(true);
        } else {
            that.toggleToc(false);
        }

        currentLayout = newLayout;

    };

    // Toggles the state of the toc
    // @param toggleOpen - if set, toggles state to open/close for true/false
    this.toggleToc = function(toggleOpen) {
        if(typeof toggleOpen === "undefined") {
            toggleOpen = !isTocOpen;
        }

        console.log("Toggling toc to " + (toggleOpen ? "open" : "closed"));

        if(toggleOpen) {
            isTocOpen = true;
            $body.removeClass(TOC_CLASS_CLOSED);
        } else {
            isTocOpen = false;
            $body.addClass(TOC_CLASS_CLOSED);
        }
    }

    // Computes the scroll bar width
    // Should return zero for iOS and other systems that overlay the bars
    this.computeScrollbarWidth = function() {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);        

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    };


    // Run init when we are constructed
    this.initialize();
};

// If script is run after page is loaded, initialize immediately
if(document.readyState === "complete") {
    mathbook = new Mathbook({});
} else {
    // wait and init when the window is loaded
    $(window).load( function() {
        console.log("Window loaded");
        mathbook = new Mathbook({});
    });
}


