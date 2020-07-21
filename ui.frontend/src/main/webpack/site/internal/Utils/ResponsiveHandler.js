/**
 *
 * @type {{getCurrentBP: (function(): string)}}
 */
NS('beej').ResponsiveHandler = (function() {
    'use strict';
    var CONST = beej.Const;

    var _getCurrentBP = function() {
        var viewPortWidth = $(window).width();
        var currentBP;

        if (viewPortWidth < CONST.BREAKPOINTS.md) {
            currentBP = 'md';
        } else if (viewPortWidth >= CONST.BREAKPOINTS.md && viewPortWidth < CONST.BREAKPOINTS.lg) {
            currentBP = 'lg';
        } else if (viewPortWidth >= CONST.BREAKPOINTS.lg && viewPortWidth < CONST.BREAKPOINTS.xl) {
            currentBP = 'xl';
        } else if (viewPortWidth >= CONST.BREAKPOINTS.xl && viewPortWidth < CONST.BREAKPOINTS.xxl) {
            currentBP = 'xxl';
        }

        return currentBP;
    };

    var prevBP = _getCurrentBP();

    /**
     * Binds a resize event to fire a custom changedBP event to track the breakpoint changes
     * sending as a data the New Breakpoint and the Previous Breakpoint
     */
    $(window).on('resize', function() {
        var newBP = _getCurrentBP();
        var bpChanged = prevBP !== newBP;

        if (bpChanged) {
            $(window).trigger('changed.BP', [newBP, prevBP]);
            prevBP = newBP;
        }
    });

    var _isMobile = function() {
        return _getCurrentBP() === 'md' || _getCurrentBP() === 'lg';
    };

    return {
        getCurrentBP: _getCurrentBP,
        isMobile: _isMobile
    };
})();
