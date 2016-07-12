/**
 * Created by andy on 16/06/2014.
 */

(function() {

    zapp.events = {};

    function addMethods(proto, methods)
    {
        for (var methodSig in methods)
        {
            proto[methodSig] = methods[methodSig];
        }
    }

    addMethods(zapp, {
        paymentNotificationCookie: "zappPaymentNotificationStatus",
        isMobile: function()
        {
            return zapp.platformSupportsZapp();
        },
        isTablet: function()
        {
            return (zapp.isMobile() && (navigator.userAgent.match('iPad') || !navigator.userAgent.match(/mobile/i)));
        },
        platformSupportsZapp: function()
        {
            var isiOS = navigator.userAgent.match(/iPhone|iPod|iPad/);
            var isAndroid = navigator.userAgent.match(/Android/);
            return (isiOS || isAndroid) ? true : false;
        },
        registerEventHandler: function(name, fn)
        {
            if (typeof zapp.events[name] === "undefined")
                zapp.events[name] = [];
            zapp.events[name].push(fn);
        },
        triggerEvent: function (name, args)
        {
            if (typeof zapp.events[name] === "undefined")
                return;
            for (var idx = 0; idx < zapp.events[name].length; idx ++)
                zapp.events[name][idx](args);
        },
        _init: function()
        {

           var self = this;

           /*console.log('loading latest files -> ' + Math.random());*/
        	zapp.addJsFile(this.libUrl + "/js/extras.js");
            zapp.addJsFile(this.libUrl + "/js/zapp-popup.js");
            zapp.addJsFile(this.libUrl + "/js/cookie-management.js");
            /*document.write('<' + 'script src="http://zapp-proxy.com:28081/zapp-default/1.2.0/js/cookie-management.js"' +
                    ' type="text/javascript"><' + '/script>');*/
            
            self.registerEventHandler('com.zapp.extras.loaded', function () {
        		self.addCssFile(zapp.libUrl + "/css/zapp.css");

        		self.registerXEventHandler({
                    "com.zapp.button.click": function(data) {
                    	self.pcid = data.pcid;
                    	self.hasApp = data.hasApp;
                        var button = zapp._getButtonWithId(data.id);
                        button.click();
                    },
                    "com.zapp.popup.size": function(data) {
                    	zapppopup._positionContextPopup(data.data);
                    },
                    "com.zapp.popup.size2": function(data) {
                    	zapppopup._positionContextPopup2(data.data);
                    },
                    "com.zapp.button.openapp.click": function(data) {
                    	zapppopup._invokeApp(data);
                    },
                    "com.zapp.button.regen.click": function(data) {
                    	self._getButtonWithId(data.id)._pay();
                    },
                    "com.zapp.popup.close": function(data) {
                    	self._getButtonWithId(data.id)._finish();
                    },
                    "com.zapp.transaction.timeout": function(data) {
                    	self._getButtonWithId(data.id)._transactionTimeout();
                    }
                });

                setTimeout(function() {
                	self._setupButtons();
                	//zapppopup._setupPayConnect();
                }, 50);
            })
        },
       /* _removeAllButtonPopups: function(exclusion)
        {
            for (var idx in this.buttonItems)
            {
                if (typeof exclusion !== "undefined" && idx == exclusion.id)
                    continue;
                var button = this.buttonItems[idx];
                button._finish();
            }
            return this;
        },*/
        _getButtonWithId: function(id)
        {
            return this.buttonItems[id];
        },
        _setupButtons: function() {
            for (var idx in this.buttonItems)
            {
                this.buttonItems[idx]._setupButton();
            }
        },
        /*animate: function(element, properties, duration)
        {

            var boundingClient = zapp.getBoundingClient(element);

            var start = {};
            var _properties = properties;
            var _element = element;

            for (var property in properties)
            {
                switch (property)
                {
                    case 'height':
                    {
                        start['height'] = element.offsetHeight;
                        break;
                    }
                    case 'width':
                    {
                        start['width'] = element.clientWidth;
                        break;
                    }
                    case 'top':
                    {
                        start[property] = element.offsetTop;
                        break;
                    }
                    case 'left':
                    {
                        start[property] = element.offsetLeft;
                        break;
                    }
                }
                if (start[property] == _properties[property])
                    delete start[property];
            }

            var lastTime = new Date().getTime();

            var offset = duration <= 13 ? 1.0 : 0.0;

            var step = (13 / duration);

            var animTimer = null;

            var timerCallback = function() {

                for (var property in start)
                {
                    _element.style[property] = Math.round((((_properties[property] - start[property]) * offset) + start[property])) + "px";
                }

                var currentTime = new Date().getTime();
                var timeOffset = currentTime - lastTime;
                if (offset >= 1.0 && animTimer)
                    clearInterval(animTimer);
                offset += (step / 13) * timeOffset;
                offset = Math.min(offset, 1.0);
                lastTime = currentTime;
            };

        //    animTimer = setInterval(timerCallback, 0);

            offset = 1.0;

            timerCallback();

        },*/
       /* _setupPayConnect: function()
        {
            if (this.payConnectItem == null)
                return;
            var notify = JSON.parse(zapp.getCookie(zapp.paymentNotificationCookie));
            if (notify !== null && typeof notify.pcid !== "undefined")
            {
                this.payConnectItem.ele.style.width = '100%';
                this.payConnectItem.ele.style.height = '100px';
                this.payConnectItem.ele.innerHTML = '<iframe src="' + this.libUrl + 'payconnect.html?pcid=' + notify.pcid + '" style="border: none; scroll: none; display: block; height: 100%; width: 100%;"></iframe>';
            }
        },*/
        notify: function(response)
        {

        }
    });

    addMethods(zapp.button.prototype, {
        canStartNewPayment: function()
        {
            if (this._ongoingTransaction())
                return false;
            if (!this.enabled)
                return false;
            if (this.retryTimestamp >= new Date().getTime())
                return false;
            return true;
        },
        click: function()
        {
            if (!this.canStartNewPayment()) {
                console.log('Cannot start new payment');
                this._finish();
                return;
            }
           // zapp._removeAllButtonPopups(this);
           // $('#cover').show();
            this._pay();
        },
        _ongoingTransaction: function()
        {
            return (this.activeTransaction || this.pendingTransaction);
        },
        _setupButton: function()
        {
            var self = this;

            if (typeof this.options["paymentType"] === "undefined")
                this.options.paymentType = zapp.paymentType.instant;
            if (typeof this.options["checkoutType"] === "undefined")
                this.options.checkoutType = zapp.checkoutType.quick;
            if (typeof this.options["deliveryType"] === "undefined")
                this.options.deliveryType = zapp.deliveryType.address;
            this.options.isMobile = zapp.isMobile();

            var queryString = 'src=' + self.options.imageSrc + '&id=' + self.id;
            if (typeof self.options['cornerRadius'] !== "undefined")
                queryString += "&cornerRadius=" + params['cornerRadius'];
            if (typeof self.options['backgroundColor'] !== "undefined")
                queryString += "&backgroundColor=" + params['backgroundColor'];
            var height = self.ele.clientHeight;
            if (height == 0)
                height = 46;
            self.ele.innerHTML = '<iframe id="pbba-button-frame-'+self.id+'" src="' + zapp.libUrl + '/html/button.html?' + queryString + '" style="border: 0; scroll: none; display: block; height:' + height + 'px; width: 100%;" marginheight="0" marginwidth="0" frameborder="0"></iframe>';

            if (!zapp.isMobile())
            {

                self.ele.onmouseover = function () {
                    self._hover = true;
                    if (self._ongoingTransaction() || self.finishedTransaction)
                        return;
                   /*zapppopup._addPopup(self).sendMessage(self, "com.zapp.popup.state", "ready");*/
                   setTimeout(function () {
                    	   zapppopup._addPopup(self).sendMessage(self, "com.zapp.popup.state", "ready");
                   }, 100);
                };

                self.ele.onmouseout = function () {
                    self._hover = false;
                    setTimeout(function () {
                        if (!self._hover)
                        	zapppopup._removePopup(false, self._ongoingTransaction(), self.finishedTransaction);
                    }, 100);
                };

//                self.ele.onmousemove = function () {
//
//                };

            }
        },
        _hover: false,
        /*_popup: null,*/
        pendingTransaction: false,
        activeTransaction: false,
        finishedTransaction: false,
        enabled: true,
        _setEnabled: function(enabled)
        {
            this.enabled = enabled;
            if (enabled)
                this._sendMessage("com.zapp.button.enable", []);
            else
                this._sendMessage("com.zapp.button.disable", []);
        },
        retryTimestamp: 0,
       /* _addPopup: function()
        {
            if (this._popup != null)
                return this._popup;
            this._popup = new zapp.button.popup(this.id);
            if (zapp.isMobile())
                document.body.appendChild(this._popup.ele);
            else
                this.ele.appendChild(this._popup.ele);
            return this._popup;
        }, */
        
        _pay: function()
        {

            var self = this;

            self.pendingTransaction = true;

            self.retryTimestamp = new Date().getTime() + 10000;

            this._setEnabled(false);

            setTimeout(function() {
                if (!self._ongoingTransaction())
                    self._setEnabled(true);
            }, 10000);

            // Generate Browser Info
            this.options.browserInfo = {
                userAgent: navigator.userAgent,
                timeZone: "hgfhgf",
                screen: screen.width+"x"+screen.height
            };

            this.options.pcid = zapp.pcid;

            zapp.options.pay(this.options, function(response) {

                // Was transaction request cancelled?
                if (!self.pendingTransaction)
                    return;

                self.pendingTransaction = false;

                if (!response instanceof zapppopup.response.payment)
                {
                    alert("error pay method expects return type of zapp.response.payment");
                    return false;
                }

                var popup = null;

                self.options.transaction = response;

                if (!response.success)
                {
                    self.finishedTransaction = true;
                    self._sendMessage("com.zapp.button.stop");
                    popup = zapppopup._addPopup(self).sendMessage(self, "com.zapp.popup.state", "requestFailure");
                    popup.ele.className = "";
                    return;
                }

                self.activeTransaction = true;
                
                if (zapp.hasApp)
                {
                	zapppopup._invokeApp(self);
                    return;
                } 
                
               /* response.isMobile = zapp.isMobile();
                response.isTablet = zapp.isTablet();
                response.supportsZapp = zapp.platformSupportsZapp();*/
                response.id = self.id;
                if (response.notificationSent && zapp.pcid)
                    response.pcid = zapp.pcid;

                popup = zapppopup._addPopup(self).sendMessage(self, "com.zapp.popup.data", response);
                popup.ele.className = "";
                if (zapp.options.notify)
                {
                    self._startNotification();
                }
            });
        },
        /*_positionContextPopup: function(size)
        {

            if (this._popup == null)
                return;

            var popupOffsetFromButton = 19;

            this._popup.ele.style.display = "block";

            var iframe = this._popup.ele;
            var arrow = iframe.childNodes[1];

          
            if (zapp.isMobile())
            {
                iframe.setAttribute("class", "zapp-popup-wrapper mobile");
                zapp.animate(iframe.firstChild, {
                    width: size[0],
                    height: size[1]
                }, 0);
                this._popup.visible = true;
                this._popup.ele.style.left = "0";
                return;
            }

            var buttonBoxSize = zapp.getBoundingClient(this.ele);

            var vertical = (buttonBoxSize.window.top > buttonBoxSize.document.bottom) ? 0 : 1;
            var horizontal = (buttonBoxSize.document.left > buttonBoxSize.document.right) ? 0 : 1;

            var destTop = 0;
            var destLeft = -60;

            var arrowHorizOffset = (buttonBoxSize.width - arrow.clientWidth) * 0.9;

            if (vertical == 0)
            {
                destTop = -(size[1] + popupOffsetFromButton);
                arrow.style.borderBottomColor="#FF6E00";
                arrow.style.borderRightColor="#FF6E00";
                arrow.style.borderTopColor="#FFFFFF";
                arrow.style.borderLeftColor="#FFFFFF";
            }
            else
            {
                destTop = (buttonBoxSize.height + popupOffsetFromButton);
                arrow.style.top = "-13px";
                arrow.style.bottom = "auto";
                arrow.style.borderBottomColor="#FFFFFF";
                arrow.style.borderRightColor="#FFFFFF";
                arrow.style.borderTopColor="#FF6E00";
                arrow.style.borderLeftColor="#FF6E00";
            }

            arrow.style.left = arrowHorizOffset + "px";

            if (horizontal == 0)
            {
                destLeft = -(size[0] - buttonBoxSize.width);
                arrow.style.right = arrowHorizOffset + "px";
                arrow.style.left = "auto";
            }

            zapp.animate(iframe, {width: size[0], height: size[1], top: destTop, left: destLeft}, (this._popup.visible) ? 150 : 0);

            this._popup.visible = true;

        },
        _positionContextPopup2: function(size)
        {

            if (this._popup == null)
                return;

            var popupOffsetFromButton = 19;

            this._popup.ele.style.display = "block";

            var iframe = this._popup.ele;
            var arrow = iframe.childNodes[1];

            if (zapp.isMobile())
            {
                iframe.setAttribute("class", "zapp-popup-wrapper mobile");
                zapp.animate(iframe.firstChild, {
                    width: size[0],
                    height: size[1]
                }, 0);
                this._popup.visible = true;
                this._popup.ele.style.left = "0";
                return;
            }

            var buttonBoxSize = zapp.getBoundingClient(this.ele);

            var vertical = (buttonBoxSize.window.top > buttonBoxSize.document.bottom) ? 0 : 1;
            var horizontal = (buttonBoxSize.document.left > buttonBoxSize.document.right) ? 0 : 1;

            var destTop = 0;
            var destLeft = -60;

            var arrowHorizOffset = (buttonBoxSize.width - arrow.clientWidth) * 0.9;

            if (vertical == 0)
            {
                destTop = -(size[1] + popupOffsetFromButton);
            }
            else
            {
                destTop = (buttonBoxSize.height + popupOffsetFromButton);
                arrow.style.top = "-11px";
                arrow.style.bottom = "auto";
            }

            arrow.style.left = arrowHorizOffset + "px";

            if (horizontal == 0)
            {
                destLeft = -(size[0] - buttonBoxSize.width);
                arrow.style.right = arrowHorizOffset + "px";
                arrow.style.left = "auto";
            }

            zapp.animate(iframe, {width: size[0], height: size[1], top: destTop, left: destLeft}, (this._popup.visible) ? 150 : 0);

  
            	document.getElementById("zapp-popup").style.top=0;
            	document.getElementById("zapp-popup").style.left=0;
            	document.getElementById("zapp-popup").style.marginLeft='22%';
            	document.getElementById("zapp-popup").style.height='450px';
            	document.getElementById("zapp-popup").style.marginTop='10%';
            	document.getElementById("zapp-popup").style.position='fixed';
             	$('.zapp-arrow').hide();
  
             	var width = $(window).width() - $(window).width() * .5;
             	document.getElementById("zapp-popup").getElementsByTagName('iframe')[0].style.width=width+'px';
            this._popup.visible = true;

        },*/
        _sendMessage: function(eventType, data)
        {
            var ele = this.ele.firstChild;

            var postData = {
                eventType: eventType,
                id: this.id,
                data: data
            };

            setTimeout(function() {
                ele.contentWindow.postMessage(JSON.stringify(postData), zapp.url);
            }, 5);

            return this;
        },
        _finish: function()
        {
            this.activeTransaction = false;
            this.pendingTransaction = false;
            this.finishedTransaction = false;
            if (this.retryTimestamp <= new Date().getTime())
                this._setEnabled(true);
            this._stopNotification();
            this._sendMessage("com.zapp.button.stop", []);
            zapppopup._removePopup(true);
        },
        _notifyTimer: null,
      //  _brnTimer: null,
       // _transactionTimer: null,
        _startNotification: function()
        {
            var self = this;
            if (this._notifyTimer != null)
                return;
            this._notifyTimer = setInterval(function() {
                zapp.options.notify(self.options.transaction.secureToken, function (response) {
                    if (response.success)
                    {
        //                self._finish();
                        self._notify(response);
                        zapp.notify(response);
                    }
                    else
                    {

                    }
                });
            }, 5000);
            zapppopup._startTimers(self);
            /*this._brnTimer = setTimeout(function() {
                zapppopup._addPopup(self).sendMessage(self, "com.zapp.popup.state", "brnTimeout");
            }, this.options.transaction.retrievalExpiryInterval * 1000);
            this._transactionTimer = setTimeout(function() {
                self._stopNotification();
                self._sendMessage("com.zapp.button.stop", []);
                self.activeTransaction = false;
                self.finishedTransaction = true;
                zapppopup._addPopup(self).sendMessage(self, "com.zapp.popup.state", "transactionTimeout");
            }, (this.options.transaction.retrievalExpiryInterval + this.options.transaction.confirmationExpiryInterval) * 1000);*/
        },
        _transactionTimeout: function()
        {
        	var self = this;
        	self._stopNotification();
            self._sendMessage("com.zapp.button.stop", []);
            self.activeTransaction = false;
            self.finishedTransaction = true;
        },
        _stopNotification: function()
        {
            var timers = ["_notifyTimer"];
            for (var idx = 0; idx < timers.length; idx ++)
            {
                if (this[timers[idx]] == null)
                    continue;
                clearInterval(this[timers[idx]]);
                clearTimeout(this[timers[idx]]);
                this[timers[idx]] = null;
            }
            zapppopup._stopTimers();
        },
        _getCallbackUrlForBrowser: function()
        {

            var browsers = {
                "safari": { https: "https", http: "http" },
                "chrome": { https: "googlechromes", http: "googlechrome" },
                "opera": { https: "https", http: "http" },
                "firefox": { https: "https", http: "http" },
                "default": { https: "https", http: "http" }
            };

            var browser = "default";

            if (navigator.userAgent.match(/safari/i))
                browser = "safari";
            if (navigator.userAgent.match(/firefox/i))
                browser = "firefox";
            if (navigator.userAgent.match(/chrome/i))
                browser = "chrome";
            if (navigator.userAgent.match(/opera/i))
                browser = "opera";

            var a = document.createElement('a');
            a.href = zapp.options.callbackUrl;

            if (a.protocol != "https:" && a.protocol != "http:")
                return zapp.options.callbackUrl;

            var protocol = a.protocol.replace(":", "");
            a.protocol = browsers[browser][protocol];

            return a.href;

        },
        /*_invokeApp: function()
        {

            var url = null;

            if (zapp.hasApp)
            {
                url = "zapp://" + this.options.transaction.aptid + '/' + this.options.transaction.secureToken + "?x-source=" + encodeURIComponent(this._getCallbackUrlForBrowser());
            }
            else {
                url = "zapp://" + this.options.transaction.aptid + '/' + this.options.transaction.secureToken + "?x-source=" + encodeURIComponent(zapp.libUrl + "/html/action.html?action=redirect&url=" + encodeURIComponent(this._getCallbackUrlForBrowser()));
            }

            var self = this;

            var isInstalledCallback = function(isInstalled) {

                var isiOS = navigator.userAgent.match(/iPhone|iPod|iPad/),
                    isAndroid = navigator.userAgent.match(/Android/);
                var androidUrl = 'https://play.google.com/',
                    iosAppUrl = 'itms-apps://itunes.apple.com/app/my-app/';
                if (isInstalled)
                {
                    return;
                }

                if (zapp.hasApp)
                {
                    var ele = document.getElementById("zappAction");
                    if (!ele)
                    {
                        ele = document.createElement("iframe");
                        ele.id = "zappAction";
                    }
                    ele.setAttribute("src", zappBaseUrl + "/html/action.html?action=removeHasApp");
                    document.body.appendChild(ele);
                    zapp.hasApp = false;
                }

                self.popup.sendMessage("com.zapp.popup.state", "noBankApp");

            };

            if (navigator.userAgent.match(/Android/))
            {
                // For Android Google Chrome only
                if (navigator.userAgent.match(/Chrome/))
                {
                    var MANY_APPS_INSTALLED = 0,
                        NO_APP_INSTALLED = 1,
                        ONE_APP_INSTALLED = 2;

                    window.blured = false;
                    window.onblur = function()
                    {
                        window.blured = true;
                    };

                    var appInstalledSum = 0;

                    // close second window (if no app installed);
                    setTimeout(function() {
                        appInstalledSum += document.webkitHidden;
                        customPage.close();
                    }, 1000);

                    // execute callback on no app installed
                    setTimeout(function() {
                        appInstalledSum += document.webkitHidden;
                        if (window.blured) {
                            isInstalledCallback(appInstalledSum !== NO_APP_INSTALLED);
                        }
                    }, 2000);

                    var customPage = window.open(url);

                }
                else
                {
                    // Older Android browser
                    var iframe = document.createElement("iframe");
                    iframe.style.border = "none";
                    iframe.style.width = "1px";
                    iframe.style.height = "1px";
                    var t = setTimeout(function()
                    {
                        isInstalledCallback(document.webkitHidden);
                    }, 1000);
                    iframe.onload = function()
                    {
                        clearTimeout(t);
                    };
                    iframe.src = url;
                    document.body.appendChild(iframe);
                }

            }
            else// if (navigator.userAgent.match(/iPhone|iPad|iPod/))
            {
                // IOS
                setTimeout(function() {
                    if (!document.webkitHidden) {
                        isInstalledCallback(false); //noInstalled
                    } else {
                        isInstalledCallback(true);
                    }
                }, 500);

                window.location = url;
            }

            return this;
        },*/
        _notify: function(response)
        {
            //zapp.setCookie(zapp.paymentNotificationCookie, JSON.stringify(response), 90000);
        }
    });

  /*  zapp.button.popup = function(id)
    {
        var self = this;
        this.ele = document.createElement("div");
        this.loaded = false;
        this._messageQueue = [];
        this.ele.innerHTML = '<iframe src="' + zapp.libUrl + 'popup.html" marginheight="0" marginwidth="0"  frameborder="0"></iframe><div class="zapp-arrow"></div>';
        this.ele.style.left = "0px";
        this.ele.id = "zapp-popup";
        this.ele.className = "dark";
        this._processingQueue = false;
        this.id = id;

        var loadFn = function() {
            self.loaded = true;
            self.processMessageQueue();
        };

        if (typeof addEventListener === "undefined")
            this.ele.firstChild.attachEvent("onload", loadFn);
        else
            this.ele.firstChild.addEventListener("load", loadFn);

    };
*/
    /*addMethods(zapp.button.popup.prototype, {
        sendMessage: function(eventType, data)
        {
            var ele = this.ele.firstChild;
            var postData = {
                eventType: eventType,
                id: this.id,
                data: data
            };
            this._messageQueue.push(postData);
            this.processMessageQueue();
            return this;
        },
        processMessageQueue: function()
        {
            if (this._processingQueue || this._messageQueue.length == 0)
                return;
            var ele = this.ele.firstChild;
            if (this.loaded && ele.contentWindow != null)
            {
                this._processingQueue = true;
                for (var idx = 0; idx <= this._messageQueue.length; idx++)
                {
                    var item = this._messageQueue[0];
                    this._messageQueue.shift();
                    ele.contentWindow.postMessage(JSON.stringify(item), zapp.url.replace(/[0-9\.]+\/$/, ""));
                }
                this._processingQueue = false;
                this.processMessageQueue();
            }
        }
    });*/

    zapp._init();

}).call(this);

///////// RESPONSES //////////

/*zapp.response = function() {};

zapp.response.payment = function(params)
{
    for (var prop in params)
        this[prop] = params[prop];
    this.validate = function()
    {

    };
    return this;
};

zapp.response.notify = function(params)
{
    for (var prop in params)
        this[prop] = params[prop];
    this.validate = function()
    {

    };
    return this;
};
*/
///////// REQUESTS /////////

/*zapp.request = function() {};

zapp.request.payment = function(params)
{
    for (var prop in params)
        this[prop] = params[prop];
    this.validate = function()
    {

    };
    return this;
};

zapp.request.notify = function(params)
{
    for (var prop in params)
        this[prop] = params[prop];
    this.validate = function()
    {

    };
    return this;
}; */

zapp.paymentType = {
    "instant": 0,
    "billpay": 1,
    "smb": 2
};

zapp.checkoutType = {
    "normal": 0,
    "quick": 1
};

zapp.deliveryType = {
    "address": 0,
    "collect": 1,
    "digital": 2,
    "f2f": 3,
    "service": 4
};