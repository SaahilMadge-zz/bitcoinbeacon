function extractRandomness(blockNumber, randomKeyBitArray)
{
	var blockBaseURL = "https://api.blockcypher.com/v1/btc/main/blocks/";
	console.log('url: ' + blockBaseURL + blockNumber);

	$.ajax(
	{
		type: 'GET',
		dataType: 'json',

		// for testing, use a hardcoded block
		// url: blockBaseURL + blockNumber,
		url: blockBaseURL + '329500',
		crossDomain:true,
		contentType: 'text/plain'
	}).done(function(json)
	{
		latestblock = json;
		// console.log(json);
		var blockHash = json.hash;
		console.log('blockHash: ' + blockHash);
		var hmacOut = new sjcl.misc.hmac(randomKeyBitArray).encrypt(blockHash);
		var randomBits = sjcl.bitArray.clamp(hmacOut, 32);
		console.log('hmacOut32: ' + randomBits);
		console.log('hmacOut32Length: ' + sjcl.bitArray.bitLength(randomBits));

		// selectLotteryWinnersDefault(randomBits, numParticipants, numWinners);
		return randomKeyBitArray
	}).fail(function(textStatus, error)
	{
		console.log('Error: ' + textStatus + ' ' + error);
		return null;
	});
}

// function selectLotteryWinnersDefault(randomBits, numParticipants, numWinners)
// {
// 	// code from http://stackoverflow.com/questions/5199901/how-to-sort-an-associative-array-by-its-values-in-javascript
// 	var tuples = [];
// 	var indexHash = 0;
// 	var concatenated = "";
// 	for (var i = 0; i < numParticipants; i++) {
// 		concatenated = randomBits + "" + i;
// 		// console.log("concatenated" + i + ": " + concatenated);
// 		indexHash = sjcl.hash.sha256.hash(concatenated);
// 		// console.log("hash" + i + ": " + indexHash);
// 		tuples.push([i, indexHash]);
// 	}
// 	console.log(tuples[0]);
// 	tuples.sort(function(a, b) {
// 	    a = a[1];
// 	    b = b[1];

// 	    // console.log(a[0]);
// 	    // console.log(a[1]);

// 	    for (var i = 0; i < 16; i++)
// 	    {
// 	    	if (a[i] < b[i])
// 	    		return -1;
// 	    	else if (a[i] > b[i])
// 	    		return 1;
// 	    }

// 	    // return a < b ? -1 : (a > b ? 1 : 0);
// 	});
// 	console.log(tuples);
// 	var winnersPane = $('#winnersPane');
// 	winnersPane.html("<b>Winners:</b> ");
// 	for (var i = 0; i < numWinners; i++)
// 		winnersPane.append("" + tuples[i][0] + " ");
// }

function processLottery()
{
	// get the JSON fields
	// manifestJSON = JSON.parse(reader.result);
	// console.log(manifestJSON);
	// blockNumber = manifestJSON.futureBlockNum;
	// lotteryDetails = manifestJSON.lotteryDetails;
	// numParticipants = lotteryDetails.numParticipants;
	// numWinners = lotteryDetails.numWinners;
	// randomKey = manifestJSON.randomKey;
	blockNumber = $('#futureBlockNum').html();
	// console.log(blockNumber);

	// hack together a way to get the JSON object since Python is really annoying with how it displays things
	lotteryDetailsString = $('#lotteryDetails').html().replace(/u\'/g, '\'').replace(/\'/g, '\"');//.replace(/numParticipants/, '\"numParticipants\"').replace(/numWinners/, '\"numWinners\"').replace(/participantsList/,'\"participantsList\"');
	console.log('lotteryDetails: ' + lotteryDetailsString);
	lotteryDetails=JSON.parse(lotteryDetailsString);
	numParticipants = lotteryDetails.numParticipants;
	numWinners = lotteryDetails.numWinners;
	participantsList = lotteryDetails.participantsList;
	randomKeyBitArray = $('#randomKey').html();
	allowMultipleWins = $('#allowMultipleWins').html();
	console.log()

	console.log('blockNumber: ' + blockNumber + ', numParticipants: ' + numParticipants + ', numWinners: ' + numWinners + ', randomKey: ' + randomKeyBitArray);
	console.log(participantsList);
	// convert the random key to hex
	// randomKeyHex = randomKey.toString(16);

	// // convert the hex to bitArray for use in sjcl
	// randomKeyBitArray = sjcl.codec.hex.toBits(randomKeyHex);
	// console.log(randomKeyBitArray);

	// query blockchain.info for the hash of that block
	// console.log(urlReplacedCORS);

	// {
	// 	var blockJSONData = JSON.parse(data)
	// 	console.log(blockJSONData);
	// });

	var randomBits = extractRandomness(blockNumber, randomKeyBitArray);
	while (randomBits === null)
	{
		setTimeout(function()
		{
			randomBits = extractRandomness(blockNumber, randomKeyBitArray);
		}, 1000);
	}

	var scriptText;
	if ($('#scriptText').length)
	{
		scriptText = $('#scriptText').html().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	}
	console.log("scriptText: " + scriptText);
	var tuples = eval(scriptText);

	console.log("tuples: " + tuples);

	var winnersPane = $('#winnersPane');
	winnersPane.html("<b>Winners:</b> ");
	for (var i = 0; i < numWinners; i++)
		winnersPane.append("" + tuples[i][0] + " ");
}

$(document).ready(function()
{
	// console.log("manifestContainer: " + $('#manifestContainer'));
	// console.log("manifestContainer html: " + $('#manifestContainer').html());
	// var obj = $('#manifestContainer').html();
	// console.log(typeof obj);
	// var newObj =obj.replace(/'/g, "\""); 
	// console.log(newObj);
	// var jsonObj = ("\'" + newObj + "\'").trim();
	// console.log(jsonObj);
	// var parsedObj = $.parseJSON(newObj);
	// console.log("parsedObj: " + parsedObj);
	$('#processLottery').click(function(event){
		event.preventDefault();
		processLottery();
	})

	var futureBlockNum = parseInt($('#futureBlockNum').html());
	console.log("futureBlockNum: " + futureBlockNum);

	$.ajax(
	{
		dataType: "text",
		url: "https://blockchain.info/q/getblockcount",
	}).done(function(text)
	{
		latestblock = parseInt(text);
		console.log("latestblock: " + latestblock);
		console.log(futureBlockNum - latestblock);
	}).fail(function(textStatus, error)
	{
		console.log("Error: " + textStatus + " " + error);
	});	
	allowMultipleWins = $('#allowMultipleWins').html();
	console.log("allowMultipleWins: " + allowMultipleWins);
	// $.ajax(
	// {
	// 	type: "GET",
	// 	dataType: "json",
	// 	// url: blockBaseURL + blockNumber + "?format=json",
	// 	url: "https://api.blockcypher.com/v1/btc/main/blocks/" + blockNumber,
	// 	crossDomain:true,
	// 	contentType: 'text/plain'
	// }).done(function(json)
	// {
	// 	latestblock = json;
	// 	// console.log(json);
	// 	var blockHash = json.hash;
	// 	console.log("blockHash: " + blockHash);
	// 	// var blockHash = "000000000000085a032822ec22783149b3af4d590634038c7dfe217f2b3c68bf";
	// 	var hmacOut = new sjcl.misc.hmac(randomKeyBitArray).encrypt(blockHash);
	// 	var randomBits = sjcl.bitArray.clamp(hmacOut, 32);
	// 	console.log("hmacOut32: " + randomBits);
	// 	console.log("hmacOut32Length: " + sjcl.bitArray.bitLength(randomBits));

	// 	selectLotteryWinners(randomBits, numParticipants, numWinners);
	// }).fail(function(textStatus, error)
	// {
	// 	console.log("Error: " + textStatus + " " + error);
	// });
})