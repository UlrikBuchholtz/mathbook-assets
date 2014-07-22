/**
 * A jQuery plugin for CSS Box Model Collisions. 
 * TODO add other useful functions like intersects(x,y) and intersects(element)
 */
(function($) {
    /**
     * Returns an object containing booleans for intersections with different
     * parts of the CSS Box Model.
     * @param {Number} x - the x coordinate relative to  window
     * @param {Number} y - the y coordinate reative to window
     * @return {Object} booleans for intersections in each Box Model region
     *
     * TODO support jQuery objects with mutliple elements
     * TODO support for box-sizing:border-box
     * TODO performance optimizations
     */
    $.fn.intersections = function(x,y) {
        var intersections = {};

        // Get margin 
        var marginLeft = parseInt(this.css("marginLeft"));
        var marginRight = parseInt(this.css("marginRight"));
        var marginTop = parseInt(this.css("marginTop"));
        var marginBottom = parseInt(this.css("marginBottom"));

        // Get Border
        var borderLeft = parseInt(this.css("borderLeftWidth"));
        var borderRight = parseInt(this.css("borderRightWidth"));
        var borderTop = parseInt(this.css("borderTopWidth"));
        var borderBottom = parseInt(this.css("borderBottomWidth"));

        // Get padding
        var paddingLeft = parseInt(this.css("paddingLeft"));
        var paddingRight = parseInt(this.css("paddingRight"));
        var paddingTop = parseInt(this.css("paddingTop"));
        var paddingBottom = parseInt(this.css("paddingBottom"));

        var innerWidth = this.width() - paddingLeft - paddingRight;

        // Get offset coordinates 
        var $w = $(window);
        var elementLeft = this.offset().left - $w.scrollLeft();
        var elementRight = elementLeft + this.width();
        var elementTop = this.offset().top - $w.scrollTop();
        var elementBottom = elementTop + this.height(); 

        // Margin
        ////////////////////////////////////////////////////////////////////////
        intersections.marginLeft = 
            x < elementLeft - borderLeft 
            && x > (elementLeft - borderLeft - marginLeft); 

        intersections.marginRight =
           x > elementRight + borderRight 
           && x < (elementRight + borderRight + marginRight); 

        intersections.marginTop =
           y < elementTop - borderTop 
           && y > (elementTop - borderTop - marginTop); 

        intersections.marginBottom =
           y > elementBottom + borderBottom
           && y < (elementBottom + borderBottom + marginBottom); 

        intersections.margin = 
            intersections.marginLeft
            || intersections.marginRight
            || intersections.marginTop
            || intersections.marginBottom;

        // Border 
        ////////////////////////////////////////////////////////////////////////
        intersections.borderLeft = 
            x < elementLeft && x > (elementLeft - borderLeft); 

        intersections.borderRight =
           x > elementRight && x < (elementRight + borderRight); 

        intersections.borderTop =
           y < elementTop && y > (elementTop - borderTop); 

        intersections.borderBottom =
           y > elementBottom && y < (elementBottom + borderBottom); 

        intersections.border = 
            intersections.borderLeft
            || intersections.borderRight
            || intersections.borderTop
            || intersections.borderBottom;

        // Padding
        ////////////////////////////////////////////////////////////////////////
        intersections.paddingLeft =
            x > elementLeft && x < elementLeft + paddingLeft; 

        intersections.paddingRight =
            x > elementLeft + paddingLeft + innerWidth && x < elementRight; 

        intersections.paddingTop =
            y > elementTop && y < elementTop + paddingTop; 

        intersections.paddingBottom =
            y > elementTop + paddingTop + innerWidth && y < elementBottom; 

        intersections.padding = 
            intersections.paddingLeft
            || intersections.paddingRight
            || intersections.paddingTop
            || intersections.paddingBottom;

        // Content
        ////////////////////////////////////////////////////////////////////////
        intersections.content = 
            x > elementLeft + paddingLeft && x < elementRight - paddingRight
            && y > elementTop + paddingTop && y < elementBottom - paddingBottom;
        
        return intersections; 
    }
}(jQuery));
