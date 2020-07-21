/* global NS:true, Class:true */
/**
 * @class beej.UI.BaseClass
 * @description <p>A base, extendable class for all pure UI modules</p>
 <p>This uses John Resig's simple prototypical inheritence model</p>
 * @extends Class
 * @memberOf medically.UI
 */
NS('beej.UI').BaseClass = Class.extend(
    (function() {
        'use strict';

        var UTILS = beej.Utils;

        return {
            /**
             * @property {object} $el Reference to the jQuery element
             * @memberOf beej.UI.BaseClass
             */
            $el: null,
            /**
             * @property {object} elData Element configuration
             * @memberOf beej.UI.BaseClass
             */
            elData: {},
            /**
             * @property {object} cfg Original configuration
             * @memberOf beej.UI.BaseClass
             */
            cfg: {},
            /**
             * @property {object} el Reference to the DOM element
             * @memberOf beej.UI.BaseClass
             */
            el: null,
            /**
             * @property {boolean} isInitialized Current initialization status
             * @memberOf beej.UI.BaseClass
             */
            isInitialized: false,
            /**
             * @property {boolean} isSetup Current setup status
             * @memberOf beej.UI.BaseClass
             */
            isSetup: false,
            /**
             * @property {string} mod Module shortname used to initialize the instance
             * @memberOf beej.UI.BaseClass
             */
            mod: '',
            /**
             * @function init
             * @description Initializes the current class instance
             * @memberOf beej.UI.BaseClass
             * @param {object} cfg Configuration object
             * @returns {object}
             */
            init: function(cfg) {
                var _this = this;

                if (typeof cfg === 'object' && cfg !== null) {
                    UTILS.transferProperties(cfg, _this, true);
                    _this.cfg = cfg;
                }

                if (!_this.el instanceof HTMLElement) {
                    return null;
                }
                _this.el.instance = _this;
                _this.$el = $(_this.el);
                _this.elData = _this.el.dataset;
                if (typeof _this.elData === 'object' && _this.elData !== null) {
                    UTILS.transferProperties(_this.elData, _this, true);
                }

                _this.el.classList.add('initialized');
                _this.isInitialized = true;

                _this.setup();
            },
            /**
             * @function _setup
             * @description Performs all basic setup tasks for a module
             * @memberOf beej.UI.BaseClass
             * @abstract
             * @returns {void}
             */
            setup: function() {
                this.el.classList.add('setup');
                this.isSetup = true;
            }
        };
    })()
);
beej.Utils.registerMod('baseclass', beej.UI.BaseClass);
