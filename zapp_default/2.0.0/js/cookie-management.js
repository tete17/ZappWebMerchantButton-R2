/**
 * This is the cookie management script which loads a cookie in an iframe. 
 * This is needed for establishing pay connect. 
 */
function setCookie(key, value, cookieExpiryDays, url) {
		var iframe = document.getElementById('pcid-iframe');
		iframe.src = url +"cookie-management/index.html?pcid="+value+"&cookieExpiryDays="+cookieExpiryDays;
    }