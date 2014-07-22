var $ = jQuery;
var Mathbook = function(options) {

    var settings = $.extend({
    }, options);


    // Private vars
    // -------------------------------------------------------------------------
    // "el" is a common shortening of element
    // ...but the spanish reference here is amusing too.
    var EL_PRIMARY_NAVBAR = ".navbar";
    var EL_TOC = ".navbar";
    var EL_GOTO_TOP_LINK = ".goto-top-link"; // Doesn't exist, but whatever

    var PREFIX = "mathbook";
    var LOADING_CLASS = PREFIX + "-loading";
    var LOADED_CLASS = PREFIX + "-loaded";

    // SIDEBAR SETTINGS
    var SIDEBAR_TOGGLE_DURATION = .4; // seconds
    var TOGGLE_BUTTON_ACTIVE_CLASS = "active";
    var HAS_SIDEBAR_LEFT_CLASS = "has-sidebar-left";
    var HAS_SIDEBAR_RIGHT_CLASS = "has-sidebar-right";
    var SIDEBAR_OPEN_CLASS = "open";
    var SIDEBAR_CLOSED_CLASS = "closed";
    var MAIN_LEFT_OPEN_CLASS = "sidebar-left-open";
    var MAIN_LEFT_CLOSED_CLASS = "sidebar-left-closed";
    var MAIN_RIGHT_OPEN_CLASS = "sidebar-right-open";
    var MAIN_RIGHT_CLOSED_CLASS = "sidebar-right-closed";
    // Ratio that sidebar must open before it will finish opening itself.
    var SIDEBAR_INERTIA_THRESHOLD_RATIO = .2;
    // Number of pixels touchpoint must move horizontally before is swipe
    var SWIPE_THRESHOLD = 30;
    // Number of pixels touchpoint must move vertically before is scroll
    var SCROLL_THRESHOLD = 30;
    // Pixels distance from edge of screen that is considered edge for touch
    var TOUCH_SCREEN_EDGE_FUDGE = 5;

    var that = this;
    var hashOnLoad;
    var isLayoutInitialized = false;
    var scrollingNav = null;

    this.$w = $(window);

    /**
     * Constructor for Layout objects that hold configurations for different
     * widths.
     * @param {String} debugName
     * @param {Number} minWidth
     * @param {Function} onEnter
     * @param {Function} onExit
     */
    var Layout = function(options) {
        this.minWidth = options.minWidth;
        this.debugName = options.debugName;
        this.onEnter = options.onEnter;
        this.onExit = options.onExit;

        /**
         * Called when a Layout is applied.
         */
        this.enter = function() {
            console.log("Entered Layout: " + this.debugName);
            if(typeof this.onEnter === "function") {
                this.onEnter.apply(this, arguments);
            }
        };

        /**
         * Called when a Layout is removed
         */
        this.exit = function() {
            console.log("Exited Layout: " + this.debugName);
            if(typeof this.onExit === "function") {
                this.onExit.apply(this, arguments);
            }
        };
    }

    // LAYOUT DEFINITIONS
    // IMPORTANT: MUST MATCH MEDIA QUERIES IN CSS!!! 
    // Try to keep layout onEnter functions declarative in nature
    var layouts = {
        // Since layouts rely on the minWidth, add one pixel
        SMALL : new Layout({
            debugName: "small", 
            minWidth: 0,
            onEnter: function(){
                maxOpenSidebars = 1;
                that.toggleSidebarLeft(false);
                that.toggleSidebarRight(false);
                that.shouldSidebarsPush(true);
                
                // with primary nav on bottom
                that.initializeStickies(true);
            }
        }),
        MEDIUM : new Layout({
            debugName: "medium", 
            minWidth: 769, 
            onEnter: function() {
                maxOpenSidebars = 1;
                that.toggleSidebarLeft(true);
                that.toggleSidebarRight(false);
                that.shouldSidebarsPush(false);

                that.initializeStickies(false);
            }
        }),
        LARGE : new Layout({
            debugName: "large", 
            minWidth: 1200, 
            onEnter: function() {
                maxOpenSidebars = 2;
                that.toggleSidebarLeft(true);
                that.toggleSidebarRight(true);
                that.shouldSidebarsPush(false);

                that.initializeStickies(false);
            }
        })
    };
    var currentLayout = layouts.LARGE;

    // Methods
    // -----------------------------------------------------------------

    /**
     * Initialize this object.
     */
    this.initialize = function() {
        hashOnLoad = location.hash;
        this.cacheDOMObjects();
        this.$body.addClass(LOADING_CLASS);
        this.initializeSidebars();
        this.$w.resize(function() { that.resize(); });

        // Set up sticky navigation and section tracking.
        this.initializeStickies();
        // this.intializeSectionTracking();

        this.setMathJaxOverrides();

        this.resize();
        this.$body.addClass(LOADED_CLASS);
        this.$body.removeClass(LOADING_CLASS);
    };

    /**
     * Caches all the DOM Objects we need, with JQuery
     */
    this.cacheDOMObjects = function() {
        this.$body = $("body");
        this.$w = $(window);

        this.$main = $(".main").first();
        this.$content = $("#content");

        this.$primaryNavbar = $("#primary-navbar").first();
        this.$secondaryNavbar = $("#secondary-navbar").first();
        this.$secondaryNavbarNext = 
            this.$secondaryNavbar.find(".next-button").first();
        this.$secondaryNavbarPrevious = 
            this.$secondaryNavbar.find(".previous-button").first();

        this.$sidebarRight = $("#sidebar-right");
        this.$sidebarLeft = $("#sidebar-left");
        this.$toc = $("#toc");
        this.$sidebarLeftExtras = 
            this.$sidebarLeft.find(".extras").first();

        this.$sidebarLeftToggle = $("#sidebar-left-toggle-button");
        this.$sidebarRightToggle = $("#sidebar-right-toggle-button");
    };

    /**
     * Initializes SidebarViews and registers listeners
     */
    this.initializeSidebars = function() {
        var that = this;

        // Add sidebar right open classes before GSAP can screw up
        // the addClass functionality on $main
        //if(this.hasSidebarRight()) {
            //this.$main.addClass(MAIN_RIGHT_OPEN_CLASS);
            //this.$sidebarRight.addClass(SIDEBAR_OPEN_CLASS);
        //}

        if(this.hasSidebarLeft()) {
            //this.$sidebarLeft.addClass(SIDEBAR_OPEN_CLASS);
            //this.$main.addClass(MAIN_LEFT_OPEN_CLASS);
            this.sidebarLeftView = new SidebarView({
                debugName: "sidebarLeftView",
                toggleDuration:SIDEBAR_TOGGLE_DURATION,
                toggleButton: this.$sidebarLeftToggle,
                sidebar: this.$sidebarLeft,
                sidebarOpenClass: SIDEBAR_OPEN_CLASS,
                sidebarClosedClass: SIDEBAR_CLOSED_CLASS,
                main: this.$main,
                mainOpenClass: MAIN_LEFT_OPEN_CLASS,
                mainClosedClass: MAIN_LEFT_CLOSED_CLASS
            });

            // Toggle button click handler
            this.$sidebarLeftToggle.on('click', function() { 
                that.toggleSidebarView(that.sidebarLeftView)
            });
        } else {
            // Ensure the CSS behaves appropriately
            this.$body.removeClass(HAS_SIDEBAR_LEFT_CLASS);
        }

        if(this.hasSidebarRight()) {
            this.sidebarRightView = new SidebarView({
                debugName: "sidebarRightView",
                toggleDuration:SIDEBAR_TOGGLE_DURATION,
                toggleButton: this.$sidebarRightToggle,
                sidebar: this.$sidebarRight,
                sidebarOpenClass: SIDEBAR_OPEN_CLASS,
                sidebarClosedClass: SIDEBAR_CLOSED_CLASS,
                main: this.$main,
                mainOpenClass: MAIN_RIGHT_OPEN_CLASS,
                mainClosedClass: MAIN_RIGHT_CLOSED_CLASS
            });

            // Toggle button click handler
            this.$sidebarRightToggle.on('click', function() {
                that.toggleSidebarView(that.sidebarRightView)
            });
        } else {
            // Ensure the CSS behaves appropriately
            this.$body.removeClass(HAS_SIDEBAR_RIGHT_CLASS);
        }
        
        if(this.hasSidebarRight() || this.hasSidebarLeft()) {
            this.touchController = new TouchController({
                content: this.$content,
                sidebarLeftView: this.sidebarLeftView,
                sidebarRightView: this.sidebarRightView,
                screenEdgeFudge: TOUCH_SCREEN_EDGE_FUDGE,
                inertiaThresholdRatio: SIDEBAR_INERTIA_THRESHOLD_RATIO,
                swipeThreshold: SWIPE_THRESHOLD,
                scrollThreshold: SCROLL_THRESHOLD
            });
        }

    };

    /**
     * Toggles the left sidebar to the shouldOpen state 
     * or the reverse of the current state if shouldOpen is undefined.
     * @param shouldOpen {Boolean}
     */
    this.toggleSidebarLeft = function(shouldOpen) {
        if(this.hasSidebarLeft()) {
            this.toggleSidebarView(this.sidebarLeftView, shouldOpen);
        }
    };

    /**
     * Toggles the right sidebar to the shouldOpen state
     * or the reverse of the current state if shouldOpen is undefined.
     * @param shouldOpen {Boolean}
     */
    this.toggleSidebarRight = function(shouldOpen) {
        if(this.hasSidebarRight()) {
            this.toggleSidebarView(this.sidebarRightView, shouldOpen);
        }
    };

    /**
     * Toggles the given sidebarView to the given shouldOpen state
     * or the reverse of the current state if shouldOpen is undefined.
     * @param sidebarView {SidebarView} 
     * @param shouldOpen {Boolean}
     */
    this.toggleSidebarView = function(sidebarView, shouldOpen) {
        console.log("Toggling " + sidebarView.debugName);
        sidebarView.toggle(shouldOpen);
    };

    /**
     * Returns true if the left sidebar is present in HTML 
     */
    this.hasSidebarLeft = function() {
        // To be safe, we'll require everything
        return this.$sidebarLeft.size() > 0
            && this.$sidebarLeftToggle.size() > 0
            && this.$main.size() > 0;
    };

    /**
     * Returns true if the right sidebar is present in HTML
     */
    this.hasSidebarRight = function() {
        // To be safe, we'll require everything
        return this.$sidebarRight.size() > 0
            && this.$sidebarRightToggle.size() > 0
            && this.$main.size() > 0;
    };

    /**
     * Returns true if left sidebar is closed or not present
     */
    this.isSidebarLeftClosed = function() {
        var isClosed = 
            !that.hasSidebarLeft()
            || that.sidebarLeftView.isClosed();
        return isClosed;
    };


    /**
     * Returns true if the right sidebar is closed or not present.
     */
    this.isSidebarRightClosed = function() {
        var isClosed = 
            !that.hasSidebarRight()
            || that.sidebarRightView.isClosed();
        return isClosed;
    };

    /** 
    * By default, MathJax scrolls the window to the hash location
    * after "End Typeset" event. We need to override this functionality
    * so things work nicely with our sticky header
    */
    this.setMathJaxOverrides = function() {
        // Before MathJax applies the page's configuration
        MathJax.Hub.Register.StartupHook("Begin Config", function() {
            // Modify that configuration to apply overrides
            MathJax.Hub.Config({
                positionToHash: false
            });
        });
        
        // when Mathjax is finished rendering, 
        MathJax.Hub.Register.StartupHook("End Typeset", function () {
            // we handle the hash positioning so that it lines up
            // nicely with our fixed header 
            //scrollingNav.scrollToSection(hashOnLoad.substr(1));
            // TODO expand knowl from hash if there's a match?        
        });
    };


    /**
     * Initializes the sticky navigation
     */
    this.initializeStickies = function(isPrimaryNavbarBottom) {

        var primaryNavbarHeight = this.$primaryNavbar.outerHeight();

        this.$primaryNavbar.unstick();
        this.$secondaryNavbarNext.unstick();
        this.$secondaryNavbarPrevious.unstick();

        // Stick navbar stuff
        if(!isPrimaryNavbarBottom){
            this.$primaryNavbar.sticky({
                className: "stuck",
                wrapperClassName:"navbar",
                topSpacing: 0,    
            });

            this.$secondaryNavbarNext.sticky({
                topSpacing:primaryNavbarHeight,
                wrapperClassName: "next-button-sticky-wrapper"
            });

            this.$secondaryNavbarPrevious.sticky({
                topSpacing:primaryNavbarHeight,
                wrapperClassName: "previous-button-sticky-wrapper"
            });
            
            // Update the position in case scroll is already below
            // the stickyifying point
            this.$primaryNavbar.sticky("update");
            this.$secondaryNavbarNext.sticky("update");
            this.$secondaryNavbarPrevious.sticky("update");
        }

        // Stick left sidebar
        if(this.hasSidebarLeft()) {
            this.$sidebarLeft.unstick();

            // If primaryNavbar is top, offset sidebar by it's height,
            // else offset zero 
            var sidebarLeftTopSpacing = 
                isPrimaryNavbarBottom ? 0 : primaryNavbarHeight;

            this.$sidebarLeft.sticky({
                className: "stuck",
                wrapperClassName:"sidebar",
                topSpacing : sidebarLeftTopSpacing
            });

            // Update the position in case scroll is already below
            // the stickyifying point
            this.$sidebarLeft.sticky("update");
        }
    };

    /**
     * Initializes section tracking in the nav based on scrollTop
     */
    this.initializeSectionTracking = function() {
        // TODO rework into a sensible jquery plugin
        //scrollingNav = new ScrollingNav({
            //header:EL_PRIMARY_NAVBAR,
            //nav:EL_TOC,
            //topLink:EL_GOTO_TOP_LINK,
            //viewOffset: 100,
            //anchorAttr: 'id',
            //speed: 300,
            //trackSections: false, // we'll enable this when ready
            //positionToHash: false, // we'll handle this
            //initWithPlaceholder: false,
            //onLoad: function() { that.onStickyNavLoaded() }
        //});
    };

    /**
     * Called when the browser resizes
     */
    this.resize = function() {
        var navbarHeight, 
            viewportHeight, 
            newLayout;

        var windowWidth = this.$w.width();
        var windowHeight = this.$w.height();

        // Update the layout if necessary
        newLayout = that.findLayout(windowWidth);
        if(!isLayoutInitialized || newLayout !== currentLayout) {
            isLayoutInitialized = true;
            that.setLayout(newLayout);
        }

        // set toc height to fill window
        navbarHeight = this.$primaryNavbar.outerHeight();
        viewportHeight = windowHeight - navbarHeight;

        this.resizeContent(viewportHeight);
        this.resizeToc(viewportHeight);
        this.resizeSecondaryNav(viewportHeight);
    };

    /**
     * Fixes the minHeight of the content
     */
    this.resizeContent = function(viewportHeight) {
        // Force the content to be at least as tall as the viewport.
        this.$content.css({'minHeight': viewportHeight });
    };

    /**
     * Fixes the height of the ToC
     */
    this.resizeToc = function(viewportHeight) {
        // The height of the left sidebar extras box if it exists
        var extrasHeight = 0;
        if(this.$sidebarLeftExtras.size() != 0) {
            extrasHeight = this.$sidebarLeftExtras.outerHeight();
        }

        // Force the toc to fill whatever space remains in sidebar 
        // ...but leave room for an "extras" box if it exists
        var tocHeight = viewportHeight - extrasHeight;
        this.$toc.height(tocHeight);
    };

    /**
     * Ensure that bottom navbar matches main element's width
     */
    this.resizeSecondaryNav = function(viewportHeight) {
        //this.$secondaryNavbar.width(this.$main.outerWidth());
        this.$secondaryNavbarNext.height(viewportHeight);
        this.$secondaryNavbarPrevious.height(viewportHeight);
    };


    /**
     * Sets whether sidebars should push or slide when opening.
     * Push fixes the width of the main content and moves it aside.
     * Slide subtracts the sidebar's width from the main width.
     *
     * @param shouldPush {Boolean} true to push, false to slide
     */
    this.shouldSidebarsPush = function(shouldSidebarsPush) {
        console.log("shouldSidebarsPush? " + shouldSidebarsPush);
        var that = this;
        
        // TODO track current state? getter if no parameter?
        var onStart = null;
        var onReverseComplete = null;

        if(shouldSidebarsPush) {
            onStart = function() {
               that.lockMainWidth();
            }; 
            onReverseComplete = function() {
                if(that.isSidebarRightClosed() 
                    && that.isSidebarLeftClosed()) 
                {
                    that.unlockMainWidth();
                } else {
                    console.log("Trying to unlock width, but a sidebar is open.");
                    console.log("sidebarLeftView.progress(): " 
                            + that.sidebarLeftView.progress());
                    console.log("sidebarRightView.progress(): " 
                            + that.sidebarRightView.progress());
                }
            };
        } else {
            // Make sure it's not currently locked.
            this.unlockMainWidth();
        }

        if(this.hasSidebarLeft()) {
            this.sidebarLeftView
                .eventCallback("onStart", onStart);
            this.sidebarLeftView
                .eventCallback("onReverseComplete", onReverseComplete);
        }

        if(this.hasSidebarRight()) {
            this.sidebarRightView
                .eventCallback("onStart", onStart);
            this.sidebarRightView
                .eventCallback("onReverseComplete", onReverseComplete);
        }
    }

    /**
     * Locks the main element at it's current width
     */
    this.lockMainWidth = function() {
        console.log("locking width");
        this.$main.width(this.$main.width());
    };

    /**
     * Unlocks the main element width
     */
    this.unlockMainWidth = function() {
        console.log("unlocking width");
        this.$main.width("");
    };

    /**
     * Returns the correct layout for given browser width
     * @param width {Number} browser width
     * @return {Layout} the layout to apply
     */
    this.findLayout= function(width) {
        var newLayout = null;
        for (var property in layouts) {
            if (layouts.hasOwnProperty(property)) {
                var layout = layouts[property]
                // If current width is in layout range
                // and layout.minwidth is bigger than any other match
                if(width >= layout.minWidth 
                        && (newLayout == null 
                            || layout.minWidth > newLayout.minWidth)) 
                {
                    // then this is our best match yet.
                    newLayout = layout;
                } 
            }
        }
        return newLayout;
    }

    /**
     * Sets the current layout
     * @param newLayout {Layout} the layout to apply
     */
    this.setLayout = function(newLayout) {
        if(newLayout.constructor !== Layout) {
            throw new Error(
                    "setLayout::newLayout must be of type Layout");
        }
        console.log("Changing layout to " + newLayout.debugName);

        currentLayout.exit();
        newLayout.enter();

        currentLayout = newLayout;
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


