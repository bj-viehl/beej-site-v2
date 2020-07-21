NS('beej.UI').Header = beej.UI.BaseClass.extend(
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
                this._init();
                this._bindEvents();

                this.$menuButton = $('.beej-header__menu-button', this.$el);
            },

            /**
             * @function init
             * @description Initializes init function.
             * @memberOf beej.UI.header.
             * @returns {}
             */
             _init: function() {
                 function desktopMenu() {
                      var windowWidth = $(window).width();

                      if (windowWidth > 900) {
                          console.log('over 900 px');
                          $('.beej-header__menu').show();
                      }
                 }

                 $(window).resize(function() {
                     desktopMenu();
                 });
              },

            /**
             * @function _bindEvents
             * @description Bind events
             * @memberOf beej.UI.Header.
             * @returns {void}
             */
            _bindEvents: function() {
                var _this = this;

                this.$menuButton.on('click', function() {
                    var navOpen = $('.beej-header').hasClass('beej-header--open');

                    if (navOpen == true) {
                        $('.beej-header').removeClass('beej-header--open');
                    } else {
                        $('.beej-header').addClass('beej-header--open');
                    }

                    $('.beej-header__menu').slideToggle('fast');
                });
            }
        };
    })()
);
beej.Utils.registerMod('header', beej.UI.Header);