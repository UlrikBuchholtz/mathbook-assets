var $ = jQuery;
var ScrollingNav = function (options) {

    // default class prefix
    var DEFAULT_PREFIX = "scrolling-nav-";

    var settings = $.extend({

          prefix: DEFAULT_PREFIX,

          navEnabledClass: null, // nav is enabled by default
          // whether or not to initialize the page with header placeholder
          initWithPlaceholder: false,
          // Whether or not the header is persistent upon page load
          startsPersistent: false,

          // Selectors for various elements
          header: 'header:first',
          nav: 'nav:first',
          topLink: '#top-link',
          navLink: 'a',
          activeClass: 'active',

          sectionSelector: 'section',
          scrollToAttr: 'data-scroll',
          anchorAttr: 'data-anchor',
          
          // Offset from top of the viewport at which section entry occurs
          viewOffset: 50,

          // If true, history states will be pushed rather than replaced
          // so each section entry will create a new history entry
          // accessible with back/forward btns
          pushHistory: false,
          // Whether or not to change hashes on old browsers when
          // pushHistory/replaceHistory is not supported.
          provideHistoryFallback: true, 
          
          checkSectionInterval: 250,

          animated: true,
          speed: 500,
          easing: 'swing',

          // TODO callbacks
          onLoad: null,
          onPersistentStart: null,
          onPersistentEnd: null,
          onEnterSection: null,

        }, options);


    // Private vars
    // -------------------------------------------------------------------------
    var that = this;

    var initClass = settings.prefix + "loaded";
    var persistentClass = settings.prefix + "persistent";
    var navEnabledClass = settings.navEnabledClass;

    var $header = $(settings.header);
    var $nav = $(settings.nav);
    var $navLinks = $(settings.nav + ' ' + settings.navLink);
    var $topLink = $(settings.topLink);
    var $sections = $(settings.sectionSelector);

    // These are recomputed on resize
    var offsetTop = 0;
    var viewOffset = settings.viewOffset;
    var headerOffsetTop = 0;

    var $w = $(window);
    var $placeholder = $('<div>');
    var currentScrollAnchor = null;
    var $currentSections = null;


    // Public vars
    // -------------------------------------------------------------------------


    // Methods
    // -------------------------------------------------------------------------

    // Recompute offsets
    this.computeOffsets = function() {
        // The default page offset of the header
        headerOffsetTop = $header.offset().top;

        // Force persistent mode to compute some things
        $header.addClass(persistentClass);

        // Now add the fixed offset (due to other fixed/absolute elements)
        headerOffsetTop += $header.get(0).getBoundingClientRect().top;
        offsetTop = headerOffsetTop - parseInt($header.css('top'), 10);
       
        // Add the header height to the view offset since the 
        // viewable frame is partially occluded by the header
        viewOffset = settings.viewOffset + $header.outerHeight();
        
        // Remove persistent mode
        $header.removeClass(persistentClass);
       
        // Set the correct placeholder height
        // based on header height when it is positioned relatively
        $placeholder.height($header.outerHeight());
    };

    // When we click on a navLink, scroll to the correct section
    this.onNavLinkClick = function(e) {
        var scrollAnchor = $(this).attr(settings.scrollToAttr);
        if(scrollAnchor 
                &&(navEnabledClass===null 
                    || $('body').hasClass(navEnabledClass))) {

            var sectionExists = that.scrollToSection(scrollAnchor);
            if(sectionExists) {
                e.preventDefault();
                return false;
            }
        }
        return true;
    };

    // Animated scroll to a section
    // Returns false if no section to scroll to on this page
    this.scrollToSection = function(scrollAnchor, callback) {
        console.log("scrollToSection(" + scrollAnchor + ",...)");
        var sectionExists = false;
        var selector = settings.sectionSelector 
                                + "[" + settings.anchorAttr 
                                +"=\"" 
                                + scrollAnchor 
                                + "\"]";
        var $matchedSection = $(selector);
        if($matchedSection.length > 0) {
            // Don't check sections while we're auto-scrolling
            that.stopCheckSection();

            // Determine position to scroll to
            $matchedSection = $matchedSection.first();
            var scrollPoint = 
                Math.max($matchedSection.offset().top - viewOffset + 1, 0);

            // Define some things we need to do after scrolling
            var wrappedCallback = function() {
                console.log("ScrollTo animate wrappedcallback");
                that.startCheckSection();
                if(callback && typeof callback === "function") {
                    callback();
                }
            };

            console.log("Beginning animate");
            // Perform the scroll
            $('body,html').animate({
                scrollTop: scrollPoint
            }, settings.speed, settings.easing, wrappedCallback);

            sectionExists = true;
        }

        // Return false if no section to scroll to on this page
        return sectionExists;
    };

    // Update GUI onScroll
    this.updateScroll = function() {
        var wScroll = $w.scrollTop();
        if ((settings.startsPersistent && wScroll >= offsetTop) || 
                wScroll > offsetTop) {
            if(!$header.hasClass(persistentClass)) {
                $header.addClass(persistentClass);
                $placeholder.remove();
                $header.before($placeholder);
            }
        } else {
            $header.removeClass(persistentClass);
            if(!settings.initWithPlaceholder) {
                $placeholder.remove();
            }
        }
    };

    // Check if we've entered a new section 
    this.checkSection = function() {
        if($sections.length > 0) {
            var wScroll = $w.scrollTop();
            var $currentSection = null;
            var $currentParents = null;

            // King of the hill search for current section
            // TODO sort sections by offset so we can exit early?
            $sections.each(function(i) {
                $section = $(this);
                // If top edge of viewing frame is below the top of section
                if ($section.offset().top - viewOffset <= wScroll) {
                    var sectionEnd = $section.offset().top
                                    // plus full height with pad and margin
                                    + $section.outerHeight(true)
                                    // minus margin-top
                                    - parseInt($section.css("margin-top"), 10);
                    // And top edge is above bottom of section
                    if(sectionEnd > wScroll) {
                        // Then this might be the current section
                        $currentSection = $section;
                    }
                }
            });

            // Check to see if the current section has changed since we last 
            // checked
            // IF there is no section and this is new
            if($currentSection == null && that.$currentSection !== null) {
                // Update state accordingly
                that.$currentSection = null;
                $currentSections = null;
                
                // Enter no section to update hash 
                that.enterSection();

                // Else if there is a section, and it's different
            } else if($currentSection 
                    && !$currentSection.is(that.$currentSection)) {

                that.$currentSection = $currentSection;
                // This may be a subsection, so...
                // Travel up the DOM and find all section ancestors of this
                // section (we are inside them, as well)
                $currentParents = 
                    $currentSection.parents(settings.sectionSelector);

                // Then compile them with currentSection to form an object
                // listing all the sections we're in
                $currentSections = $currentParents.add($currentSection);

                // And enter the current section 
                that.enterSection();
            }
        }
    };

    // Updates links based on the currently entered sections
    // It's important that we search all currently entered sections
    // since some subsections do not have corresponding links
    // we want use the most specific section with a link to
    // update the hash.
    this.enterSection = function() {

        // remove active class from all nav links 
        $navLinks.removeClass(settings.activeClass);

        var currentAnchor = "";

        if($currentSections) {
            // Update links and king of hill search for anchor to use as hash
            // For each of the sections we're currently in
            // (NOTE: they are ordered in document order)
            $currentSections.each(function() {
                var $section = $(this);
                // Get the anchor
                var scrollAnchor = $section.attr(settings.anchorAttr);

                // If the anchor is actually set
                if(typeof scrollAnchor !== "undefined" && scrollAnchor !== "") {
                    // Find the nav link for this section
                    var $theNavLink = $navLinks.filter("[" 
                                        + settings.scrollToAttr 
                                        + "=\"" 
                                        + scrollAnchor + "\"]");

                    // If there is a link
                    if($theNavLink.length) {
                        
                        // mark it as active
                        $theNavLink.addClass(settings.activeClass);
                        
                        // and save anchor cuz it might be the hash 
                        currentAnchor = scrollAnchor;
                    }
                }
            });
        }

        var currentHash = location.hash.substr(1);
        if(currentAnchor !== currentHash) {
            that.setHash(currentAnchor);
            if(currentAnchor !== "") {
                // and log the event
                var currentLocation = location.pathname + location.hash;
                if(typeof _gaq !== "undefined") {
                    _gaq.push(['_trackEvent', 
                            'Section Entered', currentLocation]);
                } else {
                    console.log("section entered: " + currentLocation);
                }
            }
        }
    };


    // Set the hash to reflect the current position in the page
    // This function temporarily removes the anchor matching this
    // hash so that the page doesn't jump as we change the hash
    // It's sort of expensive, so don't call it needlessly
    this.setHash = function(hash) {

        if(settings.pushHistory && history.pushState) {
            history.pushState({}, hash, "#" + hash);
        } else if(history.replaceState) {
            history.replaceState({}, hash, "#" + hash);
        } else if(settings.provideHistoryFallback) {
            // we do it the hacky way
            var $fx;
            var $nodes = $( '#' + hash + ',[name=\"' + hash + '\"]' );
            var ids = new Array();
            var names = new Array();

            var i = 0;
            // Remove id and name from all matched nodes
            $nodes.each(function() {
                var node = $(this);
                ids[i] = node.attr('id');
                names[i] = node.attr('name');    
                node.attr( 'id', '' );
                node.attr( 'name', '' );
                i++;
            });

            if($nodes.length) {
                // Some browsers will try to scroll to where the element
                // was last seen, so we create a dummy
                $fx = $( '<div></div>' )
                        .css({
                                position:'absolute',
                                visibility:'hidden',
                                top: $w.scrollTop() + 'px'
                            })
                        .attr( 'id', hash )
                        .appendTo( document.body );
            }

            // finally, set the hash
            document.location.hash = hash;

            i = 0;
            // Return ids and names to matched nodes
            $nodes.each(function() {
                var node = $(this);
                node.attr( 'id', ids[i] );
                node.attr( 'name', names[i] );
                i++;
            });

            // Remove our dummy
            if($nodes.length) {
                $fx.remove();
            }
        }
    };

    // On window resize, update computations
    this.resize = function() {
        that.computeOffsets();
        that.updateScroll();
    };

    // Start the checkSection interval
    this.startCheckSection = function() {
        // Stop an interval that might be running already
        that.stopCheckSection();

        // Ensure that we check it immediately
        if(settings.checkSectionInterval > 0 ) {
            that.checkSection();
        }

        // and start an interval 
        that.checkSectionIntervalID = 
            setInterval( that.checkSection, settings.checkSectionInterval );
    };

    // Stop the checkSection interval
    this.stopCheckSection = function() {
        clearInterval(that.checkSectionIntervalID); // to be safe
    };


    // init
    this.init = function() {
        if(settings.initWithPlaceholder) {
            $header.before($placeholder)
        }

        $('body').addClass(initClass);

        // Register onClick listeners for links
        $navLinks.on('click', that.onNavLinkClick);
        $topLink.on('click', that.onNavLinkClick);

        // updateScroll onScroll
        $w.scroll(that.updateScroll);

        // Register resize handler
        $w.resize(that.resize);
        that.resize();

        if (typeof location.hash !== "undefined" && location.hash !== null &&
                location.hash.substr(1) !== ""){
            console.log("There is a hash.");
            // If there is already a hash set onLoad, then we need to disable our
            // hash/scroll listeners, reset to top, and animate the scroll from
            // top to the the set hash position.

            // Timeout zero allows the browser to do it's thing before
            // we come back and fix the scroll 
            var timeout = setTimeout(function(){
                clearTimeout(timeout);
                // Reset to top
                $('html, body').scrollTop(0);
                // Scroll to the requested section
                that.scrollToSection(location.hash.substr(1), that.onLoad);
            }, 0);
        } else{
            console.log("There is no hash!");
            that.onLoad();
        }
    }

    this.onLoad = function() {
        console.log("ScrollNav onLoad");
        // Start checkSection interval
        that.startCheckSection(); 

        // Call the onLoad callback if we got one
        if(typeof settings.onLoad === "function") {
            settings.onLoad();
        }
    };

    // Run init when we are constructed
    this.init();
};

// EXAMPLE INIT 
//$(document).ready( function() {
//    var scrollingNav = new ScrollingNav({
//        navEnabledClass: 'home', // nav only enabled on home page
//        header: '#masthead',
//        nav: '#menu-navigation-menu',
//        topLink: '.site-title a',
//        speed: 300,
//    });
//});

