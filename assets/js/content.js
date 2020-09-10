/**
 * this script belongs to the specified page
 */



/**
 * call bg.js to show Page action
 */
chrome.runtime.sendMessage({
	todo: "showPageAction"
});

/**
 *  initialize the maincontent.js
 */
chrome.storage.sync.get('status', function(data) {

	if (data.status) {
		console.log(data.status);
		initMainContentScript(data.status);
	}

});


/**
 * change the content of the maincontent.js 
 * when click the button in the popup.html 
 *
 * to handle the request from popup.js(message (popup - > background -> content))
 */

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {

		if (request.onClick == "onClick") {
			/**
			 * turn on the click mode 
			 */
			turnOnClickMode();
			// setTimeout(turnOnClickMode, 50);
			// console.log("aaa");
		} else if (request.onDownload == "onDownload") {
			/**
			 * turn on the download mode
			 */
			turnOnDownloadMode();

		} else if (request.resetScript == "resetScript") {
			/**
			 * reload the mainContent.js
			 */
			resetScript();
		} else if (request.globalStatus == "ON") {
			/**
			 * initialize the main content script
			 */
			initMainContentScript(request.globalStatus);
		} else if (request.showSpanTxt == "show") {
			/**
			 * show reminders in the main content script
			 */
			showSpanTxt();
		} else if (request.hideSpanTxt == "hide") {
			/**
			 * hide reminders in the main content script
			 */
			hideSpanTxt();
		}

	});


/**
 * when the status is 'ON'
 * turn on switch 
 * + load the main content.js
 * + initialize the main content script according to privious selection 
 *
 */

function initMainContentScript(status) {
	if (status == "ON") {

		/**
		 * load the original main content script
		 */
		// console.log("1");
		chrome.runtime.sendMessage({
			switch: "turnOn"
		});
		// console.log("2");

		/**
		 * initialize the main Content script according to privious selection 
		 */
		var optionIds = ['option1', 'option2', 'option3', 'option4'];
		for (let i = 0; i < optionIds.length; i++) {
			let id = optionIds[i];
			chrome.storage.sync.get(id, function(data) {
				if (data[id]) {

					if (data[id].optionId == 'option1' && data[id].btnStatus == 'ON') {
						// turnOnClickMode();
						// setTimeout : make sure the mainContent.js has been loaded 
						setTimeout(turnOnClickMode, 80);
						// console.log("in if");
					}
					// if (data[id].optionId == 'option1' && data[id].btnStatus == 'OFF') {
					// 	$("#confirm, #downloadSrc, #mode-click, #mode-download").css("display", "inline");
					// 	console.log("resetScript op1");
					// }

					if (data[id].optionId == 'option2' && data[id].btnStatus == 'ON') {
						setTimeout(turnOnDownloadMode, 80);
					}
					// if (data[id].optionId == 'option2' && data[id].btnStatus == 'OFF') {
					// 	$("#confirm, #downloadSrc, #mode-click, #mode-download").css("display", "inline");
					// 	console.log("resetScript op2");

					// }

					if (data[id].optionId == 'option3' && data[id].btnStatus == 'ON') {
						setTimeout(hideSpanTxt, 80);
					}

					if (data[id].optionId == 'option4' && data[id].btnStatus == 'ON') {
						// setTimeout(turnOnClickMode, 80);
					}
				}
			});

		};

		// chrome.runtime.sendMessage({initialize : "init"});
		// setTimeout(turnOnClickMode, 80);
		// console.log("all end");

	}

}


/**
 * turn on the click mode
 */
function turnOnClickMode() {
	$("#module-1, #module-2").css("display", "block");
	$("#confirm, #mode-click").css("display", "inline");
	$("#downloadSrc, #mode-download").css("display", "none");
	$("#modeName").text("模拟点击");


	// var a = document.getElementById("functionAreaContent");
	// console.log(a);
	// console.log("here a");
}

function turnOnDownloadMode() {
	// document.getElementById("module-1").style.display = "block";
	$("#module-1").css("display", "block");
	$("#downloadSrc,#mode-download").css("display", "inline");
	$("#module-2, #confirm, #mode-click").css("display", "none");
	//$("#mode-download").css({"background-color":"#0BD","color":"#fff"});
	$("#modeName").text("批量下载");
}


/**
 * reset the mainContent.js 
 */
function resetScript() {
	$("#module-1,#module-2").css("display", "none");
	$("#confirm, #downloadSrc, #mode-click, #mode-download").css("display", "inline");
	$("#modeName").text("未选择");
}

/**
 * hide reminders in the main content script
 */
function hideSpanTxt() {
	$(".span-display").hide(500);
}
/**
 * show reminders in the main content script
 */
function showSpanTxt() {
	$(".span-display").show(500);

}