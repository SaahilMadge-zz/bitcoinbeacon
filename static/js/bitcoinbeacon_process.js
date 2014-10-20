var confirmButton = $('#confirmManifestButton');
var file = $('#manifestUpload')[0];
var blockBaseURL = "http://blockchain.info/block-index/$block_index?format=json"

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
		// get the JSON fields
		manifestJSON = JSON.parse(reader.result);
		console.log(manifestJSON);
		blockNumber = manifestJSON.futureBlockNum;
		lotteryDetails = manifestJSON.lotteryDetails;
		numParticipants = lotteryDetails.numParticipants;
		numWinners = lotteryDetails.numWinners;
		randomKey = manifestJSON.randomKey;
		console.log("blockNumber: " + blockNumber + ", numParticipants: " + numParticipants + ", numWinners: " + numWinners + ", randomKey: " + randomKey);

		// convert the random key to hex
		randomKeyHex = randomKey.toString(16);
		console.log("randomKey to array: " + randomKeyHex);

		// convert the hex to bitArray for use in sjcl
		randomKeyBitArray = sjcl.codec.hex.toBits(randomKeyHex);
		console.log(randomKeyBitArray);

		// query blockchain.info for the hash of that block
		urlReplacedCORS = blockBaseURL.replace("$block_index", blockNumber) + "?cors=true";
		console.log(urlReplacedCORS);

		// $.getJSON(urlReplaced + "?callback=?", null, function(data)
		// {
		// 	var blockJSONData = JSON.parse(data)
		// 	console.log(blockJSONData);
		// });

		// $.ajax(
		// {
		// 	type: "GET",
		// 	dataType: "jsonp",
		// 	url: urlReplacedCORS,
		// 	crossDomain:true,
		// 	contentType: 'text/plain'
		// }).done(function(json)
		// {
		// 	latestblock = json;
		// 	console.log(json);
		// }).fail(function(textStatus, error)
		// {
		// 	console.log("Error: " + textStatus + " " + error);
		// });

		var blockHash = "000000000000085a032822ec22783149b3af4d590634038c7dfe217f2b3c68bf";
		var hmacOut = new sjcl.misc.hmac(randomKeyBitArray).encrypt(blockHash);
		var hmacOut32 = sjcl.bitArray.clamp(hmacOut, 32);
		console.log("hmacOut32: " + hmacOut32);
		console.log("hmacOut32Length: " + sjcl.bitArray.bitLength(hmacOut32));
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