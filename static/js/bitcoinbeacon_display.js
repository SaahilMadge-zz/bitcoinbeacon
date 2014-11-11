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