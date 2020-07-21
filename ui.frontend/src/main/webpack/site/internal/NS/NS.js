/**
 * @function NS
 * @param {object} global Reference to caller
 * @returns {function}
 */
window.NS =
    window.NS ||
    (function(global) {
        'use strict';

        /**
         * @class Namespace
         * @description Allows for instanceof checks
         */
        function Namespace() {}

        return function(namespace) {
            var bits = namespace.split('.'),
                bitLength = bits.length,
                lastRef = global,
                bit = null,
                i;

            // Create a collection to store namespaces that have already been created
            if (typeof window.NS.knownNamespaces === 'undefined') {
                window.NS.knownNamespaces = {};
            }

            // Check if the namespace exists already
            // If so, simply return it for speed, else create it from the bits
            if (typeof window.NS.knownNamespaces[namespace] === 'object') {
                return window.NS.knownNamespaces[namespace];
            } else {
                // Parse bits
                for (i = 0; i < bitLength; i = i + 1) {
                    // Current bit
                    bit = bits[i];

                    // Validate bit exists and is a Namespace instance
                    // If you wish your object to be extendable, add a boolean property:
                    // NSEXTENDABLE = true
                    if (typeof lastRef[bit] !== 'undefined') {
                        if (
                            lastRef[bit] instanceof Namespace === false &&
                            lastRef[bit].NSEXTENDABLE !== true &&
                            (i === 0 && ['hsbc'].indexOf(bit) > -1) === false
                        ) {
                            throw new Error('Non-namespace object exists:' + bit);
                        }
                        // Assign
                        lastRef = lastRef[bit];
                        // Continue
                        continue;
                    }

                    // Create new Namespace instance
                    lastRef[bit] = new Namespace();

                    // Declare lastRef for return and save it to the known namespaces collection
                    lastRef = lastRef[bit];
                    window.NS.knownNamespaces[namespace] = lastRef;
                }
            }
            // Return reference
            return lastRef;
        };
    })(window);
