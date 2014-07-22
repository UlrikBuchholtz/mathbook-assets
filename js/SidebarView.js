/**
 * A SidebarView that can be opened and closed with a TweenController
 */
var SidebarView = function(options) { 

    var defaults = {
        debugName: "SidebarView",
        toggleDuration: 400,

        toggleButton: ".sidebar-toggle-button",
        sidebar: ".sidebar",
        main: ".main",

        toggleButtonActiveClass: "active",

        sidebarOpenClass: "open",
        sidebarClosedClass: "closed",

        mainOpenClass: "sidebar-open",
        mainClosedClass: "sidebar-closed",
        
        // See GSAP overwrite manager properties
        // By default, we assume these tweens will not conflict w/ others
        overwrite: "none",
        easing: "linear"
    };

    /**
     * Initializer
     * @param {Object} options
     *
     * Supported options are:
     * * toggleDuration
     * * toggleButton
     * * sidebar
     * * main
     * * toggleButtonActiveClass
     * * sidebarClosedClass
     * * mainClosedClass
     */
    this.initialize =  function(options) {
        var settings = $.extend(defaults, options);
        this.debugName = settings.debugName;

        this.$sidebar = $(settings.sidebar);
        this.$main = $(settings.main);

        var toggleButtonTweener = 
            TweenLite.fromTo(
                    settings.toggleButton,
                    settings.toggleDuration,
                    {
                        css:{className:"-=" + settings.toggleButtonActiveClass},
                        overwrite: settings.overwrite,
                        easing: settings.easing
                    },
                    {
                        css:{className:"+=" + settings.toggleButtonActiveClass},
                        overwrite: settings.overwrite,
                        easing: settings.easing
                    }); 
        var sidebarTweener = 
            TweenLite.fromTo(
                    settings.sidebar, 
                    settings.toggleDuration,
                    {
                        css:{className:"+=" + settings.sidebarClosedClass},
                        overwrite: settings.overwrite,
                        easing: settings.easing
                    },
                    {
                        css:{className:"-=" + settings.sidebarClosedClass},
                        overwrite: settings.overwrite,
                        easing: settings.easing
                    }); 
        var mainTweener = 
            TweenLite.fromTo(
                    settings.main,
                    settings.toggleDuration, 
                    {
                        css:{className:"+=" + settings.mainClosedClass},
                        overwrite: settings.overwrite,
                        easing: settings.easing
                    
                    },
                    {
                        css:{className:"-=" + settings.mainClosedClass},
                        overwrite: settings.overwrite,
                        easing: settings.easing
                    });

        this.timeline = 
            new TimelineLite()
            .add(toggleButtonTweener,0)
            .add(sidebarTweener,0)
            .add(mainTweener,0);
        this.timeline.pause().progress(0);
    };

    this.toggle = function(shouldToggleOpen) {
        if(typeof shouldToggleOpen == "undefined") {
            // toggle current state
            shouldToggleOpen = this.timeline.progress() < .5;
        }             
        // Timeline tweens from closed to open, so reversed closes. 
        this.timeline
            .pause()
            // recompute starting/ending values in case className string changed.
            .invalidate() 
            .reversed(!shouldToggleOpen)
            .resume();
    };

    /**
     * Sets or returns the animation progress (number between 0 and 1) 
     * 0 is closed, 1 is open.
     * @param {Number} progress
     * @return progress
     */
    this.progress = function(progress) {
        if(typeof progress === "undefined") {
            progress = this.timeline.progress();
            return progress;
        } else {
            this.timeline.progress(progress);
            return this;
        }
    };

    /**
     * Stop any animation that is currently going.
     */
    this.pause = function() {
        this.timeline.pause();
        return this;
    };

    /**
     * Play whatever animation is prepared (forward or backward)
     */
    this.resume = function() {
        this.timeline.resume();
        return this;
    };

    /**
     * Returns the sidebar's width
     * @return {Number}
     */
    this.getWidth = function() {
        return this.$sidebar.width();
    };

    this.isClosed = function() {
        return this.progress() == 0;
    };

    /**
     * Passthrough to GSAP timeline eventCallbacks function.
     */
    this.eventCallback = function(type, callback, params, scope) {
        this.timeline.eventCallback(type, callback, params, scope);
        return this;
    };

    // Call initialize
    this.initialize(options);
}
