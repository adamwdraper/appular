/*
 * @appular cookies v1.0.0 - Helper to create and update cookies
 */
define([
    'jquery'
], function($) {    
    var Cookies = {
            /*
             * @function set - set a cookie
             * @param value:string - value of cookie
             * @param [options:object] - path, domain, expires, encode
             */
            set: function (key, value, options) {
                options = $.extend({
                    path: '/',
                    domain: window.location.hostname.split('.').slice(-2).join('.'),
                    expires: 365,
                    encode: true
                }, options);
                
                // If a number is passed in, make it work like 'max-age' only for days
                options.expires = new Date(new Date().getTime() + (Number(options.expires) * 24 * 60 * 60 * 1000));

                if (options.encode) {
                    value = (String(value)).replace(/[^!#-+\--:<-\[\]-~]/g, encodeURIComponent);
                }
                        
                document.cookie = encodeURIComponent(key) + '=' + value + ';path=' + options.path + ';domain=' + options.domain + ';expires=' + options.expires.toGMTString();
            },

            /*
             * @function get - get a cookie value
             * @param name:string
             * @return value:string - returns string if cookie exists, null if it doesn't
             */
            get: function(name) {
                var nameEQ = encodeURIComponent(name) + '=',
                    cookiesArray = document.cookie.split(';'),
                    value = null;

                for (var i=0; i < cookiesArray.length; i++) {

                    var cookie = cookiesArray[i];
                    while (cookie.charAt(0) === ' ') {
                        cookie = cookie.substring(1, cookie.length);
                    }
                    if (cookie.indexOf(nameEQ) === 0) {
                        value = decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
                    }
                }
                
                return value;
            },
            
            /*
             * @function expire - expire a cookie
             * @param name:string
             */
            expire: function(name) {
                this.set(name, '', {
                    expires: -1
                });
            },
            /*
             * @function isEnabled - check if cookies are enabled
             * @param name:string
             * @return isEnabled:boolean - true if cookies are enabled
             */
            isEnabled: function () {
                this.set('cookiesIsEnabledTest', '1');
                var isEnabled = (this.get('cookiesIsEnabledTest') === '1') ? true : false;
                this.expire('cookiesIsEnabledTest');
                return isEnabled;
            }
        };

    return Cookies;
});