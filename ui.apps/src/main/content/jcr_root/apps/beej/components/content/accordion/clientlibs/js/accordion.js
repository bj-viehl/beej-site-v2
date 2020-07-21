NS('beej.UI').Accordion = beej.UI.BaseClass.extend(
    (function() {
        'use strict';

        return {
            /**
             * @function setup
             * @description Initializes the current class instance.
             * @memberOf beej.UI.Accordion.
             * @returns {}
             */
            setup: function() {

                this._super();
                this._bindEvents();

                this.$accordionItem = $('.beej-accordion__item', this.$el);
            },

            /**
             * @function _bindEvents
             * @description Bind events
             * @memberOf beej.UI.Accordion.
             * @returns {void}
             */
            _bindEvents: function() {
                var _this = this;

                this.$accordionItem.on('click', '.beej-accordion__item-title', function() {
                    var accordionOpen = $(this).parent().hasClass('beej-accordion__item--open');

                    if (accordionOpen == true) {
                        $(this).parent().removeClass('beej-accordion__item--open');
                    } else {
                        $(this).parent().addClass('beej-accordion__item--open');
                    }

                    $(this).siblings('.beej-accordion__item-content').slideToggle();
                });
            }
        };
    })()
);
beej.Utils.registerMod('accordion', beej.UI.Accordion);
