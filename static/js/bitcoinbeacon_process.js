var confirmButton = $('#confirmManifestButton');
var file = $('#manifestUpload')[0];

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
}

function extractRandomness(blockNumber, randomKey)
{

}

function readFile()
{
	// console.log(file);
	// console.log('Reading file');
	// alert('I\'m here!');
	var reader = new FileReader();
	var manifestJSON;
	reader.onload = function()
	{
		manifestJSON = JSON.parse(reader.result);
		console.log(manifestJSON);
		blockNumber = manifestJSON.futureBlockNum;
		lotteryDetails = manifestJSON.lotteryDetails;
		numParticipants = lotteryDetails.numParticipants;
		numWinners = lotteryDetails.numWinners;
		randomKey = manifestJSON.randomKey;
		console.log("blockNumber: " + blockNumber + ", numParticipants: " + numParticipants + ", numWinners: " + numWinners);
	}
	reader.readAsText(file);	
}

$(document).ready(function()
{

	if (window.File && window.FileReader && window.FileList && window.Blob) {

	}
	else {
		alert("File APIs not supported on this browser");
		return;
	}

	$('#manifestUpload').change(handleFileSelect);

	$('#confirmManifestButton').click( (function(file)
	{
		return function()
		{
			readFile(file);
		};
	}) (file) );
	// confirmButton.click(readFile);
	// $('#confirmManifestButton').click(readFile);
});