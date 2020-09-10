$(function() {

	/**
	 * this script belongs to popup.html
	 */

	/**
	 * send a message to the background.js to call the specified function
	 * @param  {[type]} key   
	 * @param  {[type]} value 
	 */
	function sendMesgToBackground(key, value) {
		chrome.runtime.sendMessage({
			[key]: value
		});
	}

	/**
	 * for global switch
	 * 
	 * initialize global switch status 
	 * if user click the popup not the first time,then get the status from the storage
	 * default status： OFF
	 */

	chrome.storage.sync.get('status', function(data) {

		if (data.status) {
			changeGlobalStatus(data.status);
		} else {
			var newStatus = "OFF";
			chrome.storage.sync.set({
				'status': newStatus
			});
			$('#switchButton').attr("src", "./assets/imgs/switchoff.png");
			$('#switchStatusVal').val(data.status);
			showOptionsMenu(newStatus);
		}

	});

	/**
	 * initialize all options in the popup.html
	 * 
	 * the mainContent.js must has been initialized when user open the popup 
	 */
	var optionIds = ['option1', 'option2', 'option3', 'option4'];
	for (let i = 0; i < optionIds.length; i++) {
		let id = optionIds[i];
		chrome.storage.sync.get(id, function(data) {
			if (data[id]) {
				console.log("1");
				changeOptionBtn(data[id].optionId, data[id].btnId, data[id].btnStatus);
			}
		});

	};


	/**
	 * display options dynamically
	 */

	function showOptionsMenu(status) {

		// var div1 = document.getElementById("optionMenu");
		if (status == "OFF") {
			// div1.style.display = "none";
			$("#optionMenu").hide(700);
		}
		if (status == "ON") {
			// div1.style.display = "block";
			$("#optionMenu").show(700);
		}
	}


	/**
	 * for global switch
	 * 
	 * change the switch button img
	 * storage the global status
	 * set the value in the hidden input
	 */
	function changeGlobalStatus(status) {

		if (status == "ON") {
			$('#switchButton').attr("src", "./assets/imgs/switchon.png");
		} else if (status == "OFF") {
			$('#switchButton').attr("src", "./assets/imgs/switchoff.png");
		}
		showOptionsMenu(status);
		chrome.storage.sync.set({
			'status': status
		});
		$('#switchStatusVal').val(status);

	}


	/**
	 * for option swtich
	 * 
	 * [on clicking]
	 * change option button by clicking according to 'optionId' and 'btnId' 
	 *  
	 * @param  {[type]} optionId [identify this option ]
	 * @param  {[type]} btnId    [belong to this option's button img]
	 */
	function changeBtn(optionId, btnId) {

		var status = $('#' + optionId + " input").val();
		var newStatus = status == "ON" ? "OFF" : "ON";
		changeOptionBtn(optionId, btnId, newStatus);
		return newStatus;

	}

	/**
	 * for option swtich
	 * 
	 * change the option button img 
	 * set the status in the hidden input
	 * storage the new status 
	 * 
	 * @param  {[type]} optionId        [identify this option]
	 * @param  {[type]} btnId           [belong to this option button img]
	 * @param  {[type]} optionBtnStatus [the status of this option]
	 */
	function changeOptionBtn(optionId, btnId, optionBtnStatus) {

		if (optionBtnStatus == "ON") {
			$('#' + btnId).attr("src", "./assets/imgs/optionBtnOn.png");
			// if(optionId == 'option1'){
			// 	turnOnClickMode();
			// }
		} else {
			$('#' + btnId).attr("src", "./assets/imgs/optionBtnOff.png");
		}

		$('#' + optionId + " input").val(optionBtnStatus);

		chrome.storage.sync.set({
			/**
			 * set a variable as key  in js
			 */
			[optionId]: {
				'optionId': optionId,
				'btnId': btnId,
				'btnStatus': optionBtnStatus
			}
		});

	}



	/**
	 * send message to bg.js to create Tab to turn on the switch (Ask where to save each file before downloading)
	 */
	function sendMessOnDownload() {
		// chrome.tabs.create({url:"chrome://settings/?search=downloads"});
		chrome.runtime.sendMessage({
			createTab: "onDownload",
			url : "chrome://settings/downloads",
			option : true,
		});
	}
	/**
	 * send message to bg.js to create Tab to turn off the switch (Ask where to save each file before downloading)
	 */
	function sendMessOffDownload() {
		// chrome.tabs.create({url:"chrome://settings/?search=downloads"});
		chrome.runtime.sendMessage({
			createTab: "offDownload",
			url : "chrome://settings/downloads",
			option : true,
		});
	}


	/**
	 * send message to background.js to call content.js to turn on the click mode
	 */
	function turnOnClickMode() {

		// chrome.runtime.sendMessage({
		// 	onClickMode: "onClick"
		// });
		sendMesgToBackground('onClickMode', 'onClick');
		setTimeout(sendMessOnDownload, 0);

	};
	/**
	 * send message to background.js to call content.js to turn on the download mode
	 */
	function turnOnDownloadMode() {

		// chrome.runtime.sendMessage({
		// 	onDownloadMode: "onDownload"
		// });
		sendMesgToBackground('onDownloadMode', 'onDownload');

		setTimeout(sendMessOffDownload, 0);

	};
	/**
	 * send message to background.js to call content.js to reset the mainContent.js
	 */
	function resetScript() {
		// chrome.runtime.sendMessage({
		// 	resetScript: "resetScript"
		// });
		sendMesgToBackground('resetScript', 'resetScript');
	}

	/**
	 * hide reminders in the main content script
	 */
	function hideSpanTxt() {

		sendMesgToBackground('hideSpanTxt', 'hide');

	}
	/**
	 * show reminders in the main content script
	 */
	function showSpanTxt() {

		sendMesgToBackground('showSpanTxt', 'show');

	}
	/**
	 * turn on SpeedController 
	 */
	function turnOnSpeedController() {
		sendMesgToBackground('speedController', 'ON');
	}
	/**
	 * turn off SpeedController 
	 */
	function turnOffSpeedController() {

		sendMesgToBackground('speedController', 'OFF');

	}


	/**
	 * bind click event to global switch
	 */
	$('#switchButton').click(function() {

		var status = $('#switchStatusVal').val();;
		var newStatus = status == "OFF" ? "ON" : "OFF";
		changeGlobalStatus(newStatus);


		if (newStatus == "ON")
			chrome.runtime.sendMessage({
				globalStatus: newStatus
			});

		if (newStatus == "OFF") {
			chrome.runtime.sendMessage({
				switch: "turnOff"
			});
		}

		showOptionsMenu(newStatus);



	});



	/**
	 * bind click to optionId specified
	 */


	/**
	 *	option1 : click mode
	 *
	 * option2 : download mode
	 *
	 * option3 : hide reminders
	 *
	 * option4 : speedController
	 *
	 *
	 *
	 * 
	 */

	$("#option1-btn").click(function() {

		// chrome.runtime.sendMessage({clickOption1: "clicking"});
		// console.log("clicked");

		let status = changeBtn("option1", "option1-btn");

		/**
		 * its function
		 */

		//	turn off the download mode when turn on the click mode
		if (status == "ON") {
			turnOnClickMode();
			if (changeBtn("option2", "option2-btn") == "ON") {
				changeBtn("option2", "option2-btn");
			}
		} else {
			resetScript();
		}

	});


	$("#option2-btn").click(function() {
		let status = changeBtn("option2", "option2-btn");

		/**
		 * its function
		 */
		//	turn off the click mode when turn on the download mode
		if (status == "ON") {
			turnOnDownloadMode();
			if (changeBtn("option1", "option1-btn") == "ON") {
				changeBtn("option1", "option1-btn");

			}
		} else {
			resetScript();
		}

	});
	$("#option3-btn").click(function() {
		let status = changeBtn("option3", "option3-btn");
		/**
		 * its function
		 */
		if (status == "ON")
			hideSpanTxt();
		else
			showSpanTxt();
	});
	$("#option4-btn").click(function() {
		let status = changeBtn("option4", "option4-btn");
		/**
		 * its function
		 */
		if (status == "ON")
			turnOnSpeedController();
		else
			turnOffSpeedController();
	});



});