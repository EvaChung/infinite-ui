/*!
 * JavaScript Cookie v2.1.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */

function extend () {
    var i = 0;
    var result = {};
    for (; i < arguments.length; i++) {
        var attributes = arguments[ i ];
        for (var key in attributes) {
            result[key] = attributes[key];
        }
    }
    return result;
}
function converter(){}

var cookie={
    defaults:{},
    api:function(key, value, attributes) {
        var result;
        var _this=this;
        if (typeof document === 'undefined') {
            return;
        }

        // Write

        if (arguments.length > 1) {
            attributes = extend({
                path: '/'
            }, _this.defaults, attributes);

            if (typeof attributes.expires === 'number') {
                var expires = new Date();
                expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                attributes.expires = expires;
            }

            // We're using "expires" because "max-age" is not supported by IE
            attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

            try {
                result = JSON.stringify(value);
                if (/^[\{\[]/.test(result)) {
                    value = result;
                }
            } catch (e) {}

            if (!converter.write) {
                value = encodeURIComponent(String(value))
                    .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
            } else {
                value = converter.write(value, key);
            }

            key = encodeURIComponent(String(key));
            key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
            key = key.replace(/[\(\)]/g, escape);

            var stringifiedAttributes = '';

            for (var attributeName in attributes) {
                if (!attributes[attributeName]) {
                    continue;
                }
                stringifiedAttributes += '; ' + attributeName;
                if (attributes[attributeName] === true) {
                    continue;
                }
                stringifiedAttributes += '=' + attributes[attributeName];
            }
            return (document.cookie = key + '=' + value + stringifiedAttributes);
        }

        // Read

        if (!key) {
            result = {};
        }

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling "get()"
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var rdecode = /(%[0-9A-Z]{2})+/g;
        var i = 0;

        for (; i < cookies.length; i++) {
            var parts = cookies[i].split('=');
            var cookie = parts.slice(1).join('=');

            if (cookie.charAt(0) === '"') {
                cookie = cookie.slice(1, -1);
            }

            try {
                var name = parts[0].replace(rdecode, decodeURIComponent);
                cookie = converter.read ?
                    converter.read(cookie, name) : converter(cookie, name) ||
                    cookie.replace(rdecode, decodeURIComponent);

                if (this.json) {
                    try {
                        cookie = JSON.parse(cookie);
                    } catch (e) {}
                }

                if (key === name) {
                    result = cookie;
                    break;
                }

                if (!key) {
                    result[name] = cookie;
                }
            } catch (e) {}
        }

        return result;
    },
    set:function (key, value, attributes) {
        return cookie.api.call(cookie, key, value, attributes);
    },
    get:function (key) {
        return cookie.api.call(cookie, key);
    },
    getJson:function () {
        return cookie.api.apply({
            json: true
        }, [].slice.call(arguments));
    },
    remove:function (key, attributes) {
        cookie.api(key, '', extend(attributes, {
            expires: -1
        }));
    },
    clear:function(){
        var json = cookie.getJson();
        for(var key in json){
            cookie.remove(key);
        }

    }
}

module.exports = {
    cookie: cookie
};
