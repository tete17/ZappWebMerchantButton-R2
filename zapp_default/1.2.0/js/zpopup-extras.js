/**
 * Created by andy on 11/08/2014.
 */

window.zapppopup = window.zapppopup || {};

(function() {

    zapppopup._readyCallbacks = [];
    zapppopup._readyCallback = false;

    if (!zapppopup.registerEventHandler)
    {

    	zapppopup.events = {};

    	zapppopup.registerEventHandler = function (name, fn) {
            if (typeof zapppopup.events[name] === "undefined")
            	zapppopup.events[name] = [];
            zapppopup.events[name].push(fn);
        };

        zapppopup.triggerEvent = function (name, args) {
            if (typeof zapppopup.events[name] === "undefined")
                return;
            for (var idx = 0; idx < zapppopup.events[name].length; idx ++)
            	zapppopup.events[name][idx](args);
        };

    }

    
    zapppopup.documentReady = function(callback)
    {
    	zapppopup._readyCallbacks.push(callback);
        if (zapppopup._readyCallback)
            return;
        document.onreadystatechange = function() {
            if (document.readyState === "complete")
                for (var i = 0; i < zapppopup._readyCallbacks.length; i ++)
                	zapppopup._readyCallbacks[i]();
        };
        zapppopup._readyCallback = true;
    };


    zapppopup.registerXEventHandler = function(events, target)
    {

    	zapppopup.bindEvent("message", function(ev) {

    		try {
                data = JSON.parse(ev.data);
            } catch (err) {
                return;
            }

            if (typeof data.eventType === "undefined" || data.eventType.indexOf("com.zapp") == -1)
                return;

            if (!events[data.eventType])
            {
                alert("Unhandled Event : " + data.eventType);
                return;
            }

            if (typeof events[data.eventType] !== "function")
            {
                alert("Event handler for " + data.eventType + " is not a function");
                return;
            }

            events[data.eventType](data);

        }, target);

    };
    
    zapppopup.extendObj = function()
    {
        var obj = {};
        for (var idx in arguments)
        {
            if (typeof (arguments[idx]) !== "object")
                continue;
            for (var prop in arguments[idx])
                obj[prop] = arguments[idx][prop];
        }
        return obj;
    };

    /**
     *
     * @param elem
     * @returns {{document: {top: number, left: number, right: number, bottom: number}, window: {top: Number, left: Number, right: number, bottom: number}, height: Number, width: Number}}
     */
    zapppopup.getBoundingClient = function(elem)
    {
        var box = elem.getBoundingClientRect();

        var getSize = function(prop)
        {
            var doc = elem.ownerDocument,
                docElem = doc.documentElement,
                body = doc.body;
            return docElem[prop] || body[prop] || 0;
        };

        return {
            document: {
                top: box.top + getSize('scrollTop') - getSize('clientTop'),
                left: box.left + getSize('scrollLeft') - getSize('clientLeft'),
                right: getSize('clientWidth') - box.right,
                bottom: getSize('clientHeight') - box.bottom
            },
            window: {
                top: box.top,
                left: box.left,
                right: window.screen.width - box.right,
                bottom: window.screen.height - box.bottom
            },
            height: box.bottom - box.top,
            width: box.right - box.left
        };
    };

    /**
     *
     * @param url
     */
    zapppopup.addCssFile =  function(url)
    {
        var script = document.createElement('link');
        script.setAttribute('type', 'text/css');
        script.setAttribute('rel', 'stylesheet');
        script.setAttribute('media', 'all');
        script.setAttribute('href', url);
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    /**
     * Bind the callback to an event
     *
     * @param {string} eventName
     * @param {function} callback
     * @param {Element} target
     * @returns {undefined}
     */
    zapppopup.bindEvent =  function(eventName, callback, target) {
        target = target || window;
        if (typeof (target.addEventListener) !== "undefined") {
            target.addEventListener(eventName, callback, false);
        } else if (typeof (target.attachEvent) !== "undefined") {
            target.attachEvent("on" + eventName, callback);
        } else {
            target["on" + eventName] = callback;
        }
    };

    /**
     * @param {string} className description
     */
    zapppopup.hasClassName = function(ele, className)
    {
        return (' ' + ele.className + ' ').indexOf(' ' + className + ' ') > -1;
    };

    /**
     * @param {string} className description
     */
    zapppopup.addClassName = function(ele, className)
    {
        if (zapp.hasClassName(ele, className))
            return ele;
        var a = ele.className + " " + className;
        ele.className = a[0] === " " ? a.substring(1, a.length) : a;
        return ele;
    };

    /**
     * @param {string} className description
     */
    zapppopup.removeClassName = function(ele, className)
    {
        if (!zapp.hasClassName(ele, className))
            return ele;
        var a = " " + ele.className + " ",
            b = " " + className + " ",
            c = a.indexOf(b),
            d = a.substring(0, c) + " " + a.substring(c + b.length, a.length);
        ele.className = d.substring(1, d.length - 1);
        return ele;
    };

    /**
     *
     * @param name
     * @returns {string}
     */
    zapppopup.getParameterByName =  function(name)
    {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    zapppopup.setAppCookie =  function(cookieManagementUrl)
    {
        var ele = document.getElementById("zappAction");
        if (!ele)
        {
            ele = document.createElement("iframe");
            ele.id = "zappAction";
        }
        if (typeof zapp != "undefined" && typeof zapp.options != "undefined")
        	ele.setAttribute("src", zapp.options.cookieManagementUrl + "cookie-management/set-app-cookie.html");
        else if (typeof zapppopup != "undefined" && typeof zapppopup.options != "undefined")
        	ele.setAttribute("src", zapppopup.options.cookieManagementUrl + "cookie-management/set-app-cookie.html");
        else if (cookieManagementUrl != null && cookieManagementUrl != "")
        	ele.setAttribute("src", cookieManagementUrl + "cookie-management/set-app-cookie.html");
        else
        	alert("Cannot set app cookie!");
        
        document.body.appendChild(ele);
        
    };
    
    zapppopup.removeAppCookie =  function(cookieManagementUrl)
    {
        var ele = document.getElementById("zappAction");
        if (!ele)
        {
            ele = document.createElement("iframe");
            ele.id = "zappAction";
        }
        if (typeof zapp != "undefined" && typeof zapp.options != "undefined")
        	ele.setAttribute("src", zapppopup.options.cookieManagementUrl + "cookie-management/remove-app-cookie.html");
        else if (typeof zapppopup != "undefined" && typeof zapppopup.options != "undefined")
        	ele.setAttribute("src", zapp.options.cookieManagementUrl + "cookie-management/remove-app-cookie.html");
        else if (cookieManagementUrl != null && cookieManagementUrl != "")
        	ele.setAttribute("src", cookieManagementUrl + "cookie-management/remove-app-cookie.html");
        else
        	alert("Cannot remove app cookie!");
        
        document.body.appendChild(ele);
        
    };

    /**
     *
     * @param c_name
     * @returns {HTMLCollection}
     */
    zapppopup.getCookie =  function(c_name)
    {
        var c_value = document.cookie;

        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start === -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start === -1) {
            c_value = null;
        }
        else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end === -1) {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start, c_end));
        }
        return c_value;
    };

})();

// Fire Loaded Event (This comes last to make sure the methods have been loaded)
setTimeout(function() {
	if (zapppopup.triggerEvent)
		zapppopup.triggerEvent("com.zapp.extras.loaded");
}, 200);

