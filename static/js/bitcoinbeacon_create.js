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

var scriptTextCustom = null;

function handleFileSelectCustom(evt)
{
	file = evt.target.files[0];
	console.log(file);
	console.log("tabs: " + $('#tabs').tabs("option", "active"));
	if (file != null)
	{
		printFileInfo(file);
	}
	var reader = new FileReader();
	reader.onload = function()
	{
		scriptTextCustom = reader.result;
		console.log(scriptTextCustom);
		console.log("here!");
		console.log("scriptText Now: " + scriptTextCustom);
		updateManifestCustomTab(randomKey, scriptTextCustom);
	}
	reader.readAsText(file);
}

function readFileCustom()
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

var orderingParticipantFileSelected = false;
var participantsListOrdering = null;

function handleFileSelectOrdering(evt)
{
	file = evt.target.files[0];
	console.log(file);
	console.log("tabs: " + $('#tabs').tabs("option", "active"));
	if (file != null)
	{
		printFileInfo(file);
	}

	var reader = new FileReader();
	reader.onload = function()
	{
		// scriptTextCustom = reader.result;
		// console.log(scriptText);
		participantsList = reader.result;
		orderingParticipantFileSelected = true;
		console.log("here!");
		console.log("participantsList: " + participantsList);
		participantsListOrdering = participantsList;
		updateManifestOrderingTab(randomKey);
	}
	reader.readAsText(file);
}

var defaultParticipantFileSelected = false;
var participantsListDefault = null;

function handleFileSelectDefault(evt)
{
	file = evt.target.files[0];
	console.log(file);
	console.log("tabs: " + $('#tabs').tabs("option", "active"));
	if (file != null)
	{
		printFileInfo(file);
	}

	var reader = new FileReader();
	reader.onload = function()
	{
		// scriptTextCustom = reader.result;
		// console.log(scriptText);
		participantsList = reader.result;
		defaultParticipantFileSelected = true;
		console.log("here!");
		console.log("participantsList: " + participantsList);
		participantsListDefault = participantsList;
		updateManifestDefaultTab(randomKey);
	}
	reader.readAsText(file);
}

// create boolean variables to let us know whether the fields have been set or not
var futureBlockNum = {stringVal: ""};

function getFutureBlockNumAndUpdateManifests(resultsDateVal, resultsTimeVal, randomKey)
{
	var blockNum = getFutureBlockNum(resultsDateVal, resultsTimeVal);
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
				getFutureBlockNumAndUpdateManifests(resultsDateVal, resultsTimeVal, randomKey);
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
				getFutureBlockNumAndUpdateManifests(resultsDateVal, resultsTimeVal, randomKey);
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
	var participantsList;
	if (!participantsListDefault) {
		participantsList = $('#participantListDefault').val();
		console.log("participantsList: " + participantsList);
	}
	else {
		participantsList = participantsListDefault;
		console.log("participantsList: " + participantsList);
	}

	// Find the hash of the inputs
	var allInputsConcatenated = futureBlockNum.stringVal + numParticipants.val() + "" + numWinners.val() + participantsList + randomKey; 
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
	var numParticipants = $('#numParticipantsOrdering');
	var participantsList;
	if (!participantsListOrdering) {
		participantsList = $('#participantListOrdering').val();
		console.log("participantsList: " + participantsList);
	}
	else {
		participantsList = participantsListOrdering;
		console.log("participantsList: " + participantsList);
	}

	// Find the hash of the inputs
	var allInputsConcatenated = futureBlockNum.stringVal + numParticipants.val() + "" + participantsList + randomKey; 
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
	if (!participantsListDefault) {
		participantsList = $('#participantListDefault').val();
		console.log("participantsList: " + participantsList);
	}
	else {
		participantsList = participantsListDefault;
		console.log("participantsList: " + participantsList);
	}
	var manifestWindow = $('#manifestWindowDefault');
	var hashOutputString = getDefaultTabHash(randomKey);

	manifestWindow.html("Manifest " + hashOutputString + "<br>\{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"futureBlockNum\":&nbsp;" + futureBlockNum.stringVal
	+ ", <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numParticipants\":&nbsp;" + numParticipants.val() 
	+ ", <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numWinners\":&nbsp;" + numWinners.val() 
	+ ", <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"participants\":&nbsp;"+  participantsList
	+ ", <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"randomKey\":&nbsp;" + randomKey + "<br>" 
	+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"script\": default script<br>"
	+ "\}");
}

function updateManifestOrderingTab(randomKey)
{
	var numParticipants = $('#numParticipantsOrdering');
	var participantsList;
	if (!participantsListOrdering) 
	{
		participantsList = $('#participantListOrdering').val();
		console.log("ohai: " + participantsList);
	}
	else 
	{
		participantsList = participantsListOrdering;
	}
	var manifestWindow = $('#manifestWindowOrdering');
	var hashOutputString = getOrderingTabHash(randomKey);

	manifestWindow.html("Manifest " + hashOutputString + "<br>\{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"futureBlockNum\":&nbsp;" + futureBlockNum.stringVal
	+ ", <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numParticipants\":&nbsp;" + numParticipants.val() 
	+ ", <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"participants\":&nbsp;"+  participantsList
	+ ", <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"randomKey\":&nbsp;" + randomKey + "<br>" 
	+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"script\": ordering script<br>"
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

function setFieldsDefaultTab()
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
			var participantsListVal;
			//alert(participantsListVal);
			if (!participantsListDefault)
			{
				participantsListVal = participantsList.val().trim();
			}
			else 
			{
				participantsListVal = participantsListDefault;
			}
			$.post("/created", JSON.stringify(
			{
				futureBlockNum: futureBlockNum.stringVal,
				// lotteryDetails: {
				numParticipants: numParticipants.val(),
				numWinners : numWinners.val(),
				participantsList: participantsListVal,
				// },
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

function setFieldsOrderingTab()
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
			var participantsListVal;
			//alert(participantsListVal);
			if (!participantsListOrdering) 
			{
				participantsListVal = participantsList.val().trim();
			}
			else 
			{
				participantsListVal = participantsListOrdering;
			}
			$.post("/created", JSON.stringify(
			{
				futureBlockNum: futureBlockNum.stringVal,
				// lotteryDetails: {
				numParticipants: numParticipants.val(),
				participantsList: participantsListVal,
				// },
				randomKey : randomKey,
				hashOutputString : getOrderingTabHash(randomKey),
				scriptText: orderedLotteryScript,
			}), function(returned_data)
			{
				console.log(returned_data);
				alert("/manifest/"+returned_data);
				window.location.href = "/manifest/" + returned_data;
			});
		}
	});
}

function setFieldsRandomTab()
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
				scriptText: randomLotteryScript,
			}), function(returned_data)
			{
				console.log(returned_data);
				alert("/manifest/"+returned_data);
				window.location.href = "/manifest/" + returned_data;
			});
		}
	});
}

function setFieldsCustomTab()
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
	$('#futureBlockNumDisplay').css("color", "black").html("Calculating...");
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
				var differenceMinutes = Math.ceil(difference / 60000);
				console.log("difference (ms): " + difference);
				console.log("difference (minutes): " + differenceMinutes);

				if (differenceMinutes < 0) {
					// futureBlockNum.stringVal = futureBlockNumber.toString();
					$('#futureBlockNumDisplay').html("The time provided is in the past! Please select a future time.").css("color", "red");
					return;
				}

				// calculate total time over the past 4 cycles and current cycle
				var totalTimeMinutes = (currentBlockDate - oldBlockDate) / 60000;
				var totalTimeAverage = totalTimeMinutes / (8064 + (json.height + 2016 - nextRetargetBlock));
				console.log(totalTimeAverage);

				/* we will use this total average as our scale parameter
				   the probability should be 0.01, to ensure 99% chance it does not
				   arrive before specified time */

				var differenceBlocks = Math.ceil(differenceMinutes / totalTimeAverage);
				console.log("difference (blocks): " + differenceBlocks);
				console.log("normal cdf: " + jStat.gamma.cdf(differenceMinutes, differenceBlocks, totalTimeAverage));

				var realDifferenceBlocks = differenceBlocks;
				var cdf = 1;
				for (; cdf > 0.01; realDifferenceBlocks++) {
					cdf = jStat.gamma.cdf(differenceMinutes, realDifferenceBlocks, totalTimeAverage);
					console.log("block #: " + realDifferenceBlocks + "new cdf: " + cdf);
				}
				console.log("actual block difference: " + realDifferenceBlocks);
				console.log("prob check: " + cdf);

				var futureBlockNumber = latestblock + realDifferenceBlocks;
				console.log("future block number: " + futureBlockNumber);
				console.log("prob check again: " + jStat.gamma.cdf(differenceMinutes, futureBlockNumber - latestblock, totalTimeAverage));

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
				$('#futureBlockNumDisplay').html("Future block: " + futureBlockNumber + "<br> Estimated time till results available: " 
					+ new Date(currentBlockDate + 60000 * (realDifferenceBlocks * totalTimeAverage)));

				console.log("futureBlockNumReturned: " + futureBlockNum.stringVal);
				updateManifests(randomKey);
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

var randomKey;

$(document).ready(function()
{
	initJQueryUI();
	$('#scriptInputCustom').change(handleFileSelectCustom);
	$('#participantsInputOrdering').change(handleFileSelectOrdering);
	$('#participantsInputDefault').change(handleFileSelectDefault);
	var initRandomKey = sjcl.random.randomWords(4);
	randomKey = initRandomKey;

	var randomKeyField = $('#randomKey');
	randomKeyField.focus(function()
	{
		randomKeyField.val("");
	})
	randomKeyField.blur(function()
	{
		var val = randomKeyField.val().trim();
		if (val == "")
		{
			randomKeyField.val(initRandomKey);
		}
		else 
		{
			randomKey = val;
			updateManifests(randomKey);
		}
	});

	$('#sampleScript').html("This is a sample script: <em>" + sampleLotteryScript+ "</em>");

	randomKeyField.val(initRandomKey);
	setDateTimeBehavior();
	setFieldsDefaultTab();
	setFieldsOrderingTab();
	setFieldsRandomTab();
	setFieldsCustomTab(randomKey);
});