// var $numParticipantsField = $('#numParticipants');
// var $resultsDateField = $('#resultsDate');
// var $resultsTimeField = $('#resultsTime');
var latestBlockURL = "http://blockchain.info/latestblock"
var otherURL = "https://blockchain.info/q/getblockcount"

function initFields()
{
	var numParticipantsInitText = "35";
	var resultsDateInitText = "10/5/14";
	var resultsTimeInitText = "4:50 PM";

	// console.log($numParticipantsField);
	// console.log($('#numParticipants'));
	// $numParticipantsField.val(numParticipantsInitText);
	$('#numParticipants').val(numParticipantsInitText);
	// console.log($numParticipantsField);
	// console.log($('#numParticipants'));
	// resultsDateField.attr("value", resultsDateInitText);
	// resultsTimeField.attr("value", resultsTimeInitText);
	$('#resultsDate').val(resultsDateInitText);
	$('#resultsTime').val(resultsTimeInitText);
}

function processSubmit() 
{
	var numParticipants = $('#numParticipants').val();
	var resultsDate = $('#resultsDate').val();
	var resultsTime = $('#resultsTime').val();

	$('#testSubmitButton').html("<p> Number of Participants: " + numParticipants 
		+ "<br>Date of Results: " + resultsDate + "<br>Time of Results: " + resultsTime);

	console.log(otherURL);

	var latestblock;

	// get the latest block #
	$.ajax(
	{
		dataType: "text",
		url: otherURL,
	}).done(function(text)
	{
		latestblock = text;
		console.log(text);
	}).fail(function(textStatus, error)
	{
		console.log("Error: " + textStatus + " " + error);
	});

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
	console.log("future block number: " + (latestblock + differenceBlocks));
}

$(document).ready(function()
{
	initFields();
	$('#createLotteryForm').submit(function(event) {
		processSubmit();
		event.preventDefault();
	});
});