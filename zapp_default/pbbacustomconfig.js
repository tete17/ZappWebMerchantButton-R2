/* 
 * This configuration file is used to define and override variables and functions for the Pay By Bank Web Merchant Button.
 * 
 */


/* Define the PBBA variables */

var zappVersion = "2.0.0"; // Current web merchant button library version.
var cookieManagementUrl = "http://www.paybybankapp.co.uk/" // Cookie management URL for PayConnect.
var imageKey = 1; // Default imageKey is 1 for the standard Pay By Bank App Web Merchant Button.
var merchantPollInterval = 5000; // Default merchant poll interval of 5 seconds to poll the merchant server for payment notification.


/* Initialize PayConnect. */

window.onload = function() {
	setupPayConnect(cookieManagementUrl, document); 
	
}

/* Override the pay() and notify() functions.  */

zapp.load(zappVersion, {
	pay : function(data, callback) {

		/* The only data that is required to be posted to the merchant server from the PBBA Web Merchant Button is the pcid */
		var postData = {
			postData.pcid = data.pcid;
		};

		/* 
		 *	1.	Post the data to the merchant server.
		 *
		 *	2.	SUCCESSFUL RESPONSE - Upon receipt of a successful response from the merchant server:
		 * 		
		 *		A.	Create a response object by populate the following mandatory PBBA attributes:
		 *
		 *    		var response = new zapppopup.response.payment({
						success : true,
						secureToken : <secureToken from the response returned from the Zapp server>,
						aptid : <aptId from the response returned from the Zapp server>,
						brn : <brn from the response returned from the Zapp server>,
						retrievalExpiryInterval : <retrievalExpiryInterval from the response returned from the Zapp server>,
						confirmationExpiryInterval : <confirmationExpiryInterval from the response returned from the Zapp server>,
						notificationSent: <notificationSent from the response returned from the Zapp server>,
						pcid: null,
						cfiShortName: <cfiShortName from the response returned from the Zapp server>
					});
		 *
		 * 		B.	Make a callback passing in the response object created in Step A above:
		 *
		 *			callback(response);
		 *
		 *	3.	ERROR - Upon receipt of an error from the merchant server:
		 *		
		 *		A.	Create a new response object by populating the following fields:
		 *
		 *			var response = new zapppopup.response.payment({
						success : false,
						data : <response from the merchant server converted to JSON format>
					});
		 *
		 *		B.	Make a callback passing in the response object created in Step A above:
		 *
		 *			callback(response);
		 */
		
	},
	notify : function(secureToken, callback) {

		/*	1. 	This method polls the merchant server for a response every X seconds.
		 * 	  	X is the value for merchantPollInterval.
		 *
		 *	2.	secureToken must be passed to the merchant server to enable polling the zapp server for a 
		 *		payment notification.
		 *
		 *	3.	SUCCESSFUL RESPONSE - Upon receipt of a successful response from the merchant server:
		 *
		 *		A.	Create a new response object by populating the following fields:
		 *
		 *			var response = new zapppopup.response.notify({
						success : true,
						data : <response from the merchant server converted to JSON format>
					});
		 *
		 *		B.	Make a callback passing in the response object created in Step A above:
		 *
		 *			callback(response);
		 
		 *		C.	Check if the pcid is present in the response from the merchant server. If present then
		 *			set the pcid cookie by calling the setCookie function:
		 *
		 			setCookie("pcid", <pcid returned from the Zapp server>, <cookieExpiryDays returned from the Zapp server>, cookieManagementUrl);
		 *
		 *		D. Continue further order processing.
		 *
		 *	4.	ERROR - Upon receipt of an error from the merchant server:
		 *		
		 *		A.	Create a new response object by populating the following fields:
		 *
		 *			var response = new zapppopup.response.notify({
						success : false,
						data : <response from the merchant server converted to JSON format>
					});
		 *
		 *		B.	Make a callback passing in the response object created in Step A above:
		 *
		 *			callback(response);
		 *
		 *		C. Continue further order processing.
		 *
		 */

	},
	error : function(errors) {
		/* Place any error handling logic here */
	},
	cookieManagementUrl: cookieManagementUrl,
	imageKey: imageKey,
	merchantPollInterval: merchantPollInterval
});
