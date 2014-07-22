/**
 * The TouchController for Mathbook.
 */
var TouchController = function(options) {

    var defaults = {
        touchContainer: window,
        content: null,
        sidebarLeftView: null,
        sidebarRightView: null,
        screenEdgeFudge: 5,
        // Ratio sidebar must be opened/closed before completing by itself
        inertiaThresholdRatio: .3,
        // Pixels touchpoint must move to be classified as a swipe
        swipeThreshold: 30,
        // Pixels touchpoint must move to be classified as scrolling
        scrollThreshold: 30 
    };

    var that = this;

    // Codes for the type of interaction
    var INTERACTION_UNKOWN = -1;
    var INTERACTION_SWIPE = 0;
    var INTERACTION_SCROLL = 1;

    // Variables set in reset function
    var activeSidebarView, 
        openDirection,
        activeTouch,
        changeInProgress,
        interactionType,
        startEvent,
        startingProgress, 
        changeInProgress,
        sidebarWidth;


    this.initialize = function(options) {
        if(typeof options === "undefined") {
            options = {};
        }
        this.settings = $.extend(defaults, options);

        this.$touchContainer = $(this.settings.touchContainer);
        this.$content = $(this.settings.content);

        this.sidebarLeftView = this.settings.sidebarLeftView;
        this.sidebarRightView = this.settings.sidebarRightView;

        this.reset();
    };

    this.reset = function(options) {
        activeSidebarView = null;
        openDirection = 0;
        interactionType = INTERACTION_UNKOWN;
        startX = 0;
        startY = 0;
        startingProgress = 0;
        changeInProgress = 0;
        sidebarWidth = 0;
        activeTouch = null;
        startEvent = null;
        
        // Cleanup handlers
        this.$touchContainer.off("touchstart.dragSidebar");
        this.$touchContainer.off("touchmove.dragSidebar");
        this.$touchContainer.off("touchend.dragSidebar");

        // Set touch handler
        this.$touchContainer.on("touchstart.dragSidebar", function(e) {
            that.dragSidebarStart(e);
        });
    };

    /**
     * Touchstart event for sidebar drags 
     * @param {JQuery.Event} startEvent
     */
    this.dragSidebarStart = function(e) {
        startEvent = e;
        //console.log(startEvent);

        // We only care about one touchpoint for this interaction
        if(activeTouch != null) {
            return;
        }

        activeTouch = startEvent.originalEvent.changedTouches[0];

        // We must determine if this event can begin a sidebar drag.
        var $target = $(startEvent.target);
        var $targetParents = $target.parents();

        var isLeftClosed = that.sidebarLeftView.isClosed();
        var isRightClosed = that.sidebarRightView.isClosed();

        var screenLeftEdge = this.settings.screenEdgeFudge;
        var screenRightEdge = 
            this.$touchContainer.width() - this.settings.screenEdgeFudge;

        var isOpeningFromLeft = 
            isLeftClosed && activeTouch.clientX <= screenLeftEdge;
        var isOpeningFromRight = 
            isRightClosed && activeTouch.clientX >= screenRightEdge;

        var touchedSidebarLeft = 
            $targetParents.filter(that.sidebarLeftView.$sidebar).size() > 0;
        var touchedSidebarRight = 
            $targetParents.filter(that.sidebarRightView.$sidebar).size() > 0;

        // Determine if touch intersects left or right side of content box model
        var contentIntersections = 
            that.$content.intersections(activeTouch.clientX, 
                                        activeTouch.clientY);
        var touchedContentLeft = 
                contentIntersections.marginLeft
                || contentIntersections.borderLeft
                || contentIntersections.paddingLeft;
        var touchedContentRight = 
                contentIntersections.marginRight
                || contentIntersections.borderLeft
                || contentIntersections.paddingLeft;

        var isMoveLeft = 
            isOpeningFromLeft 
            || touchedSidebarLeft 
            || touchedContentLeft;

        var isMoveRight = 
            isOpeningFromRight 
            || touchedSidebarRight 
            || touchedContentRight;

        // If this touch qualifies to move a sidebar 
        if(isMoveLeft || isMoveRight) {
            // Setup touchmove variables for correct sidebar
            if(isMoveLeft) {
                openDirection = 1; // positive dx opens
                activeSidebarView = that.sidebarLeftView;
            } else { 
                openDirection = -1; // negative dX opens
                activeSidebarView = that.sidebarRightView;
            }

            // Stop any animation that's going
            activeSidebarView.pause();

            sidebarWidth = activeSidebarView.getWidth();
            startingProgress = activeSidebarView.progress();
            changeInProgress = 0;

            // Register touchmove
            that.$touchContainer.on("touchmove.dragSidebar", function(moveEvent){
                that.dragSidebarMove.apply(this, arguments);
            });

            that.$touchContainer.on("touchend.dragSidebar", function(endEvent) {
                that.dragSidebarEnd.apply(this,arguments);
            });
        } else {
            this.reset();
        }
    };

    /**
     * Touchmove callback for sidebar drags
     */
    this.dragSidebarMove = function(moveEvent) {
        //console.log(moveEvent);
        var moveTouches = moveEvent.originalEvent.changedTouches;
        // We only care if there is a single touchpoint moving
        // and it is the touchpoint we're tracking.
        if(moveTouches.length === 1 
            && activeTouch.identifier === moveTouches[0].identifier) 
        {
            var dx = moveTouches[0].clientX - activeTouch.clientX;
            var dy = moveTouches[0].clientY - activeTouch.clientY;

            // If we haven't classified action yet
            if(interactionType === INTERACTION_UNKOWN) {
                if(Math.abs(dx) >= that.settings.swipeThreshold) {
                    interactionType = INTERACTION_SWIPE;
                }
                if(Math.abs(dy) >= that.settings.scrollThreshold) {  
                    interactionType = INTERACTION_SCROLL;
                }
                moveEvent.preventDefault();
            } else if(interactionType === INTERACTION_SWIPE) {
                // Cancel default browser handlers, including scroll
                startEvent.preventDefault();
                moveEvent.preventDefault();

                // Compute the change in sidebar transition progress
                changeInProgress = openDirection*dx / sidebarWidth;
                // Limit it to [-1,1] to prevent funkiness?
                changeInProgress = 
                    Math.max(Math.min(changeInProgress, 1), -1);
                
                var newProgress = startingProgress + changeInProgress;
                activeSidebarView.progress(newProgress);
            } else if(interactionType === INTERACTION_SCROLL) {
                // Kill listeners and reset interaction
                that.reset();
            }
        }

    };

    /**
     * Touchend callback for sidebar drags
     */
    this.dragSidebarEnd = function(endEvent) {
        //console.log(endEvent);

        var endTouches = endEvent.originalEvent.changedTouches;
        var i=0;
        var length = endTouches.length;
        for(; i < length; i++) {
            if(endTouches[i].identifier == activeTouch.identifier) {
                //console.log("Removing touch move listener.");

                // If the user dragged beyond inertial point, finish it
                var inertiaThresholdRatio = that.settings.inertiaThresholdRatio;
                var shouldFinish =
                    Math.abs(changeInProgress) >= inertiaThresholdRatio;
                // If changeInProgress has same sign as openDireciton
                // then user was opening it 
                var wasOpening = changeInProgress > 0; 
                var wasOpen = startingProgress > .5;

                var shouldOpen = shouldFinish ? wasOpening : wasOpen ;
                activeSidebarView.toggle(shouldOpen);

                if(interactionType == INTERACTION_SWIPE) {
                    endEvent.preventDefault();
                }

                that.reset();
            }
        }
    };

    this.removeMoveHandlers = function() {
    };

    this.initialize(options);
};
