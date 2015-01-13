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
	blockNumber = $('#futureBlockNum').html().trim();
	// console.log(blockNumber);

	// hack together a way to get the JSON object since Python is really annoying with how it displays things
	//lotteryDetailsString = $('#lotteryDetails').html().replace(/u\'/g, '\'').replace(/\'/g, '\"');//.replace(/numParticipants/, '\"numParticipants\"').replace(/numWinners/, '\"numWinners\"').replace(/participantsList/,'\"participantsList\"');
	//console.log('lotteryDetails: ' + lotteryDetailsString);
	//lotteryDetails=JSON.parse(lotteryDetailsString);
	//numParticipants = lotteryDetails.numParticipants;
	//numWinners = lotteryDetails.numWinners;
	//participantsList = lotteryDetails.participantsList;
	var numParticipants = null;
	var numWinners = null;
	var participantsList = null;
	var allowMultipleWins = null;

	if ($('#numParticipants').length) {
		numParticipants = $('#numParticipants').html();
	}
	if ($('#numWinners').length) {
		numWinners = $('#numWinners').html();
		console.log('here!');
	}
	if ($('#participantsList').length) {
		participantsList = $('#participantsList').html().trim();
		console.log(participantsList.length);
		if (!participantsList.length) {
			participantsList = null;
		}
	}
	if (participantsList != null) {
		participantsList = participantsList.split(",");
	}
	randomKeyBitArray = $('#randomKey').html();
	if ($('#allowMultipleWins').length) {
		allowMultipleWins = $('#allowMultipleWins').html().toString().trim();
		console.log("initial allowMultipleWins: " + allowMultipleWins);
		if (allowMultipleWins === "no")
		{
			allowMultipleWins = false;
		}
		else
		{
			allowMultipleWins = true;
		}
	}

	console.log('blockNumber: ' + blockNumber + ', numParticipants: ' + numParticipants + ', numWinners: ' + numWinners + ', randomKey: ' + randomKeyBitArray + ", allowMultipleWins: " + allowMultipleWins);
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

	function extractRandomness()
	{
		var blockBaseURL = "https://api.blockcypher.com/v1/btc/main/blocks/";
		console.log('url: ' + blockBaseURL + blockNumber);

		// 1st block
		$.ajax(
		{
			type: 'GET',
			dataType: 'json',

			// for testing, use a hardcoded block
			url: blockBaseURL + blockNumber,
			// url: blockBaseURL + '329500',
			crossDomain:true,
			contentType: 'text/plain'
		}).done(function(json1)
		{
			var blockHash1 = json1.hash;
			console.log('blockHash1: ' + blockHash1);
			//console.log('randomKeyBitArray' + randomKeyBitArray);
			//console.log('is there a difference: ' + sjcl.codec.hex.toBits(randomKeyBitArray.toString(16)));
			var hmacOut1 = new sjcl.misc.hmac(randomKeyBitArray).encrypt(blockHash1);
			var randomBits1 = sjcl.bitArray.clamp(hmacOut1, 32);
			console.log('hmacOut32First: ' + randomBits1);
			// console.log('hmacOut32Length: ' + sjcl.bitArray.bitLength(randomBits));

			// 2nd block
			$.ajax(
			{
				type: 'GET',
				dataType: 'json',

				// for testing, use a hardcoded block
				url: blockBaseURL + (blockNumber - 1),
				// url: blockBaseURL + '329499',
				crossDomain:true,
				contentType: 'text/plain'
			}).done(function(json2)
			{
				var blockHash2 = json2.hash;
				console.log('blockHash2: ' + blockHash2);
				var hmacOut2 = new sjcl.misc.hmac(randomKeyBitArray).encrypt(blockHash2);
				var randomBits2 = sjcl.bitArray.clamp(hmacOut2, 32);
				console.log('hmacOut32Second: ' + randomBits2);

				// 3rd block
				$.ajax(
				{
					type: 'GET',
					dataType: 'json',

					// for testing, use a hardcoded block
					url: blockBaseURL + (blockNumber - 2),
					// url: blockBaseURL + '329498',
					crossDomain:true,
					contentType: 'text/plain'
				}).done(function(json3)
				{
					var blockHash3 = json3.hash;
					console.log('blockHash3: ' + blockHash3);
					var hmacOut3 = new sjcl.misc.hmac(randomKeyBitArray).encrypt(blockHash3);
					var randomBits3 = sjcl.bitArray.clamp(hmacOut3, 32);
					console.log('hmacOut32Third: ' + randomBits3);

					// 4th block
					$.ajax(
					{
						type: 'GET',
						dataType: 'json',

						// for testing, use a hardcoded block
						url: blockBaseURL + (blockNumber - 3),
						// url: blockBaseURL + '329497',
						crossDomain:true,
						contentType: 'text/plain'
					}).done(function(json4)
					{
						var blockHash4 = json4.hash;
						console.log('blockHash4: ' + blockHash4);
						var hmacOut4 = new sjcl.misc.hmac(randomKeyBitArray).encrypt(blockHash4);
						var randomBits4 = sjcl.bitArray.clamp(hmacOut4, 32);
						console.log('hmacOut32Fourth: ' + randomBits4);

						var extractedRandomBits = sjcl.bitArray.concat(randomBits1, sjcl.bitArray.concat(randomBits2, sjcl.bitArray.concat(randomBits3, randomBits4)));

						// selectLotteryWinnersDefault(randomBits, numParticipants, numWinners);
						// return randomBits;

						// var randomBits = extractRandomness(blockNumber, randomKeyBitArray);
						console.log("128 random bits: " + extractedRandomBits);
						console.log("128 bits' length: " + sjcl.bitArray.bitLength(extractedRandomBits));
						// while (randomBits === null)
						// {
						// 	setTimeout(function()
						// 	{
						// 		randomBits = extractRandomness(blockNumber, randomKeyBitArray);
						// 	}, 2000);
						// }

						var scriptText;
						if ($('#scriptText').length)
						{
							scriptText = $('#scriptText').html().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
						
							// console.log("scriptText: " + scriptText);
							// console.log("randomBitsOutside: " + randomBits);
							var tuples = eval(scriptText);
							console.log("tuples: " + tuples);
							// default lottery
							if (numWinners) 
							{
								console.log("tuples.length: " + tuples.length);

								var winnersPane = $('#winnersPane');
								winnersPane.html("<b>Winners:</b> ");
								for (var i = 0; i < numWinners; i++)
								{
									if (participantsList && participantsList.length) 
									{
										console.log(participantsList.length);
										if (tuples[i][0] < participantsList.length)
										{
											winnersPane.append("" + participantsList[tuples[i][0]]);
										}
										else
										{
											winnersPane.append("" + tuples[i][0]);
										}
									}
									else 
									{
										winnersPane.append("" + tuples[i][0]);
									}

									if (i < numWinners - 1)
									{
										winnersPane.append(", ");
									}
								}
							}
							// ordered lottery
							else if (numParticipants) 
							{
								var winnersPane = $('#winnersPane');
								winnersPane.html("<b>Order:</b> ");
								for (var i = 0; i < numParticipants; i++)
								{
									if (participantsList) 
									{
										if (tuples[i][0] < participantsList.length)
										{
											winnersPane.append("" + participantsList[tuples[i][0]]);
										}
										else
										{
											winnersPane.append("" + tuples[i][0]);
										}
									}
									else 
									{
										winnersPane.append("" + tuples[i][0]);
									}

									if (i < numParticipants - 1)
									{
										winnersPane.append(", ");
									}
								}
							}
							else if ($('#scriptText').html().trim() === randomLotteryScript) {
								var winnersPane = $('#winnersPane');
								winnersPane.html("<b>Random Number: " + tuples + "</b> ");
							}
							else 
							{
								var winnersPane = $('#winnersPane');
								winnersPane.html("<b>" + tuples + "</b> ");
							}
						}
						else {

						}

					}).fail(function(textStatus, error)
					{
						console.log('Error: ' + textStatus + ' ' + error);
						return null;
					});

				}).fail(function(textStatus, error)
				{
					console.log('Error: ' + textStatus + ' ' + error);
					return null;
				});

			}).fail(function(textStatus, error)
			{
				console.log('Error: ' + textStatus + ' ' + error);
				return null;
			});
		}).fail(function(textStatus, error)
		{
			console.log('Error: ' + textStatus + ' ' + error);
			return null;
		});
	}

	extractRandomness();
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
	});
	$('#processLottery').hide();

	var futureBlockNum = parseInt($('#futureBlockNum').html());
	console.log("futureBlockNum: " + futureBlockNum);

	if ($('#numParticipantsRow').length) {
		$('#numParticipantsRow').html("Number of Participants: ");
	}
	if ($('#numWinnersRow').length) {
		$('#numWinnersRow').html("Number of Winners: ");
		console.log('here!');
	}
	if ($('#participantsListRow').length) {
		$('#participantsListRow').html("Participants: ");
	}
	$('#hashOutputStringRow').html("Manifest Hash: ");
	$('#futureBlockNumRow').html("Block: ");
	$('#randomKeyRow').html("Random Key: ");
	$('#scriptTextRow').html("Script: ");

	console.log("randomLotteryScript: " + randomLotteryScript);
	console.log("script: " + $('#scriptText').html());
	console.log(randomLotteryScript == $('#scriptText').html().trim());

	$.ajax(
	{
		dataType: "text",
		url: "https://blockchain.info/q/getblockcount",
	}).done(function(text)
	{
		latestblock = parseInt(text);
		console.log("latestblock: " + latestblock);
		console.log(futureBlockNum - latestblock);
		desiredblock = $('#futureBlockNum').html();
		if (latestblock < desiredblock)
		{
			var winnersPane = $('#winnersPane');
			winnersPane.html("Sorry, the lottery results are not available yet. They will be available in about " + Math.ceil((desiredblock - latestblock) * 10) + " minutes.");
			$('#processLottery').click(function(event){
				event.preventDefault();
			});
			$('#processLottery').hide();
		}
		else 
		{
			$('#processLottery').click(function(event){
				event.preventDefault();
				$('#winnersPane').html("Calculating...");
				processLottery();
			}).show();
		}
	}).fail(function(textStatus, error)
	{
		console.log("Error: " + textStatus + " " + error);
	});	
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