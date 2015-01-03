function selectLotteryWinnersDefault(extractedRandomBits, numParticipants, numWinners, allowMultipleWins)
{
	// code from http://stackoverflow.com/questions/5199901/how-to-sort-an-associative-array-by-its-values-in-javascript
	var tuples = [];
	var indexHash = 0;
	var concatenated = "";
	console.log("numWinners inside: " + numWinners);
	console.log("extractedRandomBits: " + extractedRandomBits);
	console.log("allowMultipleWins: " + allowMultipleWins);

	for (var i = 0; i < numParticipants; i++) 
	{
		concatenated = extractedRandomBits + "" + i;
		indexHash = sjcl.hash.sha256.hash(concatenated);
		tuples.push([i, indexHash]);
		console.log("indexHash: " + indexHash[0]);
	}
	// console.log(tuples[0]);

	function sortEntries()
	{
		tuples.sort(function(a, b) {
			console.log("a: " + a[1] + ", b: " + b[1]);
			console.log(a[1] < b[1]);
		    a = a[1];
		    b = b[1];
		    for (var i = 0; i < 16; i++)
		    {
		    	// console.log("a[1]: " + a[1]);
		    	if (a[i] < b[i])
		    		return -1;
		    	else if (a[i] > b[i])
		    		return 1;
		    }
		});
	}

	// for (var i = 0; i < tuples.length; i++)
	// {
	// 	console.log("place " + i + ": " + tuples[i][1]);
	// }

	var resultsArray = [];
	if (allowMultipleWins)
	{
		for (var i = 0; i < numWinners; i++)
		{
			sortEntries();
			resultsArray.push(tuples[0]);
			for (var j = 0; j < numParticipants; j++) 
			{
				// concatenated = extractedRandomBits + "" + i;
				newIndexHash = sjcl.hash.sha256.hash(tuples[j][1]);
				tuples[j] = [j, newIndexHash];
				console.log("newIndexHash: " + newIndexHash[0]);
			}
		}
		console.log("resultsArray length: " + resultsArray.length);
	}
	else
	{
		sortEntries();
		console.log("numWinners again: " + (numWinners - 0));
		resultsArray = tuples.slice(0, numWinners);
	}
	console.log("resultsArray length: " + resultsArray.length);
	return resultsArray;
}
var defaultLotteryScript = '' + selectLotteryWinnersDefault + ' selectLotteryWinnersDefault(randomBits, numParticipants, numWinners, allowMultipleWins);';

var fakeLotteryScript = "console.log('ohai')";

function selectLotteryWinnersWeighted(extractedRandomBits, numParticipants, numWinners)
{
	// code from http://stackoverflow.com/questions/5199901/how-to-sort-an-associative-array-by-its-values-in-javascript
	var tuples = [];
	var indexHash = 0;
	var concatenated = "";
	for (var i = 0; i < numParticipants; i++) 
	{
		concatenated = extractedRandomBits + "" + i;
		indexHash = sjcl.hash.sha256.hash(concatenated);
		tuples.push([i, indexHash]);
	}
	// console.log(tuples[0]);

	tuples.sort(function(a, b) {
	    a = a[1];
	    b = b[1];
	    for (var i = 0; i < 16; i++)
	    {
	    	if (a[i] < b[i])
	    		return -1;
	    	else if (a[i] > b[i])
	    		return 1;
	    }
	});

	// console.log(tuples);
	return tuples;
}
var weightedLotteryScript = '' + selectLotteryWinnersWeighted + ' selectLotteryWinnersWeighted(extractedRandomBits, numParticipants, numWinners);';

function orderedLottery(extractedRandomBits, numParticipants)
{
	var participantOrder = [];
	for (var i = 0; i < numParticipants; i++) 
	{
		concatenated = extractedRandomBits + "" + i;
		indexHash = sjcl.hash.sha256.hash(concatenated);
		participantOrder.push([i, indexHash]);
	}

	participantOrder.sort(function(a, b) {
	    a = a[1];
	    b = b[1];
	    for (var i = 0; i < 16; i++)
	    {
	    	if (a[i] < b[i])
	    		return -1;
	    	else if (a[i] > b[i])
	    		return 1;
	    }
	});

	return participantOrder;
}
