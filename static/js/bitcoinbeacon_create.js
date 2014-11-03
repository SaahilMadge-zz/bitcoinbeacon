// var $numParticipantsField = $('#numParticipants');
// var $resultsDateField = $('#resultsDate');
// var $resultsTimeField = $('#resultsTime');
var latestBlockURL = "http://blockchain.info/latestblock";
var otherURL = "https://blockchain.info/q/getblockcount";

function setFields()
{
	// initialize the field values, make them gray
	var numParticipantsInitText = "35";
	var numWinnersInitText = "2";
	var resultsDateInitText = "10/5/14";
	var resultsTimeInitText = "4:50 PM";

	var numParticipants = $('#numParticipants');
	numParticipants.css("color", 'gray');
	var numWinners = $('#numWinners');
	numWinners.css("color", 'gray');
	var resultsDate = $('#resultsDate');
	resultsDate.css("color", 'gray');
	var resultsTime = $('#resultsTime');
	resultsTime.css("color", 'gray');

	// create boolean variables ot let us know whether the fields have been set or not
	var numParticipantsSet = false;
	var numWinnersSet = false;
	var resultsDateSet = false;
	var resultsTimeSet = false;

	numParticipants.val(numParticipantsInitText);
	numWinners.val(numWinnersInitText);
	resultsDate.val(resultsDateInitText);
	resultsTime.val(resultsTimeInitText);

	numParticipantsVal = numParticipants.val();
	numWinnersVal = numWinners.val();
	resultsDateVal = resultsDate.val();
	resultsTimeVal = resultsTime.val();

	var futureBlockNum = {stringVal: ""};

	// update the manifest window
	var manifestWindow = $('#manifestWindow');
	function updateManifest()
	{
		manifestWindow.html("\{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"futureBlockNum\":&nbsp;" + futureBlockNum.stringVal + " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"lotteryDetails\": <br>" 
		+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \{ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numParticipants\":&nbsp;" + numParticipantsVal + ", <br>"
		+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"numWinners\":&nbsp;" + numWinnersVal + " <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \} <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \"randomKey\": <br> \}");
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
		resultsDate.focus(function(eventObject)
		{
			if (!resultsDateSet)
			{
				resultsDate.val('');
				resultsDate.css("color", 'black');
			}
		});
		resultsTime.focus(function(eventObject)
		{
			if (!resultsTimeSet)
			{
				resultsTime.val('');
				resultsTime.css("color", "black");
			}
		});

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
		resultsDate.blur(function(eventObject)
		{
			if (resultsDate.val() == '')
			{
				resultsDate.val(resultsDateInitText);
				resultsDate.css("color", 'gray');
				resultsDateSet=false;
			}
			else
			{
				resultsDateSet = true;
				resultsDateVal = resultsDate.val();
				if (resultsDateSet && resultsTimeSet)
				{
					getFutureBlockNum(futureBlockNum);
					setTimeout(function()
					{
						console.log("futureBlockNumReturned: " + futureBlockNum.stringVal);
						updateManifest();
					}, 1000);
				}
			}
		});
		resultsTime.blur(function(eventObject)
		{
			if (resultsTime.val() == '')
			{
				resultsTime.val(resultsTimeInitText);
				resultsTime.css("color", 'gray');
				resultsTimeSet=false;
			}
			else
			{
				resultsTimeSet = true;
				resultsTimeVal = resultsTime.val();
				if (resultsDateSet && resultsTimeSet)
				{
					getFutureBlockNum(futureBlockNum);
					setTimeout(function()
					{
						console.log("futureBlockNumReturned: " + futureBlockNum.stringVal);
						updateManifest();
					}, 1000);
				}
			}
		});
	}
	setFieldInputBehavior();
	$('#submitButton').click(function(event)
	{
		event.preventDefault();
		$.post("/created", 
		{
			futureBlockNum: futureBlockNum.stringVal,
			lotteryDetails: {
				numParticipants: numParticipantsVal,
				numWinners : numWinnersVal
			},
			randomKey : 128,
		}, function(returned_data)
		{
			console.log(returned_data);
			alert("/manifest/"+returned_data);
			window.location.href = "/manifest/" + returned_data;
		});
	});
}

function getFutureBlockNum(futureBlockNumVar)
{
	var resultsDate = $('#resultsDate').val();
	var resultsTime = $('#resultsTime').val();

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
		var futureDateMs = Date.parse(resultsDate + " " + resultsTime + " EDT")

		console.log("currentDateMs: " + currentDateMs);
		console.log(Date.parse("October 5 2014 1:35 AM"));
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
	setFields();
});