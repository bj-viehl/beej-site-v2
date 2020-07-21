/**
 * @class EventsHandler
 * @description EventsHandler
 * @extends default
 */
NS('beej').EventsHandler = (function() {
    'use strict';

    var UTILS = beej.Utils;

    var events = [];

    var getEvents = function() {
        return events;
    };

    var setEvent = function(key) {
        var event = { key: key, value: new Vue() };
        events.push(event);
        return event;
    };

    var getEvent = function(name) {
        var index = UTILS.findIndex(events, function(item) {
            return item.key === name;
        });
        var event = null;
        if (index !== -1) {
            event = events[index];
        }
        return event;
    };

    return {
        getEvent: getEvent,
        getEvents: getEvents,
        setEvent: setEvent
    };
})();
