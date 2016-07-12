/**
 * Created by andy on 16/06/2014.
 */

(function() {

	if (typeof zapppopup.customMode != "undefined")
		zapppopup.addJsFile(zapppopup.libUrl + "/js/cookie-management.js");
	 
	 
    zapppopup.events = {};
    var clickedButton;

    function addMethods(proto, methods)
    {
        for (var methodSig in methods)
        {
            proto[methodSig] = methods[methodSig];
        }
    }

    function sendEvent(type, id, data) {
    	var postData = {
                id: id,
                eventType: type,
                data: data
         };
         window.parent.postMessage(JSON.stringify(postData), '*');
    }
    
   addMethods(zapppopup, {

   _setupPayConnect: function()
       {
          /* if (this.payConnectItem == null)
               return;
           var notify = JSON.parse(zapppopup1.getCookie(zapp.paymentNotificationCookie));
           if (notify !== null && typeof notify.pcid !== "undefined")
           {
               this.payConnectItem.ele.style.width = '100%';
               this.payConnectItem.ele.style.height = '100px';
               this.payConnectItem.ele.innerHTML = '<iframe src="' + this.libUrl + 'payconnect.html?pcid=' + notify.pcid + '" style="border: none; scroll: none; display: block; height: 100%; width: 100%;"></iframe>';
           }*/
       },
       isMobile1: function()
       {
           return zapppopup.platformSupportsZapp();
    	  // return true;
       },
       isTablet1: function()
       {
           return (zapppopup.isMobile1() && (navigator.userAgent.match('iPad') || !navigator.userAgent.match(/mobile/i)));
       },
       platformSupportsZapp: function()
       {
           var isiOS = navigator.userAgent.match(/iPhone|iPod|iPad/);
           var isAndroid = navigator.userAgent.match(/Android/);
           return (isiOS || isAndroid) ? true : false;
       },
       animate: function(element, properties, duration)
       {

           var boundingClient = zapppopup.getBoundingClient(element);

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

           // animTimer = setInterval(timerCallback, 0);

           offset = 1.0;

           timerCallback();

       },
	   registerEventHandler: function(name, fn)
       {
           if (typeof zapppopup.events[name] === "undefined")
        	   zapppopup.events[name] = [];
           zapppopup.events[name].push(fn);
       },
       triggerEvent: function (name, args)
       {
           if (typeof zapppopup.events[name] === "undefined")
               return;
           for (var idx = 0; idx < zapppopup.events[name].length; idx ++)
        	   zapppopup.events[name][idx](args);
       },
        _init: function()
        {

        	var self = this;
        	if (typeof zapppopup.customMode != "undefined")
        		self.addJsFile(zapppopup.libUrl + "/js/zpopup-extras.js?"+Math.random());

            /*zapppopup.registerEventHandler('com.zapp.extras.loaded', function () {
        	   zapppopup.addCssFile(self.libUrl + "/zapp.css");
                

        	   zapppopup.registerXEventHandler({
                    "com.zapp.popup.size": function(data) {
                        zapppopup._positionContextPopup(data.data);
                    },
                    "com.zapp.popup.size2": function(data) {
                    	zapppopup._positionContextPopup2(data.data);
                    }
                   
                });

                setTimeout(function() {
                    self._setupButtons();
                    self._setupPayConnect();
                }, 50);
            })*/
        	if (typeof zapppopup.customMode != "undefined")
            self.registerEventHandler('com.zapp.extras.loaded', function () {
            	self.addCssFile(zapppopup.libUrl + "/css/zapp.css");
            	self.registerXEventHandler({
                     "com.zapp.popup.size": function(data) {
                      	zapppopup._positionContextPopup(data.data);
                      },
                      "com.zapp.popup.size2": function(data) {
                      	zapppopup._positionContextPopup2(data.data);
                      },
                      "com.zapp.button.regen.click": function(data) {
                    	  sendEvent("pbba.button.regen.click", clickedButton.id, []);
                      }, 
                      "com.zapp.transaction.timeout": function(data) {
                    	  sendEvent("pbba.transaction.timeout", clickedButton.id, []);
                      },
                      "com.zapp.button.openapp.click": function(data) {
                    	zapppopup._invokeApp(data);
                      }
                  });
              })
        },
       /* _removeAllButtonPopups: function(exclusion)
        {
            for (var idx in zapp.buttonItems)
            {
                if (typeof exclusion !== "undefined" && idx == exclusion.id)
                    continue;
                var button = zapp.buttonItems[idx];
                button._finish();
            }
            return zapp;
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
        }*/
        
        _popup: null,
        _addPopup: function(ele)
        {
        	clickedButton=ele;
            if (zapppopup._popup != null)
                return zapppopup._popup;
            zapppopup._popup = new zapppopup.popup(ele.id);
            if (zapppopup.isMobile1())
                document.body.appendChild(zapppopup._popup.ele);
            else {
            	// zapppopup._popup.ele.style.display="none";
	            	if (ele.ele) 
	            		ele.ele.appendChild(zapppopup._popup.ele);
	            	else
	            		document.body.appendChild(zapppopup._popup.ele);
            	}
            	
            return zapppopup._popup;
        },
        _removePopup: function(force, ongoingTransaction, finishedTransaction)
        {
            if ((force || (!ongoingTransaction && !finishedTransaction)) && zapppopup._popup)
            {
            	zapppopup._popup.ele.parentNode.removeChild(zapppopup._popup.ele);
            	zapppopup._popup = null;
            }
            return zapppopup;
        },
        _positionContextPopup: function(size)
        {

            if (zapppopup._popup == null)
                return;

            var popupOffsetFromButton = 19;

            var iframe = zapppopup._popup.ele;
            var arrow = iframe.childNodes[1];

          
            if (zapppopup.isMobile1())
            {
                iframe.setAttribute("class", "zapp-popup-wrapper mobile");
                zapppopup.animate(iframe, {
                    width: size[0],
                    height: size[1]
                }, 0);
                zapppopup._popup.visible = true;
                zapppopup._popup.ele.style.left = "0";
                return;
            }
            
            var buttonBoxSize;
            if (clickedButton.ele)
            	buttonBoxSize = zapppopup.getBoundingClient(clickedButton.ele);
            else
            	buttonBoxSize = zapppopup.getBoundingClient(clickedButton);

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
                document.getElementById('pbba-popup-frame').style.top = "-6px";
            }
            else
            {
                destTop = (buttonBoxSize.height + popupOffsetFromButton);
                arrow.style.top = "-6px";
                arrow.style.bottom = "auto";
                arrow.style.borderBottomColor="#FFFFFF";
                arrow.style.borderRightColor="#FFFFFF";
                arrow.style.borderTopColor="#FF6E00";
                arrow.style.borderLeftColor="#FF6E00";
                document.getElementById('pbba-popup-frame').style.top = "-6px";
            }

            arrow.style.left = arrowHorizOffset + "px";

            if (horizontal == 0)
            {
                destLeft = -(size[0] - buttonBoxSize.width);
                arrow.style.right = arrowHorizOffset + "px";
                arrow.style.left = "auto";
            }

            zapppopup.animate(iframe, {width: size[0], height: size[1], top: destTop, left: destLeft}, (zapppopup._popup.visible) ? 150 : 0);
            
           // document.getElementById("zapp-popup").style.top=0;
        	//document.getElementById("zapp-popup").style.left=0;

            zapppopup._popup.visible = true;
            zapppopup._popup.ele.style.display = "block";

        },
        _positionContextPopup2: function(size)
        {

            if (zapppopup._popup == null)
                return;

            var popupOffsetFromButton = 19;

            zapppopup._popup.ele.style.display = "block";

            var iframe = zapppopup._popup.ele;
            var arrow = iframe.childNodes[1];

            if (zapppopup.isMobile1())
            {
                iframe.setAttribute("class", "zapp-popup-wrapper mobile");
                zapppopup.animate(iframe, {
                    width: size[0],
                    height: 'auto'
                }, 0);
                zapppopup._popup.visible = true;
                zapppopup._popup.ele.style.left = "0";
                return;
            }

            var buttonBoxSize;
            var isCustomButton;
            if (clickedButton.ele)
            	buttonBoxSize = zapppopup.getBoundingClient(clickedButton.ele);
            else {
            		buttonBoxSize = zapppopup.getBoundingClient(clickedButton);
            		isCustomButton = true;
            	}
            	

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

            zapppopup.animate(iframe, {width: size[0], height: size[1], top: destTop, left: destLeft}, (zapppopup._popup.visible) ? 150 : 0);

            if (!zapppopup.isMobile1()) {
            	document.getElementById("zapp-popup").style.top=0;
            	document.getElementById("zapp-popup").style.left=0;
            	document.getElementById("zapp-popup").style.marginLeft='22%';
            	document.getElementById("zapp-popup").style.height='450px';
            	document.getElementById("zapp-popup").style.marginTop='10%';
            	document.getElementById("zapp-popup").style.position='fixed';
             	jQuery('.zapp-arrow').hide();
  
             	var width = jQuery(window).width() - jQuery(window).width() * .4;
             	document.getElementById("zapp-popup").className="";
             	document.getElementById("zapp-popup").getElementsByTagName('iframe')[0].style.setProperty("min-width", "20%", "important");
             	//document.getElementById("zapp-popup").getElementsByTagName('iframe')[0].style.setProperty("height",  400+"px", "important");

            }
            
            zapppopup._popup.visible = true;
  
            	
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

            var instance = null;
            instance = typeof zapppopup.customMode == "undefined" ? zapp : zapppopup;
            
            var a = document.createElement('a');
            a.href = instance.options.callbackUrl;

            if (a.protocol != "https:" && a.protocol != "http:")
                return instance.options.callbackUrl;

            var protocol = a.protocol.replace(":", "");
            a.protocol = browsers[browser][protocol];

            return a.href;

        },
        _invokeApp: function(btn)
        {

        	var self = btn;
        	
            var url = null;

            if (typeof zapppopup.customMode == "undefined")
            {
            	
                url = "zapp://" + this.secureToken;
            }
            else {
                url = "zapp://"+ this.secureToken;
            }

            

            var isInstalledCallback = function(isInstalled) {

                var isiOS = navigator.userAgent.match(/iPhone|iPod|iPad/),
                    isAndroid = navigator.userAgent.match(/Android/);
                var androidUrl = 'https://play.google.com/',
                    iosAppUrl = 'itms-apps://itunes.apple.com/app/my-app/';
                if (isInstalled)
                {
                    return;
                }

                if (typeof zapppopup.customMode == "undefined" && zapp.hasApp)
                {
                	 zapppopup.removeAppCookie();
                } else if (typeof zapp == "undefined" && zapppopup.getCookie("hasApp")) {
                	zapppopup.removeAppCookie();
                }

                //self.popup.sendMessage("com.zapp.popup.state", "noBankApp");
               
                zapppopup._popup.sendMessage(self, "com.zapp.popup.state", "noBankApp");

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
                        if (true) {
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
                }, 3000);

                window.location = url;
            }

            return this;
        },
        _brnTimer: null,
        _transactionTimer: null,
        _startTimers : function (clickedButton) {
        	var self = clickedButton;
        	 this._brnTimer = setTimeout(function() {
                 zapppopup._addPopup(self).sendMessage(self, "com.zapp.popup.state", "brnTimeout");
             }, zapppopup.retrievalExpiryInterval * 1000);
             this._transactionTimer = setTimeout(function() {
                 zapppopup._addPopup(self).sendMessage(self, "com.zapp.popup.state", "transactionTimeout");
                 sendEvent("com.zapp.transaction.timeout", self.id, []);
             }, (zapppopup.retrievalExpiryInterval + zapppopup.confirmationExpiryInterval) * 1000);
        },
        _stopTimers: function()
        {
            var timers = ["_brnTimer", "_transactionTimer"];
            for (var idx = 0; idx < timers.length; idx ++)
            {
                if (this[timers[idx]] == null)
                    continue;
                clearInterval(this[timers[idx]]);
                clearTimeout(this[timers[idx]]);
                this[timers[idx]] = null;
            }
        },
        /*sendMessage: function(eventType, data)
        {
            var ele = zapppopup.ele.firstChild;
            var postData = {
                eventType: eventType,
                id: zapp.id,
                data: data
            };
            zapppopup._messageQueue.push(postData);
            zapppopup.processMessageQueue();
            return zapppopup;
        },
        processMessageQueue: function()
        {
            if (zapppopup._processingQueue || zapppopup._messageQueue.length == 0)
                return;
            var ele = zapp.ele.firstChild;
            if (zapppopup.loaded && ele.contentWindow != null)
            {
            	zapppopup._processingQueue = true;
                for (var idx = 0; idx <= this._messageQueue.length; idx++)
                {
                    var item = zapppopup._messageQueue[0];
                    zapppopup._messageQueue.shift();
                    ele.contentWindow.postMessage(JSON.stringify(item), zapp.url.replace(/[0-9\.]+\/$/, ""));
                }
                zapppopup._processingQueue = false;
                zapppopup.processMessageQueue();
            }
        }*/
        
        
    });

/*    addMethods(zapppopup.prototype, {
      
        _popup: null,
        _addPopup: function()
        {
            if (this._popup != null)
                return this._popup;
            this._popup = new zapppopup.popup(this.id);
            if (zapp.isMobile())
                document.body.appendChild(this._popup.ele);
            else
                this.ele.appendChild(this._popup.ele);
            return this._popup;
        },
        _removePopup: function(force)
        {
            if ((force || (!this._ongoingTransaction() && !this.finishedTransaction)) && this._popup)
            {
                this._popup.ele.parentNode.removeChild(this._popup.ele);
                this._popup = null;
            }
            return this;
        },
        _positionContextPopup: function(size)
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

        }
        
    });*/

    zapppopup.popup = function(id)
    {
        var self = this;
        this.ele = document.createElement("div");
        this.loaded = false;
        this._messageQueue = [];
        if (typeof zapppopup.customMode != "undefined")
        	this.ele.innerHTML = '<iframe id="pbba-popup-frame" src="' + zapppopup.libUrl + '/html/popup.html" marginheight="0" marginwidth="0"  frameborder="0"></iframe><div class="zapp-arrow"></div>';
        else
        	this.ele.innerHTML = '<iframe id="pbba-popup-frame" src="' + zapp.libUrl + '/html/popup.html" marginheight="0" marginwidth="0"  frameborder="0"></iframe><div class="zapp-arrow"></div>';
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

    addMethods(zapppopup.popup.prototype, {
    	sendMessage: function(button, eventType, data)
        {
    		data.isMobile = zapppopup.isMobile1();
    		data.isTablet = zapppopup.isTablet1();
    		data.supportsZapp = zapppopup.platformSupportsZapp();
            var ele = this.ele.firstChild;
            var postData;
            if (typeof button.ele != "undefined" && typeof button.ele.className != "undefined" && button.ele.className == "zapp-button") {
            	 postData = {
                         eventType: eventType,
                         id: button.id,
                         data: data
                 };

            } else {
            	data.id = "CUSTOM";
                postData = {
                        eventType: eventType,
                        id: data.id,
                        data: data
                };
            }
            	
            
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
                    if (typeof zapppopup.url != "undefined")
                    	ele.contentWindow.postMessage(JSON.stringify(item), zapppopup.url.replace(/[0-9\.]+\/$/, ""));
                    else
                    	ele.contentWindow.postMessage(JSON.stringify(item), zapp.url.replace(/[0-9\.]+\/$/, ""));
                }
                this._processingQueue = false;
                this.processMessageQueue();
            }
        }
    });

    zapppopup._init();

}).call(this);

///////// RESPONSES //////////

zapppopup.response = function() {};

zapppopup.response.payment = function(params)
{
    for (var prop in params)
    	zapppopup[prop] = params[prop];
    zapppopup.validate = function()
    {

    };
    return zapppopup;
};

zapppopup.response.notify = function(params)
{
    for (var prop in params)
    	zapppopup[prop] = params[prop];
    zapppopup.validate = function()
    {

    };
    return zapppopup;
};

///////// REQUESTS /////////

zapppopup.request = function() {};

zapppopup.request.payment = function(params)
{
    for (var prop in params)
    	zapppopup[prop] = params[prop];
    zapppopup.validate = function()
    {

    };
    return zapppopup;
};

zapppopup.request.notify = function(params)
{
    for (var prop in params)
    	zapppopup[prop] = params[prop];
    zapppopup.validate = function()
    {

    };
    return zapppopup;
};
