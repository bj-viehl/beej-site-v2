/**
 * @class Utils
 * @description Utils
 * @extends default
 */
NS('beej').Utils = (function() {
    'use strict';
    return {
        /**
         * @property {object} registeredMods A collection of mods registered for classes
         * @memberOf Utils
         */
        registeredMods: {},
        /**
         * @function transferProperties
         * @description Transfers keys from one object to another cleanly
         * @memberOf Utils
         * @param {object} source Object sharing properties
         * @param {object} target Object receiving properties
         * @param {boolean} typesafe Optional boolean to enable type safety when transferring
         * @param {boolean} concatenateArrays Should arrays be concatenated?
         * @param {boolean} recurse Should we recurse through objects?
         * @param {function} customSetPropertyFn How should the property get set?
         * @returns {void}
         */
        transferProperties: function(source, target, typesafe, concatenateArrays, recurse, customSetPropertyFn) {
            var keys = Object.keys(source),
                keysLength = this.validNumber(keys.length),
                hasSetProperty = typeof target.setProperty === 'function',
                value = null,
                jsonStr = '',
                jsonObj = null,
                isJSON = false,
                i = 0,
                key = null,
                targetValue = null,
                targetType = '',
                sourceValue = null,
                passedTypeCheck = false,
                setPropertyFn = function(propertyName, value) {
                    try {
                        this[propertyName] = value;
                    } catch (e) {
                        console.log(e);
                    }
                };

            if (hasSetProperty === true) {
                setPropertyFn = target.setProperty;
            }

            if (typeof customSetPropertyFn === 'function') {
                setPropertyFn = customSetPropertyFn;
            }

            for (i = 0; i < keysLength; i = i + 1) {
                key = keys[i];
                targetValue = target[key];
                targetType = typeof targetValue;
                sourceValue = source[key];
                jsonStr = sourceValue;
                jsonObj = null;
                isJSON = false;

                if (Array.isArray(targetValue) === true) {
                    targetType = 'array';
                }
                if (Array.isArray(sourceValue) === true) {
                    sourceValue = this.arrayToJSONArray(sourceValue);
                }

                if (typeof jsonStr === 'string') {
                    jsonStr = this.replaceEntities(jsonStr).replace(/\\"/g, '"');

                    try {
                        jsonObj = JSON.parse(jsonStr);
                        isJSON = true;
                    } catch (e) {
                        jsonObj = null;
                        isJSON = false;
                    }
                }

                if (isJSON === true) {
                    value = jsonObj;
                } else if (typesafe === true && targetValue !== null && targetType !== 'undefined') {
                    switch (targetType) {
                        case 'object':
                            value = this.validObject(sourceValue, {});
                            break;
                        case 'array':
                            value = this.arrayToJSONArray(sourceValue);
                            if (concatenateArrays === true) {
                                value = Array.isArray(value) === true ? value.concat(targetValue) : targetValue;
                            }
                            break;
                        case 'boolean':
                            value = this.validBoolean(sourceValue, false);
                            break;
                        case 'number':
                            value = this.validNumber(sourceValue, 0);
                            break;
                        case 'string':
                            value = this.validString(sourceValue, '');
                            break;
                        default:
                            value = sourceValue;
                            break;
                    }
                } else {
                    value = sourceValue;
                }

                if (
                    recurse === true &&
                    Array.isArray(value) === false &&
                    typeof targetValue === 'object' &&
                    targetValue !== null &&
                    typeof value === 'object' &&
                    value !== null
                ) {
                    this.transferProperties(value, targetValue, typesafe, concatenateArrays, recurse, setPropertyFn);
                    value = targetValue;
                    passedTypeCheck = true;
                } else if (typesafe !== true) {
                    passedTypeCheck = true;
                } else {
                    passedTypeCheck =
                        targetType === 'undefined' ||
                        (targetType !== 'undefined' &&
                            (typeof value === targetType || Object.prototype.toString.call(value) === '[object Array]'));
                }

                if (passedTypeCheck === true) {
                    setPropertyFn.apply(target, [key, value]);
                }
            }
        },
        /**
         * @function validObject
         * @description Check that an object resolves to a valid object
         * @memberOf Utils
         * @param {object} obj Object to validate
         * @param optional {boolean} returnValue Optional return value
         * @returns {boolean}
         */
        validObject: function(obj, returnValue) {
            if (typeof obj === 'object') {
                return obj;
            } else {
                try {
                    returnValue = JSON.parse(obj);
                } catch (e) {
                    console.log(e);
                }
                return typeof returnValue === 'object' ? returnValue : {};
            }
        },
        /**
         * @function validBoolean
         * @description Check that an object resolves to a valid boolean
         * @memberOf Utils
         * @param {object} obj Object to validate
         * @param optional {boolean} returnValue Optional return value
         * @returns {boolean}
         */
        validBoolean: function(obj, returnValue) {
            if (typeof obj === 'boolean') {
                return obj;
            } else if (typeof obj === 'string' && obj === 'true') {
                return true;
            } else if (typeof obj === 'string' && obj === 'false') {
                return false;
            } else if (typeof obj === 'number' && obj === 1) {
                return true;
            } else if (typeof obj === 'number' && obj === 0) {
                return false;
            } else if (typeof returnValue === 'boolean') {
                return returnValue;
            } else {
                return false;
            }
        },
        /**
         * @function validNumber
         * @description Check that an object resolves to a valid number
         * @memberOf Utils
         * @param {object} obj Object to validate
         * @param optional {number} returnValue Optional return value
         * @returns {number}
         */
        validNumber: function(obj, returnValue) {
            if (typeof obj === 'number') {
                return obj;
            } else if (isNaN(parseInt(obj, 10)) === false) {
                return parseInt(obj, 10);
            } else if (typeof returnValue === 'number') {
                return returnValue;
            } else if (isNaN(parseInt(returnValue, 10)) === false) {
                return parseInt(returnValue, 10);
            } else {
                return 0;
            }
        },
        /**
         * @function validString
         * @description Check that an object resolves to a valid string
         * @memberOf Utils
         * @param {object} obj Object to validate
         * @param optional {string} returnValue Optional return value
         * @returns {string}
         */
        validString: function(obj, returnValue) {
            if (typeof obj === 'string' && obj !== '') {
                returnValue = obj;
            }

            if (typeof returnValue !== 'string') {
                returnValue = '';
            }

            return returnValue;
        },
        /**
         * @function replaceEntities
         * @description Replaces HTML entities within a string
         * @memberOf Utils
         * @param {string} str The string to sanitize
         * @returns {string} The sanitized string
         */
        replaceEntities: function(str) {
            var returnValue = this.validString(str);

            if (returnValue !== '') {
                returnValue = returnValue.replace(/&034;/g, '"').replace(/&quot;/g, '"');
            }

            return returnValue;
        },
        /**
         * @function arrayToJSONArray
         * @description Attempts to turn a string array into a JSON array
         * @memberOf Utils
         * @param {object} array The object to attempt to parse
         * @returns {object}
         */
        arrayToJSONArray: function(array) {
            var testObj = null,
                jsonObj = null,
                isJSON = false,
                i = 0;

            if (Array.isArray(array) === true) {
                try {
                    testObj = JSON.parse(array[0].replace('&quot;', '"'));
                    if (typeof testObj === 'object') {
                        jsonObj = [];

                        for (i = 0; i < array.length; i = i + 1) {
                            jsonObj.push(JSON.parse(array[i].replace('&quot;', '"')));
                        }
                    }
                    isJSON = true;
                } catch (e) {
                    testObj = null;
                    jsonObj = null;
                    isJSON = false;
                }
                if (isJSON === true) {
                    array = jsonObj;
                }
            }
            return array;
        },
        /**
         * @function resolveClass
         * @description Initializes an instance of a class at a given path
         * @memberOf Utils
         * @param {object} config The configuration to provide the instance
         * @param optional {boolean} returnInstance Return the instance reference to the caller?
         * @returns {*}
         */
        resolveClass: function(ClassRef, config, returnInstance) {
            var newInstance = null;

            if (typeof config !== 'object' || config === null) {
                config = {};
            }

            if (typeof ClassRef === 'function') {
                try {
                    newInstance = new ClassRef(config);
                } catch (e) {
                    console.log(e);
                }
            }

            if (returnInstance === true) {
                return newInstance;
            }
        },

        /**
         * @function registerMod
         * @description Registers a module for binding to elements
         * @memberOf Utils
         * @param {string} mod The module name to register
         * @param {function} ClassRef The constructor for the module
         * @param optional {type} cfg The optional default configuration for the module
         * @returns {boolean} Did we successfully add a new mod?
         */
        registerMod: function(mod, ClassRef, cfg) {
            var returnValue = false,
                modObj = {};

            mod = this.validString(mod).toLowerCase();

            if (mod === '' || typeof ClassRef !== 'function') {
                return returnValue;
            }

            if (typeof this.registeredMods[mod] !== 'object' || this.registeredMods[mod] === null) {
                modObj.ClassRef = ClassRef;
                modObj.cfg = typeof cfg === 'object' ? this.validObject(cfg) : {};

                this.registeredMods[mod] = modObj;
                returnValue = true;
            }

            return returnValue;
        },
        /**
         * @function bindScope
         * @description Binds all modules within a scope, defaulting to document
         * @memberOf Utils
         * @param {object} elScope The scope to target for binding
         * @returns {void}
         */
        bindScope: function(elScope) {
            var i = 0,
                modEl = null,
                modEls = [],
                modElCount = 0,
                modElId = '';

            if (typeof elScope !== 'object' || elScope === null || typeof elScope.querySelectorAll !== 'function') {
                elScope = document;
            }

            modEls = elScope.querySelectorAll('[data-mod]:not(.initialized)');
            modElCount = modEls.length;

            for (i = 0; i < modElCount; i++) {
                modEl = modEls[i];
                modElId = this.validString(modEl.id);

                if (modEl.classList.contains('initialized') === false) {
                    this.resolveMod(modEl);
                }
            }
        },
        /**
         * @function resolveMod
         * @description Resolves a module and binds it to an element
         * @memberOf Utils
         * @param {object} el The element to bind to
         * @returns {object}
         */
        resolveMod: function(el) {
            var mod = '',
                modObj = null,
                modCfg = {};

            mod = this.validString(el.getAttribute('data-mod')).toLowerCase();

            if (mod !== '') {
                modObj = this.registeredMods[mod];
            }

            if (mod === '' || (mod !== '' && typeof modObj === 'undefined')) {
                return null;
            }

            if (typeof modObj === 'object' && typeof modObj.cfg === 'object') {
                this.transferProperties(modObj.cfg, modCfg, true, true, true);
            }

            modCfg.el = el;

            this.resolveClass(modObj.ClassRef, modCfg, false);
        },
        /**
         * @function getUrlParameters
         * @description Get parameters mapping from a url string
         * @memberOf Utils
         * @param {object} urlLocation An object Location
         * @returns {object}
         */
        getUrlParameters: function(urlLocation) {
            var queryString = '',
                urlVariables = [],
                parameters = {};

            if (urlLocation.search) {
                queryString = urlLocation.search;
                urlVariables = queryString.split('&');

                urlVariables.forEach(function(value, i) {
                    var parameterItem = value.split('=');

                    if (i === 0 && parameterItem[0].indexOf('?') === 0) {
                        parameterItem[0] = parameterItem[0].substring(1);
                    }

                    if (medically.Utils.validString(parameterItem[0]) !== '') {
                        parameters[parameterItem[0]] = parameterItem[1];
                    }
                });
            }

            return parameters;
        },
        /**
         * @function traverseBits
         * @description Traverses a series of bits within a root object
         * @memberOf Utils
         * @param {string} bits The dot-separated list of bits to traverse
         * @param {object} root The root object to search on
         * @param {string} type Optional type to expect, defaults to object
         * @returns {unresolved}
         */
        traverseBits: function(bits, root, type) {
            var bitArray = typeof bits === 'string' ? bits.split('.') : [],
                LastRef = typeof root === 'object' && root !== null ? root : window,
                traversalFailed = false,
                returnValue = null;

            type = this.validString(type, 'object');

            bitArray.some(function(bit) {
                try {
                    LastRef = LastRef[bit];
                } catch (e) {
                    traversalFailed = true;
                    type = 'failed';
                    return true;
                }
            });

            if (traversalFailed === false && typeof LastRef === type) {
                returnValue = LastRef;
            }

            return returnValue;
        },
        /**
         * @function debounce
         * @description debounces a function to only fire once in a timewindow
         * @memberOf Utils
         * @param {function} func The function to debounce
         * @param {number} wait Time to debounce function calls for, in ms
         * @param {boolean} leading Should the function call on the leading edge of the wait time
         * @return {function} the debounced function
         */
        debounce: function(func, wait, leading) {
            var immediate = this.validBoolean(leading),
                timeout = null,
                debounced = null;

            if (typeof func !== 'function') {
                return func;
            }

            debounced = function() {
                var callNow = immediate === true && timeout === null,
                    scope = this,
                    args = arguments,
                    later = function() {
                        timeout = null;

                        if (immediate === false) {
                            func.apply(scope, args);
                        }
                    };

                clearTimeout(timeout);
                timeout = setTimeout(later, wait);

                if (callNow === true) {
                    func.apply(scope, args);
                }
            };
            return debounced;
        },

        /**
         * @function setCookie
         * @description Handles the click event of Order Sample button
         * @memberOf Utils
         * @param {string} cookieName Cookie name
         * @param {string} cookieValue Cookie value
         * @param {number} exDays Number of days to expire
         * @returns {void}
         */
        setCookie: function(cookieName, cookieValue, exDays) {
            var date = new Date();
            date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * exDays);
            document.cookie = cookieName + '=' + cookieValue + ';path=/;expires=' + date.toGMTString();
        },

        /**
         * @function removeCookie
         * @description Handles the click event of Submit Order button
         * @memberOf Utils
         * @param {string} cookieName Cookie name
         * @returns {void}
         */
        deleteCookie: function(cookieName) {
            this.setCookie(cookieName, '', -1);
        },
        /**
         * @function getCookie
         * @description Handles cookie after page refresh
         * @memberOf Utils
         * @param {string} cookieName Cookie name
         * @returns {string} Cookie substring
         */
        getCookie: function(cookieName) {
            var cookie = document.cookie.match('(^|;) ?' + cookieName + '=([^;]*)(;|$)');
            return cookie ? cookie[2] : null;
        },
        /**
         * @function replaceTokens
         * @description Replaces tokens in a string with values from a collection
         * @memberOf Utils
         * @param {string} str String to format
         * @param {object} values Collection of named values to match
         * @param optional {string} startToken Start pattern for a token
         * @param optional {string} endToken End pattern for a token
         * @returns {string}
         */
        replaceTokens: function(str, values, startToken, endToken) {
            var allowedTypes = ['string', 'number', 'boolean'],
                valuesIsValid = typeof values === 'object' && values !== null,
                name = '',
                value = '',
                key = '';

            str = this.validString(str);
            startToken = this.validString(startToken, '{');
            endToken = this.validString(endToken, '}');

            if (str === '' || valuesIsValid === false) {
                return str;
            }

            for (key in values) {
                if (values.hasOwnProperty(key)) {
                    name = key;
                    value = values[key];

                    if (values.hasOwnProperty(key) && allowedTypes.indexOf(typeof value) > -1) {
                        str = str.replace(startToken + name + endToken, value.toString());
                    }
                }
            }

            return str;
        },

        /**
         * @function setLocalValue
         * @description Attempts to save a value in localStorage
         * @memberOf Utils
         * @param {string} key The name of the item to create
         * @param {object} value The value for the item
         * @returns {void}
         */
        setLocalValue: function(key, value) {
            var valueType = typeof value;

            if (valueType === 'undefined') {
                return;
            }

            if (valueType === 'object' && value !== null) {
                value = JSON.stringify(value);
            }

            localStorage.setItem(key, value.toString());
        },
        /**
         * @function setSessionValue
         * @description Attempts to save a value in sessionStorage
         * @memberOf Utils
         * @param {string} key The name of the item to create
         * @param {object} value The value for the item
         * @returns {void}
         */
        setSessionValue: function(key, value) {
            var valueType = typeof value;

            if (valueType === 'undefined') {
                return;
            }

            if (valueType === 'object' && value !== null) {
                value = JSON.stringify(value);
            }

            sessionStorage.setItem(key, value.toString());
        },

        /**
         * @function getLocalValue
         * @description Attempts to read a value from localStorage
         * @memberOf Utils
         * @param {string} key Name of item to retrieve
         * @param {object} defaultValue The default value to return
         * @returns {object} The local value, the default value, or an empty string
         */
        getLocalValue: function(key, defaultValue) {
            var returnType = typeof defaultValue !== 'undefined' ? typeof defaultValue : 'string',
                returnValue = '',
                localValue = '';

            if (localStorage === null && typeof localStorage !== 'object') {
                return typeof defaultValue !== 'undefined' ? defaultValue : '';
            }

            localValue = localStorage.getItem(key);

            if (localValue !== null && localValue !== '') {
                switch (returnType) {
                    case 'boolean':
                        returnValue = this.validBoolean(localValue, defaultValue);
                        break;
                    case 'number':
                        returnValue = this.validNumber(localValue, defaultValue);
                        break;
                    case 'object':
                        returnValue = this.validObject(localValue, defaultValue);
                        break;
                    default:
                        returnValue = this.validString(localValue, defaultValue);
                        break;
                }
            } else {
                returnValue = defaultValue;
            }

            return returnValue;
        },

        /**
         * @function getSessionValue
         * @description Attempts to read a value from sessionStorage
         * @memberOf Utils
         * @param {string} key Name of item to retrieve
         * @param {object} defaultValue The default value to return
         * @returns {object} The session value, the default value, or an empty string
         */
        getSessionValue: function(key, defaultValue) {
            var returnType = typeof defaultValue !== 'undefined' ? typeof defaultValue : 'string',
                returnValue = '',
                sessionValue = '';

            if (sessionStorage === null && typeof sessionStorage !== 'object') {
                return typeof defaultValue !== 'undefined' ? defaultValue : '';
            }

            sessionValue = sessionStorage.getItem(key);

            if (sessionValue !== null && sessionValue !== '') {
                switch (returnType) {
                    case 'boolean':
                        returnValue = this.validBoolean(sessionValue, defaultValue);
                        break;
                    case 'number':
                        returnValue = this.validNumber(sessionValue, defaultValue);
                        break;
                    case 'object':
                        returnValue = this.validObject(sessionValue, defaultValue);
                        break;
                    default:
                        returnValue = this.validString(sessionValue, defaultValue);
                        break;
                }
            } else {
                returnValue = defaultValue;
            }

            return returnValue;
        },
        /**
         * @function clearLocalValue
         * @description Attempts to remove a value from localStorage
         * @memberOf msiip.Data
         * @param {string} key Name of item to clear
         * @returns {void}
         */
        clearLocalValue: function(key) {
            if (localStorage !== null && typeof localStorage === 'object') {
                return;
            }

            localStorage.removeItem(key);
        },
        /**
         * @function clearSessionValue
         * @description Attempts to clear a value from sessionStorage
         * @memberOf Utils
         * @param {string} key Name of item to clear
         * @returns {void}
         */
        clearSessionValue: function(key) {
            if (sessionStorage !== null && typeof sessionStorage === 'object') {
                return;
            }

            sessionStorage.removeItem(key);
        },
        /**
         * @function getWcmMode
         * @description Get Wcm mode.
         * @memberOf Utils
         * @returns {string}
         */
        getWcmMode: function() {
            var returnVal = 'publish',
                $html = $('html');
            if ($html.hasClass('aem-AuthorLayer-Preview')) {
                returnVal = 'preview';
            } else if ($html.hasClass('aem-AuthorLayer-Edit')) {
                returnVal = 'edit';
            } else if ($html.hasClass('aem-AuthorLayer-Design')) {
                returnVal = 'design';
            } else if ($html.hasClass('aem-AuthorLayer-Developer')) {
                returnVal = 'developer';
            }

            return returnVal;
        },
        /**
         * @function isInViewport
         * @description Checks whether element is in viewport.
         * @memberOf Utils
         * @param {object} $el Jquery reference to the element.
         * @returns {boolean}
         */
        isInViewport: function($el) {
            var $window = $(window),
                elementTop = $el.offset().top,
                elementBottom = elementTop + $el.outerHeight(),
                viewportTop = $window.scrollTop(),
                viewportBottom = viewportTop + $window.height();

            return elementBottom > viewportTop && elementTop < viewportBottom;
        },
        /**
         * @function stopScroll
         * @description Stop scroll.
         * @memberOf Utils
         * @returns {void}
         */
        stopScroll: function() {
            // Get the current page scroll position
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

            // if any scroll is attempted, set this to the previous value
            window.onscroll = function() {
                window.scrollTo(scrollLeft, scrollTop);
            };

            setTimeout(function() {
                window.onscroll = function() {};
            }, 1000);
        },
        /**
         * @function backEvent
         * @description Back Event.
         * @memberOf Utils
         * @returns {void}
         */
        backEvent: function($el) {
            var home = window.location.origin;
            var parent = $el.data('parent');
            var from = document.referrer;

            if (from && from.includes(home)) {
                window.location.href = from;
            } else {
                if (parent) {
                    window.location.href = parent;
                } else {
                    window.location.href = home;
                }
            }
        },
        /**
         * @function findIndex
         * @description Find index.
         * @memberOf Utils
         * @returns {void}
         */
        findIndex: function(arr, fn) {
            return arr.reduce(function(carry, item, idx) {
                if (fn(item, idx)) {
                    return idx;
                }

                return carry;
            }, -1);
        }
    };
})();
