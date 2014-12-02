function selectLotteryWinnersDefault(randomBits, numParticipants, numWinners)
{
	// code from http://stackoverflow.com/questions/5199901/how-to-sort-an-associative-array-by-its-values-in-javascript
	var tuples = [];
	var indexHash = 0;
	var concatenated = "";
	for (var i = 0; i < numParticipants; i++) 
	{
		concatenated = randomBits + "" + i;
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

var defaultLotteryScript = '' + selectLotteryWinnersDefault + ' selectLotteryWinnersDefault(randomBits, numParticipants, numWinners);';

var fakeLotteryScript = "console.log('ohai')";