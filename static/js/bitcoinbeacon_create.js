var latestBlockURL = "https://blockchain.info/latestblock";
var otherURL = "https://blockchain.info/q/getblockcount";
var blockExplorerURL = "http://blockexplorer.com/q/getblockcount";
var blockcypherMainURL = "https://api.blockcypher.com/v1/btc/main";
var blockBaseURL = "https://api.blockcypher.com/v1/btc/main/blocks/";

function printFileInfo(file)
{
	console.log("printing file info");
	$('#fileInformationCustom').html("filename: " + file.name + ", filesize: " + file.size + ", filetype: " + file.type);
}

var scriptText;

function handleFileSelect(evt)
{
	file = evt.target.files[0];
	console.log(file);
	console.log("tabs: " + $('#tabs').tabs("option", "active"));
	if (file != null)
	{
		printFileInfo(file);
	}
	readFile();
	console.log("scriptText Now: " + scriptTextCustom);
	updateManifestCustomTab(randomKey, scriptTextCustom);
}

function readFile()
{
	var reader = new FileReader();
	reader.onload = function()
	{
		scriptTextCustom = reader.result;
		console.log(scriptText);
		console.log("here!");
	}
	reader.readAsText(file);
}

// create boolean variables to let us know whether the fields have been set or not
var futureBlockNum = {stringVal: ""};

function getFutureBlockNumAndUpdateManifests(resultsDateVal, resultsTimeVal, randomKey)
{
	getFutureBlockNum(resultsDateVal, resultsTimeVal);
	setTimeout(function()
	{
		console.log("futureBlockNumReturned: " + futureBlockNum.stringVal);
		updateManifests(randomKey);
	}, 1000);
}

function setDateTimeBehavior(randomKey)
{
	var resultsDate = $('#resultsDate');
	var resultsTime = $('#resultsTime');

	var resultsDateVal;
	var resultsTimeVal;

	var resultsDateSet = false;
	var resultsTimeSet = false;

	resultsDate.datepicker({
		onSelect: function(dateText, inst){
			resultsDateVal = dateText;
			console.log(resultsDateVal);
			resultsDateSet = true;
			if (resultsDateSet && resultsTimeSet)
			{
				getFutureBlockNumAndUpdateManifests(resultsDateVal, resultsTimeVal);
			}
		},
	});

	resultsTime.timepicker({
		selectTime: function(){
			console.log(resultsTime.getVal())
		},
	});

	resultsTime.blur(function(eventObject)
	{
		console.log(resultsTime.val());
		if(resultsTime.val() !== "")
		{
			resultsTimeVal = resultsTime.val();
			resultsTimeSet = true;
			if (resultsDateSet && resultsTimeSet)
			{
				getFutureBlockNumAndUpdateManifests(resultsDateVal, resultsTimeVal);
			}
		}
	});

}

// // update the manifest window
// function updateManifest(futureBlockNum, numParticipants, numWinners)
// {
// 	// Find the hash of the inputs
// 	var allInputsConcatenated = futureBlockNum.stringVal + numParticipants.val() + "" + numWinners.val() + "" + randomKey; 
// 	console.log("allInputsConcatenated: " + allInputsConcatenated);
// 	// var allInputsConcatenatedArray = sjcl.codec.utf8String.toBits(allInputsConcatenated);
// 	// console.log(allInputsConcatenatedArray);
// 	var hashOutput = sjcl.hash.sha256.hash(allInputsConcatenated);
// 	console.log("hashOutput: " + hashOutput);
// 	// hashOutputString = sjcl.codec.utf8String.fromBits(hashOutput);
// 	var hexOfHash = sjcl.codec.hex.fromBits(hashOutput);
// 	console.log(hexOfHash);
// 	hashOutputString = hexOfHash.toString()
// 	console.log("hashOutputString: " + hashOutputString);
// 	console.log("scriptText: " + scriptText + " typeof: " + typeof scriptText);

// 	// if (typeof scriptText != "undefined")
// 	// {
// 		manifestWindow.html("\{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"futureBlockNum\":&nbsp;" + futureBlockNum.stringVal + " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"lotteryDetails\": <br>" 
// 		+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numParticipants\":&nbsp;" + numParticipants.val() + ", <br>"
// 		+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numWinners\":&nbsp;" + numWinners.val() + ", <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"participants\":&nbsp;"+  participantsList.val()
// 		+ " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \} <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"randomKey\":&nbsp;" + randomKey + "<br>" 
// 		// + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"scriptText\": " + scriptText + "<br>
// 		+ "\}");
// 	// }
// 	// else
// 	// {
// 	// 	manifestWindow.html("\{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"futureBlockNum\":&nbsp;" + futureBlockNum.stringVal + " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"lotteryDetails\": <br>" 
// 	// 	+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numParticipants\":&nbsp;" + numParticipants.val() + ", <br>"
// 	// 	+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numWinners\":&nbsp;" + numWinners.val() + ", <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"participants\":&nbsp;"+  participantsList.val()
// 	// 	+ " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \} <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"randomKey\":&nbsp;" + randomKey + "<br>\}");
// 	// }
// }

function getDefaultTabHash(randomKey)
{
	var numParticipants = $('#numParticipantsDefault');
	var numWinners = $('#numWinnersDefault');
	var participantsList = $('#participantListDefault');

	// Find the hash of the inputs
	var allInputsConcatenated = futureBlockNum.stringVal + numParticipants.val() + "" + numWinners.val() + "" + randomKey; 
	var hashOutput = sjcl.hash.sha256.hash(allInputsConcatenated);
	// console.log("hashOutput: " + hashOutput);
	// hashOutputString = sjcl.codec.utf8String.fromBits(hashOutput);
	var hexOfHash = sjcl.codec.hex.fromBits(hashOutput);
	//console.log(hexOfHash);
	hashOutputString = hexOfHash.toString()
	console.log("hashOutputString: " + hashOutputString);
	return hashOutputString;
}

function getOrderingTabHash(randomKey)
{
	var numParticipants = $('#numParticipantsDefault');
	var participantsList = $('#participantListDefault');

	// Find the hash of the inputs
	var allInputsConcatenated = futureBlockNum.stringVal + numParticipants.val() + "" + randomKey; 
	var hashOutput = sjcl.hash.sha256.hash(allInputsConcatenated);
	// console.log("hashOutput: " + hashOutput);
	// hashOutputString = sjcl.codec.utf8String.fromBits(hashOutput);
	var hexOfHash = sjcl.codec.hex.fromBits(hashOutput);
	//console.log(hexOfHash);
	hashOutputString = hexOfHash.toString()
	console.log("hashOutputString: " + hashOutputString);
	return hashOutputString;
}

function getRandomTabHash(randomKey)
{
	// Find the hash of the inputs
	var allInputsConcatenated = futureBlockNum.stringVal + "" + randomKey; 
	var hashOutput = sjcl.hash.sha256.hash(allInputsConcatenated);
	// console.log("hashOutput: " + hashOutput);
	// hashOutputString = sjcl.codec.utf8String.fromBits(hashOutput);
	var hexOfHash = sjcl.codec.hex.fromBits(hashOutput);
	// console.log(hexOfHash);
	hashOutputString = hexOfHash.toString()
	console.log("hashOutputString: " + hashOutputString);
	return hashOutputString;
}

function getCustomTabHash(randomKey, scriptTextCustom)
{
	if (scriptTextCustom == undefined) scriptTextCustom = "";

	console.log("scriptText: " + scriptTextCustom);
	// Find the hash of the inputs
	var allInputsConcatenated = futureBlockNum.stringVal + "" + scriptTextCustom + randomKey; 
	var hashOutput = sjcl.hash.sha256.hash(allInputsConcatenated);
	// console.log("hashOutput: " + hashOutput);
	// hashOutputString = sjcl.codec.utf8String.fromBits(hashOutput);
	var hexOfHash = sjcl.codec.hex.fromBits(hashOutput);
	// console.log(hexOfHash);
	hashOutputString = hexOfHash.toString()
	console.log("hashOutputString: " + hashOutputString);
	return hashOutputString;
}

function updateManifestDefaultTab(randomKey)
{
	var numParticipants = $('#numParticipantsDefault');
	var numWinners = $('#numWinnersDefault');
	var participantsList = $('#participantListDefault');
	var manifestWindow = $('#manifestWindowDefault');
	var hashOutputString = getDefaultTabHash(randomKey);

	manifestWindow.html("Manifest " + hashOutputString + "<br>\{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"futureBlockNum\":&nbsp;" + futureBlockNum.stringVal + " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"lotteryDetails\": <br>" 
	+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numParticipants\":&nbsp;" + numParticipants.val() + ", <br>"
	+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numWinners\":&nbsp;" + numWinners.val() + ", <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"participants\":&nbsp;"+  participantsList.val()
	+ " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \} <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"randomKey\":&nbsp;" + randomKey + "<br>" 
	+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"script\": default script<br>"
	+ "\}");
}

function updateManifestOrderingTab(randomKey)
{
	var numParticipants = $('#numParticipantsOrdering');
	var participantsList = $('#participantListOrdering');
	var manifestWindow = $('#manifestWindowOrdering');
	var hashOutputString = getOrderingTabHash(randomKey);

	manifestWindow.html("Manifest " + hashOutputString + "<br>\{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"futureBlockNum\":&nbsp;" + futureBlockNum.stringVal + " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"lotteryDetails\": <br>" 
	+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numParticipants\":&nbsp;" + numParticipants.val() + ", <br>"
	+ "<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"participants\":&nbsp;"+  participantsList.val()
	+ " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \} <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"randomKey\":&nbsp;" + randomKey + "<br>" 
	+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"scriptText\": ordering script <br>"
	+ "\}");
}

function updateManifestRandomTab(randomKey)
{
	var manifestWindow = $('#manifestWindowRandom');
	var hashOutputString = getRandomTabHash(randomKey);

	manifestWindow.html("Manifest " + hashOutputString + "<br>\{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"futureBlockNum\":&nbsp;" + futureBlockNum.stringVal
	+ "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"randomKey\":&nbsp;" + randomKey + "<br>" 
	+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"scriptText\": random generation script <br>"
	+ "\}");
}

function updateManifestCustomTab(randomKey, scriptText)
{
	var manifestWindow = $('#manifestWindowCustom');
	var hashOutputString = getCustomTabHash(randomKey, scriptText);

	manifestWindow.html("Manifest " + hashOutputString + "<br>\{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"futureBlockNum\":&nbsp;" + futureBlockNum.stringVal
	+ "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"randomKey\":&nbsp;" + randomKey + "<br>" 
	+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"scriptText\": " + scriptText + "<br>"
	+ "\}");
}

function updateManifests(randomKey)
{
	updateManifestDefaultTab(randomKey);
	updateManifestOrderingTab(randomKey);
	updateManifestRandomTab(randomKey);
	updateManifestCustomTab(randomKey);
}

function setFieldsDefaultTab(randomKey)
{
	console.log("randomKey: " + randomKey);
	var numParticipants = $('#numParticipantsDefault');
	var numWinners = $('#numWinnersDefault');
	var participantsList = $('#participantListDefault');

	function setFieldInputBehavior()
	{
		numParticipants.blur(function(eventObject) 
		{
			if (numParticipants.val() != '')
			{
				updateManifestDefaultTab(randomKey);
				updateManifestOrderingTab(randomKey);
			}
		});
		numWinners.blur(function(eventObject) 
		{
			if (numWinners.val() != '')
			{
				updateManifestDefaultTab(randomKey);
				updateManifestOrderingTab(randomKey);
			}
		});
		participantsList.blur(function(eventObject) 
		{
			updateManifestDefaultTab(randomKey);
			updateManifestOrderingTab(randomKey);
			console.log(participantsList.val().split(","));
		})
	}
	setFieldInputBehavior();
	updateManifestDefaultTab(randomKey);

	$('#submitButtonDefault').click(function(event)
	{
		if (futureBlockNum.stringVal !== "")
		{
			event.preventDefault();
			var namesList = participantsList.val();
			if (namesList !== "")
			{
				for (var i = 0; i < namesList.length; i++)
				{
					namesList[i] = namesList[i].trim();
				}
			}
			$.post("/created", JSON.stringify(
			{
				futureBlockNum: futureBlockNum.stringVal,
				lotteryDetails: {
					numParticipants: numParticipants.val(),
					numWinners : numWinners.val(),
					participantsList: namesList,
				},
				randomKey : randomKey,
				hashOutputString : getDefaultTabHash(randomKey),
				scriptText: defaultLotteryScript,
				allowMultipleWins: $('input[name="radioDefault1"]:checked').val(),
			}), function(returned_data)
			{
				console.log(returned_data);
				alert("/manifest/"+returned_data);
				window.location.href = "/manifest/" + returned_data;
			});
		}
	});
}

function setFieldsOrderingTab(randomKey)
{
	console.log("randomKey: " + randomKey);
	var numParticipants = $('#numParticipantsOrdering');
	var participantsList = $('#participantListOrdering');

	function setFieldInputBehavior()
	{
		numParticipants.blur(function(eventObject) 
		{
			if (numParticipants.val() != '')
			{
				updateManifestDefaultTab(randomKey);
				updateManifestOrderingTab(randomKey);
			}
		});
		participantsList.blur(function(eventObject) 
		{
			updateManifestDefaultTab(randomKey);
			updateManifestOrderingTab(randomKey);
			console.log(participantsList.val().split(","));
		})
	}
	setFieldInputBehavior();
	updateManifestOrderingTab(randomKey);

	$('#submitButtonOrdering').click(function(event)
	{
		if (futureBlockNum.stringVal !== "")
		{
			event.preventDefault();
			var namesList = participantsList.val();
			if (namesList !== "")
			{
				for (var i = 0; i < namesList.length; i++)
				{
					namesList[i] = namesList[i].trim();
				}
			}
			$.post("/created", JSON.stringify(
			{
				futureBlockNum: futureBlockNum.stringVal,
				lotteryDetails: {
					numParticipants: numParticipants.val(),
					numWinners : numWinners.val(),
					participantsList: namesList,
				},
				randomKey : randomKey,
				hashOutputString : getOrderingTabHash(randomKey),
				scriptText: fakeLotteryScript,
			}), function(returned_data)
			{
				console.log(returned_data);
				alert("/manifest/"+returned_data);
				window.location.href = "/manifest/" + returned_data;
			});
		}
	});
}

function setFieldsRandomTab(randomKey)
{
	console.log("randomKey: " + randomKey);
	updateManifestRandomTab(randomKey);

	$('#submitButtonRandom').click(function(event)
	{
		if (futureBlockNum.stringVal !== "")
		{
			event.preventDefault();
			$.post("/created", JSON.stringify(
			{
				futureBlockNum: futureBlockNum.stringVal,
				randomKey : randomKey,
				hashOutputString : getRandomTabHash(randomKey),
				scriptText: fakeLotteryScript,
			}), function(returned_data)
			{
				console.log(returned_data);
				alert("/manifest/"+returned_data);
				window.location.href = "/manifest/" + returned_data;
			});
		}
	});
}

function setFieldsCustomTab(randomKey)
{
	console.log("randomKey: " + randomKey);
	updateManifestCustomTab(randomKey);

	$('#submitButtonCustom').click(function(event)
	{
		if (futureBlockNum.stringVal !== "")
		{
			event.preventDefault();
			$.post("/created", JSON.stringify(
			{
				futureBlockNum: futureBlockNum.stringVal,
				randomKey : randomKey,
				hashOutputString : getCustomTabHash(randomKey),
				scriptText: scriptTextCustom,
			}), function(returned_data)
			{
				console.log(returned_data);
				alert("/manifest/"+returned_data);
				window.location.href = "/manifest/" + returned_data;
			});
		}
	});
}

function getFutureBlockNum(resultsDateVal, resultsTimeVal)
{
	console.log("resultsDateVal: " + resultsDateVal);
	console.log("resultsTimeVal: " + resultsTimeVal);
	var resultsTimeValFixed = resultsTimeVal.slice(0, resultsTimeVal.length - 2) + " " + resultsTimeVal.slice(resultsTimeVal.length - 2);
	console.log("resultsTimeValFixed: " + resultsTimeValFixed);

	// get the latest block #
	// $.ajax(
	// {
	// 	type: 'GET',
	// 	dataType: "text",
	// 	url: otherURL,
	// }).done(function(text)
	// {
	// 	//console.log("API: " + json);
	// 	// console.log(data)
	// 	latestblockNum = parseInt(text);
	// 	console.log("latestBlockNum: " + text);
	// 	console.log(blockchainTestURL + latestblockNum);
	$.ajax(
	{
		type: 'GET',
		dataType: 'json',
		url: blockcypherMainURL,
		crossDomain:true,
		contentType: 'text/plain',
	}).done(function(json)
	{
		console.log("latest block: " + json.height);
		console.log("latest block time: " + json.time);
		console.log("parsed time: " + Date.parse(json.time));
		var latestblock = json.height;
		$.ajax(
		{
			dataType: "text",
			url: "https://blockchain.info/q/nextretarget",
		}).done(function(retargetText)
		{
			nextRetargetBlock = parseInt(retargetText);
			console.log("nextRetargetBlock: " + nextRetargetBlock);

			$.ajax(
			{
				type: 'GET',
				dataType: 'json',
				// this URL gets the time of the block 4 cycles ago
				url: blockBaseURL + (nextRetargetBlock - 10080),
				crossDomain:true,
				contentType: 'text/plain',
			}).done(function(oldBlockJSON)
			{
				var oldBlockTime = oldBlockJSON.time;
				// find the difference between the current time and specified time
				//var currentDate = new Date();
				//var currentDateMs = Date.parse(currentDate);
				var futureDateMs = Date.parse(resultsDateVal + " " + resultsTimeValFixed + " EDT");
				var currentBlockDate = Math.ceil(Date.parse(json.time));
				var oldBlockDate = Math.ceil(Date.parse(oldBlockTime));

				console.log("currentDateMs: " + currentBlockDate);
				console.log("oldBlockDate: " + oldBlockDate);
				// console.log(Date.parse("October 5 2014 1:35 AM"));
				console.log("futureDateMs:  " + futureDateMs);

				var difference = futureDateMs - currentBlockDate;
				var differenceMinutes = difference / 60000;
				console.log("difference (ms): " + difference);
				console.log("difference (minutes): " + differenceMinutes);

				// calculate total time over the past 4 cycles and current cycle
				var totalTimeMinutes = (currentBlockDate - oldBlockDate) / 60000;
				var totalTimeAverage = totalTimeMinutes / (8064 + (json.height + 2016 - nextRetargetBlock));
				console.log(totalTimeAverage);

				var differenceBlocks = Math.ceil(differenceMinutes / totalTimeAverage);
				console.log("difference (blocks): " + differenceBlocks);

				var futureBlockNumber = latestblock + differenceBlocks;
				console.log("future block number: " + futureBlockNumber);

				futureBlockNum.stringVal = futureBlockNumber.toString();

				// if (futureBlockNumber <= nextRetargetBlock)
				// {
				// 	console.log("futureblock <= retargetblock");
				// }
				// else
				// {
				// 	diff = futureBlockNumber - nextRetargetBlock;
				// 	console.log("total retargets till this time: " + (1 + Math.floor(diff/2016)));
				// }
				$('#futureBlockNumDisplay').text("Future block num: " + futureBlockNumber);
			})
		}).fail(function(retargetTextStatus, error)
		{
			console.log("Error: " + textStatus + " " + error);
		});

	}).fail(function(textStatus, error)
	{
		console.log("Error: " + textStatus + " " + error);
	});
}

function initJQueryUI()
{
	$('#tabs').tabs();
	$('#radioDefault').buttonset();
}

$(document).ready(function()
{
	initJQueryUI();
	$('#scriptInputCustom').change(handleFileSelect);
	randomKey = sjcl.random.randomWords(4);
	setDateTimeBehavior(randomKey);
	setFieldsDefaultTab(randomKey);
	setFieldsOrderingTab(randomKey);
	setFieldsRandomTab(randomKey);
	setFieldsCustomTab(randomKey);
});