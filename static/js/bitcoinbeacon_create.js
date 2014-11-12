// var $numParticipantsField = $('#numParticipants');
// var $resultsDateField = $('#resultsDate');
// var $resultsTimeField = $('#resultsTime');
var latestBlockURL = "http://blockchain.info/latestblock";
var otherURL = "https://blockchain.info/q/getblockcount";
var scriptText;

function printFileInfo(file)
{
	console.log("printing file info");
	$('#fileInformation').html("filename: " + file.name + ", filesize: " + file.size + ", filetype: " + file.type);
}

function handleFileSelect(evt)
{
	file = evt.target.files[0];
	console.log(file);
	if (file != null)
	{
		printFileInfo(file);
	}
	readFile();
	console.log("scriptText Now: " + scriptText);
}

function readFile()
{
	var reader = new FileReader();
	reader.onload = function()
	{
		scriptText = reader.result;
		console.log(scriptText);
		console.log("here!");
	}
	reader.readAsText(file);
}

function setFields()
{


	// initialize the field values, make them gray
	var numParticipantsInitText = "35";
	var numWinnersInitText = "2";
	// var resultsDateInitText = "10/5/14";
	// var resultsTimeInitText = "4:50 PM";

	var numParticipants = $('#numParticipants');
	numParticipants.css("color", 'gray');
	var numWinners = $('#numWinners');
	numWinners.css("color", 'gray');
	var resultsDate = $('#resultsDate');
	// resultsDate.css("color", 'gray');
	var resultsTime = $('#resultsTime');
	// resultsTime.css("color", 'gray');

	// create boolean variables ot let us know whether the fields have been set or not
	var numParticipantsSet = false;
	var numWinnersSet = false;
	var resultsDateSet = false;
	var resultsTimeSet = false;

	numParticipants.val(numParticipantsInitText);
	numWinners.val(numWinnersInitText);
	// resultsDate.val(resultsDateInitText);
	// resultsTime.val(resultsTimeInitText);

	numParticipantsVal = numParticipants.val();
	numWinnersVal = numWinners.val();
	var resultsDateVal;
	var resultsTimeVal;
	// resultsDateVal = resultsDate.val();
	// resultsTimeVal = resultsTime.val();
	$('#resultsDate').datepicker({
		onSelect: function(dateText, inst){
			resultsDateVal = dateText;
			console.log(resultsDateVal);
			resultsDateSet = true;
			if (resultsDateSet && resultsTimeSet)
			{
				getFutureBlockNum(futureBlockNum, resultsDateVal, resultsTimeVal);
				setTimeout(function()
				{
					console.log("futureBlockNumReturned: " + futureBlockNum.stringVal);
					updateManifest();
				}, 1000);
			}
		},
	});

	$('#resultsTime').timepicker({
		selectTime: function(){
			console.log($('#resultsTime').getVal())
		},
	});

	var futureBlockNum = {stringVal: ""};
	var hashOutputString;

	// update the manifest window
	var manifestWindow = $('#manifestWindow');
	function updateManifest()
	{
		// Find the hash of the inputs
		var allInputsConcatenated = futureBlockNum.stringVal + numParticipantsVal + "" + numWinnersVal + "" + $.now()
		console.log("allInputsConcatenated: " + allInputsConcatenated);
		// var allInputsConcatenatedArray = sjcl.codec.utf8String.toBits(allInputsConcatenated);
		// console.log(allInputsConcatenatedArray);
		var hashOutput = sjcl.hash.sha256.hash(allInputsConcatenated);
		console.log("hashOutput: " + hashOutput);
		// hashOutputString = sjcl.codec.utf8String.fromBits(hashOutput);
		var hexOfHash = sjcl.codec.hex.fromBits(hashOutput);
		console.log(hexOfHash);
		hashOutputString = hexOfHash.toString()
		console.log("hashOutputString: " + hashOutputString);
		console.log("scriptText: " + scriptText + " typeof: " + typeof scriptText);

		if (typeof scriptText != "undefined")
		{
			manifestWindow.html("\{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"futureBlockNum\":&nbsp;" + futureBlockNum.stringVal + " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"lotteryDetails\": <br>" 
			+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numParticipants\":&nbsp;" + numParticipantsVal + ", <br>"
			+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numWinners\":&nbsp;" + numWinnersVal + " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \} <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"randomKey\": <br>" 
			+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scriptText: " + scriptText + "<br>\}");
		}
		else
		{
			manifestWindow.html("\{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"futureBlockNum\":&nbsp;" + futureBlockNum.stringVal + " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"lotteryDetails\": <br>" 
			+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numParticipants\":&nbsp;" + numParticipantsVal + ", <br>"
			+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numWinners\":&nbsp;" + numWinnersVal + " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \} <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"randomKey\": <br>\}");
		}
	}

	updateManifest();

	function setFieldInputBehavior()
	{
		numParticipants.focus(function(eventObject) {
			if (!numParticipantsSet)
			{
				numParticipants.val('');
				numParticipants.css("color", 'black');
			}
		});
		numWinners.focus(function(eventObject) {
			if (!numWinnersSet)
			{
				numWinners.val('');
				numWinners.css("color", 'black');
			}
		});
		// resultsDate.focus(function(eventObject)
		// {
		// 	if (!resultsDateSet)
		// 	{
		// 		resultsDate.val('');
		// 		resultsDate.css("color", 'black');
		// 	}
		// });
		// resultsTime.focus(function(eventObject)
		// {
		// 	if (!resultsTimeSet)
		// 	{
		// 		resultsTime.val('');
		// 		resultsTime.css("color", "black");
		// 	}
		// });

		numParticipants.blur(function(eventObject) {
			if (numParticipants.val() == '')
			{
				numParticipants.val(numParticipantsInitText);
				numParticipants.css("color", "gray");
				numParticipantsSet=false;
			}
			else
			{
				numParticipantsSet = true;
				numParticipantsVal = numParticipants.val();
				updateManifest();
			}
		});
		numWinners.blur(function(eventObject) {
			if (numWinners.val() == '')
			{
				numWinners.val(numWinnersInitText);
				numWinners.css("color", "gray");
				numWinnersSet=false;
			}
			else
			{
				numWinnersSet = true;
				numWinnersVal = numWinners.val();
				updateManifest();
			}
		});
		resultsTime.blur(function(eventObject)
		{
		// 	if (resultsTime.val() == '')
		// 	{
		// 		resultsTime.val(resultsTimeInitText);
		// 		resultsTime.css("color", 'gray');
		// 		resultsTimeSet=false;
		// 	}
		// 	else
		// 	{
				resultsTimeVal = resultsTime.val();
				console.log("resultsTimeVal: " + resultsTimeVal);
				resultsTimeSet = true;
				if (resultsDateSet && resultsTimeSet)
				{
					console.log('here!');
					getFutureBlockNum(futureBlockNum, resultsDateVal, resultsTimeVal);
					setTimeout(function()
					{
						console.log("futureBlockNumReturned: " + futureBlockNum.stringVal);
						updateManifest();
					}, 1000);
				}

		// 	}
		});
	}
	setFieldInputBehavior();

	$('#submitButton').click(function(event)
	{
		if (resultsDateSet && resultsTimeSet)
		{
			event.preventDefault();
			// var manifestJson = { futureBlockNum :  }
			$.post("/created", JSON.stringify(
			{
				futureBlockNum: futureBlockNum.stringVal,
				lotteryDetails: {
					numParticipants: numParticipantsVal,
					numWinners : numWinnersVal,
				},
				randomKey : "128",
				hashOutputString : hashOutputString,
				scriptText: scriptText,
			}), function(returned_data)
			{
				console.log(returned_data);
				alert("/manifest/"+returned_data);
				window.location.href = "/manifest/" + returned_data;
			});
		}
	});
}

function getFutureBlockNum(futureBlockNumVar, resultsDateVal, resultsTimeVal)
{
	// var resultsDate = $('#resultsDate').val();
	// var resultsTime = $('#resultsTime').val();

	console.log("resultsDateVal: " + resultsDateVal);
	console.log("resultsTimeVal: " + resultsTimeVal);
	var resultsTimeValFixed = resultsTimeVal.slice(0, resultsTimeVal.length - 2) + " " + resultsTimeVal.slice(resultsTimeVal.length - 2);
	console.log("resultsTimeValFixed: " + resultsTimeValFixed);

	// get the latest block #
	$.ajax(
	{
		dataType: "text",
		url: otherURL,
	}).done(function(text)
	{
		latestblock = parseInt(text);
		console.log("latestBlock: " + text);

		// find the difference between the current time and specified time
		var currentDate = new Date()
		var currentDateMs = Date.parse(currentDate)
		var futureDateMs = Date.parse(resultsDateVal + " " + resultsTimeValFixed + " EDT")

		console.log("currentDateMs: " + currentDateMs);
		// console.log(Date.parse("October 5 2014 1:35 AM"));
		console.log("futureDateMs:  " + futureDateMs);

		var difference = futureDateMs - currentDateMs;
		var differenceMinutes = difference / 60000;
		var differenceBlocks = Math.ceil(differenceMinutes / 10);
		console.log("difference (ms): " + difference);
		console.log("difference (minutes): " + differenceMinutes);
		console.log("difference (blocks): " + differenceBlocks);

		var futureBlockNum = latestblock + differenceBlocks;
		console.log("future block number: " + futureBlockNum);

		futureBlockNumVar.stringVal = futureBlockNum.toString();
	}).fail(function(textStatus, error)
	{
		console.log("Error: " + textStatus + " " + error);
	});	
}

$(document).ready(function()
{
	$('#scriptInput').change(handleFileSelect);
	setFields();
});