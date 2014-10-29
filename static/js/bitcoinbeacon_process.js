var confirmButton = $('#confirmManifestButton');
var file = $('#manifestUpload')[0];
// var blockBaseURL = "http://blockchain.info/block-index/"
var blockBaseURL = "https://api.blockcypher.com/v1/btc/main/blocks/";

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
		// urlReplacedCORS = blockBaseURL.replace("$block_index", blockNumber) + "?cors=true";
		// console.log(urlReplacedCORS);

		// $.getJSON(urlReplaced + "?callback=?", null, function(data)
		// {
		// 	var blockJSONData = JSON.parse(data)
		// 	console.log(blockJSONData);
		// });

		// console.log("url: " + blockBaseURL + blockNumber + "?format=json");
		console.log("url: " + blockBaseURL + blockNumber);

		$.ajax(
		{
			type: "GET",
			dataType: "json",
			// url: blockBaseURL + blockNumber + "?format=json",
			url: blockBaseURL + blockNumber,
			crossDomain:true,
			contentType: 'text/plain'
		}).done(function(json)
		{
			latestblock = json;
			// console.log(json);
			var blockHash = json.hash;
			console.log("blockHash: " + blockHash);
			// var blockHash = "000000000000085a032822ec22783149b3af4d590634038c7dfe217f2b3c68bf";
			var hmacOut = new sjcl.misc.hmac(randomKeyBitArray).encrypt(blockHash);
			var randomBits = sjcl.bitArray.clamp(hmacOut, 32);
			console.log("hmacOut32: " + randomBits);
			console.log("hmacOut32Length: " + sjcl.bitArray.bitLength(randomBits));

			selectLotteryWinners(randomBits, numParticipants, numWinners);
		}).fail(function(textStatus, error)
		{
			console.log("Error: " + textStatus + " " + error);
		});
	}
	reader.readAsText(file);
}

function selectLotteryWinners(randomBits, numParticipants, numWinners)
{
	// code from http://stackoverflow.com/questions/5199901/how-to-sort-an-associative-array-by-its-values-in-javascript
	var tuples = [];
	var indexHash = 0;
	var concatenated = "";
	for (var i = 0; i < numParticipants; i++) {
		concatenated = randomBits + "" + i;
		// console.log("concatenated" + i + ": " + concatenated);
		indexHash = sjcl.hash.sha256.hash(concatenated);
		// console.log("hash" + i + ": " + indexHash);
		tuples.push([i, indexHash]);
	}
	console.log(tuples[0]);
	tuples.sort(function(a, b) {
	    a = a[1];
	    b = b[1];

	    // console.log(a[0]);
	    // console.log(a[1]);

	    for (var i = 0; i < 16; i++)
	    {
	    	if (a[i] < b[i])
	    		return -1;
	    	else if (a[i] > b[i])
	    		return 1;
	    }

	    // return a < b ? -1 : (a > b ? 1 : 0);
	});
	console.log(tuples);
	var winnersPane = $('#winnersPane');
	winnersPane.html("<b>Winners:</b> ");
	for (var i = 0; i < numWinners; i++)
		winnersPane.append("" + tuples[i][0] + " ");
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