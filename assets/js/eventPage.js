chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.todo == "showPageAction") {

		// Light the icon which is in the toolbar on the specfied page
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			// chrome.pageAction.show(tabs[0].id)
			chrome.pageAction.show(sender.tab.id)
		});

	} else if (request.switch) {

		if (request.switch == "turnOn") {

			var file = {
				file: './assets/js/mainContent.js',

			}
			chrome.tabs.executeScript(file);


			// chrome.tabs.executeScript({
			// 	file:'content.js'
			// });
			/**
			 * TODO
			 * speedController
			 * 
			 */
			// chrome.tabs.executeScript({
			// 	file: './assets/js/speedController.js'
			// });


		} else if (request.switch == "turnOff") {

			chrome.tabs.reload();

		}

	} else if (request.createTab) {
		console.log(request);

		if (request.createTab == "onDownload") {

			chrome.tabs.create({
				//url: "chrome://settings/?search=downloads"
				url : request.url,
				active : request.option
			})
			alert("操作提醒：\n" + "务必操作，否则请不要向下执行任何操作！！！\n" + "\n" + "（此为 chrome 浏览器操作步骤）" + "\n" + " 【 打开 】 “下载前询问每个文件的保存位置” 右侧按钮");

		} else if (request.createTab == "offDownload") {

			chrome.tabs.create({
				//url: "chrome://settings/?search=downloads"
				url : request.url,
				active : request.option
			})
			alert("操作提醒：\n" + "务必操作，否则请不要向下执行任何操作！！！\n" + "\n" + "（此为 chrome 浏览器操作步骤）" + "\n" + " 【 关闭 】 “下载前询问每个文件的保存位置” 右侧按钮");
		}
	} else if (request.onClickMode) {
		/**
		 * send message to content.js to turn on the click mode
		 */

		// console.log("in request 1");
		if (request.onClickMode == "onClick") {

			// let file = { file : 'onClickContent.js'};
			// chrome.tabs.executeScript(file);
			// 
			sendMesgToContent('onClick', 'onClick');

			// chrome.tabs.query({
			// 	active: true,
			// 	currentWindow: true
			// }, function(tabs) {

			// 	chrome.tabs.sendMessage(tabs[0].id, {
			// 		onClick: "onClick"
			// 	});

			// });




		}

	} else if (request.onDownloadMode == "onDownload") {

		sendMesgToContent('onDownload', 'onDownload');

	} else if (request.resetScript == "resetScript") {

		sendMesgToContent('resetScript', 'resetScript');

	} else if (request.globalStatus == "ON") {

		sendMesgToContent('globalStatus', 'ON');

	} else if (request.hideSpanTxt == 'hide') {

		sendMesgToContent('hideSpanTxt', 'hide');
		console.log("hide");

	} else if (request.showSpanTxt == 'show') {

		sendMesgToContent('showSpanTxt', 'show');

	} else if (request.speedController == "ON") {

		//body

	} else if (request.speedController == "OFF") {

		// body
	} else if (request.notifDetails){
		//_text, _timeout, _title, _image, _highlight, _silent,  _ondone, _onclick

		let details = request.notifDetails.details;
		let options = {

			type : "basic",
			iconUrl : "../../icon48.png",
			title : details.title,
			message : details.text,
			eventTime : Date.now(),
			requireInteraction : false,
			silent : details.silent

		};
		console.log(options.eventTime);
		let callback = request.notifDetails.callbackFunc;

		chrome.notifications.create(options, callback);

	}


});



/**
 * send message to content.js 
 * @param  {[type]} key   [message title]
 * @param  {[type]} value [message content]
 */
function sendMesgToContent(key, value) {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			[key]: value
		})
	});
}


// matches browser_Action
// chrome.browserAction.setBadgeText({text: 'ON'});
// chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});