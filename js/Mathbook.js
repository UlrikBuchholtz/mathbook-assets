var $ = jQuery;
var Mathbook = function(options) {

    var settings = $.extend({
    }, options);

    var DEBUG = false;
    // debug performs VERY slowly on mobile devices,
    // so it's very important that we don't log things in production code
    var debug = function() {
        if(options.debug || DEBUG) {
            console.log.apply(console, arguments);
        }
    }


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
    var TOGGLE_BUTTON_INACTIVE_CLASS = "";
    var HAS_SIDEBAR_LEFT_CLASS = "has-sidebar-left";
    var HAS_SIDEBAR_RIGHT_CLASS = "has-sidebar-right";
    var SIDEBAR_LEFT_OPEN_CLASS = "sidebar-left-open";
    var SIDEBAR_LEFT_CLOSED_CLASS = "sidebar-left-closed";
    var SIDEBAR_RIGHT_OPEN_CLASS = "sidebar-right-open";
    var SIDEBAR_RIGHT_CLOSED_CLASS = "sidebar-right-closed";

    var that = this;
    var hashOnLoad;
    var isLayoutInitialized = false;
    var _shouldSidebarsPush = false;
    var scrollingNav = null;
    var hasSidebarLeft, 
        hasSidebarRight, 
        isSidebarLeftClosed, 
        isSidebarRightClosed;

    this.$w = $(window);

    /** 
     * Constructor for ToggleView objects
     * These can be used for both toggle buttons and sidebars
     */
    var ToggleView = function(options) {

        var defaults = {
            isActive: false
        };

        var settings;

        this.initialize = function(options) {
            settings = defaults;
            this.reset(options);
        }

        // Private vars

        this.toggle = function(shouldActivate) {
            // If not explicitly set, toggle to opposite state
            if(typeof shouldActivate == "undefined"){
                shouldActivate = !this.isActive();
            }

            if(shouldActivate) {
                if(typeof this.onActivate == "function") {
                    this.onActivate.call(this.$el.get());
                }
                this.$el.addClass(settings.activeClass);
                this.$el.removeClass(settings.inactiveClass);
            } else {
                if(typeof this.onDeactivate == "function") {
                    this.onDeactivate.call(this.$el.get());
                }
                this.$el.addClass(settings.inactiveClass);
                this.$el.removeClass(settings.activeClass);
            }

            settings.isActive = shouldActivate;
        };

        this.reset = function(options) {
            settings = $.extend(settings,options);
            this.$el = $(settings.el);
            this.onActivate = settings.onActivate;
            this.onDeactivate = settings.onDeactivate;
            //this.toggle(this.isActive());
        }

        this.isActive = function () {
            return settings.isActive;
        }


        // Call init
        this.initialize(options);
    }

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
            debug("Entered Layout: " + this.debugName);
            if(typeof this.onEnter === "function") {
                this.onEnter.apply(this, arguments);
            }
        };

        /**
         * Called when a Layout is removed
         */
        this.exit = function() {
            debug("Exited Layout: " + this.debugName);
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
                // This must come before adjusting sidebars
                that.shouldSidebarsPush(true);

                maxOpenSidebars = 1;
                that.toggleSidebarLeft(false);
                that.toggleSidebarRight(false);
                
                // with primary nav on bottom
                that.initializeStickies(true);
            }
        }),
        MEDIUM : new Layout({
            debugName: "medium", 
            minWidth: 769, 
            onEnter: function() {
                // This must come before adjusting sidebars
                that.shouldSidebarsPush(false);

                maxOpenSidebars = 1;
                that.toggleSidebarLeft(true);
                that.toggleSidebarRight(false);

                that.initializeStickies(false);
            }
        }),
        LARGE : new Layout({
            debugName: "large", 
            minWidth: 1200, 
            onEnter: function() {
                // This must come before adjusting sidebars
                that.shouldSidebarsPush(false);

                maxOpenSidebars = 2;
                that.toggleSidebarLeft(true);
                that.toggleSidebarRight(true);

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

        this.$sidebarLeftToggleButton = $(".sidebar-left-toggle-button");
        this.$sidebarRightToggleButton = $(".sidebar-right-toggle-button");

        // Cache values
        hasSidebarLeft = this.hasSidebarLeft();
        hasSidebarRight = this.hasSidebarRight();
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
        if(hasSidebarLeft) {
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
            
            // switch the sidebarLeftView to the sticky wrapper
            this.sidebarLeftView.reset({
                el: "#sidebar-left-sticky-wrapper"
            });
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

    ////////////////////////////////////////////////////////////////////////////
    // SIDEBAR METHODS
    ////////////////////////////////////////////////////////////////////////////

    /**
     * Initializes SidebarViews and registers listeners
     */
    this.initializeSidebars = function() {
        var that = this;

        if(hasSidebarLeft) {
            this.sidebarLeftToggleButtonView = new ToggleView({
                el: this.$sidebarLeftToggleButton,
                activeClass: TOGGLE_BUTTON_ACTIVE_CLASS,
                inactiveClass: TOGGLE_BUTTON_INACTIVE_CLASS,
            });
            this.sidebarLeftView = new ToggleView({
                el: this.$sidebarLeft, // We want classes to be applied here
                activeClass : SIDEBAR_LEFT_OPEN_CLASS,
                inactiveClass :SIDEBAR_LEFT_CLOSED_CLASS,
                onActivate: function() {
                    that.onSidebarOpen();
                },
                onDeactivate: function() {
                    that.onSidebarClose()
                }
            });
            this.mainLeftView = new ToggleView({
                el: this.$main,
                activeClass: SIDEBAR_LEFT_OPEN_CLASS,
                inactiveClass: SIDEBAR_LEFT_CLOSED_CLASS
            });

            // Toggle button click handler
            this.$sidebarLeftToggleButton.on('click', function() { 
                that.toggleSidebarLeft();
            });
        }

        if(hasSidebarRight) {
            this.sidebarRightToggleButtonView = new ToggleView({
                el: this.$sidebarRightToggleButton,
                activeClass: TOGGLE_BUTTON_ACTIVE_CLASS,
                inactiveClass: TOGGLE_BUTTON_INACTIVE_CLASS,
            });
            this.sidebarRightView = new ToggleView({
                el: this.$sidebarRight, // We want classes to be applied here
                activeClass : SIDEBAR_RIGHT_OPEN_CLASS,
                inactiveClass :SIDEBAR_RIGHT_CLOSED_CLASS,
                onActivate: function() {
                    that.onSidebarOpen();
                },
                onDeactivate: function() {
                    that.onSidebarClose()
                }
            });
            this.mainRightView = new ToggleView({
                el: this.$main,
                activeClass: SIDEBAR_RIGHT_OPEN_CLASS,
                inactiveClass: SIDEBAR_RIGHT_CLOSED_CLASS
            });

            // Toggle button click handler
            this.$sidebarRightToggleButton.on('click', function() {
                that.toggleSidebarRight();
            });
        }
        
    };

    /**
     * Toggles the left sidebar to the shouldOpen state 
     * or the reverse of the current state if shouldOpen is undefined.
     * @param shouldOpen {Boolean}
     */
    this.toggleSidebarLeft = function(shouldOpen) {
        if(hasSidebarLeft) {
            if(typeof shouldOpen == "undefined") {
                shouldOpen = this.isSidebarLeftClosed();
            }
            console.log("maxOpenSidebars: " + maxOpenSidebars);
            console.log("shouldOpen: " + maxOpenSidebars);
            console.log("is other open?: " + !this.isSidebarRightClosed());
            if(shouldOpen 
               && maxOpenSidebars == 1
               && !this.isSidebarRightClosed()  
            ){
                console.log("Should close other");
                this.toggleSidebarRight(false);
            }
            this.sidebarLeftToggleButtonView.toggle(shouldOpen);
            this.sidebarLeftView.toggle(shouldOpen);
            this.mainLeftView.toggle(shouldOpen);
        }
    };

    /**
     * Toggles the right sidebar to the shouldOpen state
     * or the reverse of the current state if shouldOpen is undefined.
     * @param shouldOpen {Boolean}
     */
    this.toggleSidebarRight = function(shouldOpen) {
        if(hasSidebarRight) {
            if(typeof shouldOpen == "undefined") {
                shouldOpen = this.isSidebarRightClosed();
            }
            if(shouldOpen 
               && maxOpenSidebars == 1
               && !this.isSidebarLeftClosed()  
            ){
                console.log("Should close other");
                this.toggleSidebarLeft(false);
            }
            this.sidebarRightToggleButtonView.toggle(shouldOpen);
            this.sidebarRightView.toggle(shouldOpen);
            this.mainRightView.toggle(shouldOpen);
        }
    };

    /**
     * Returns true if the left sidebar is present in HTML 
     * Use the cached variable instead of this function.
     */
    this.hasSidebarLeft = function() {
        // To be safe, we'll require everything
        return this.$sidebarLeft.size() > 0
            && this.$sidebarLeftToggleButton.size() > 0
            && this.$main.size() > 0;
    };

    /**
     * Returns true if the right sidebar is present in HTML
     * Use the cached variable instead of this function.
     */
    this.hasSidebarRight = function() {
        // To be safe, we'll require everything
        return this.$sidebarRight.size() > 0
            && this.$sidebarRightToggleButton.size() > 0
            && this.$main.size() > 0;
    };

    /**
     * Sets whether sidebars should push or slide when opening.
     * Push fixes the width of the main content and moves it aside.
     * Slide subtracts the sidebar's width from the main width.
     *
     * @param shouldPush {Boolean} true to push, false to slide
     */
    this.shouldSidebarsPush = function(shouldSidebarsPush) {
        if(typeof shouldSidebarsPush == "undefined") {
            return _shouldSidebarsPush;
        }
        _shouldSidebarsPush = shouldSidebarsPush;
        
        if(!_shouldSidebarsPush) {
            this.unlockMainWidth();
        }
    };

    /**
     * Called when a sidebar begins pushing
     */
    this.onSidebarOpen = function () {
        if(this.shouldSidebarsPush()) {
            this.lockMainWidth();
        }
    };

    /**
     * Called when a sidebar closes
     */
    this.onSidebarClose = function() {
        if(this.shouldSidebarsPush()) {
            // Unlock the main element width only if both sidebars are closed.
            if(this.isSidebarRightClosed() 
                && this.isSidebarLeftClosed()) 
            {
                this.unlockMainWidth();
            } 
        }
    };

    /** 
     * Returns true if right sidebar is closed or non-existant
     */
    this.isSidebarRightClosed = function() {
        return (!hasSidebarRight || !this.sidebarRightView.isActive());
    }

    /** 
     * Returns true if left sidebar is closed or non-existant
     */
    this.isSidebarLeftClosed = function() {
        return (!hasSidebarLeft || !this.sidebarLeftView.isActive());
    }

    /**
     * Locks the main element at it's current width
     */
    this.lockMainWidth = function() {
        debug("locking width");
        that.$main.width(that.$main.width());
    };

    /**
     * Unlocks the main element width
     */
    this.unlockMainWidth = function() {
        debug("unlocking width");
        that.$main.width("");
    };
    
    ////////////////////////////////////////////////////////////////////////////
    // RESIZING METHODS
    ////////////////////////////////////////////////////////////////////////////

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

        if(this.shouldSidebarsPush()) {
            this.$main.width(windowWidth);
        }

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
        debug("Changing layout to " + newLayout.debugName);

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
    // wait and init when the DOM is fully loaded
    $(window).load( function() {
        mathbook = new Mathbook({});
    });
}


