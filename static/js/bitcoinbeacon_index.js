function redirectToCreateNew()
{
	window.location.href = '/createnew';
}

function processManifest()
{
	window.location.href = '/processmanifest';
}

function manifestEntry()
{
	var manifestHashEntryField = $('#manifestHashEntryField');
	var manifestHashEntryButton = $('#manifestHashEntryButton');
	// manifestHashEntryField.show();
	// manifestHashEntryButton.show();
	$('#manifestEntry').show().children().show();

	var defaultVal = "Enter the hash here";
	manifestHashEntryField.val(defaultVal);
	manifestHashEntryField.css('color', 'gray');

	manifestHashEntryField.focus(function(event) {
		manifestHashEntryField.val("");
		manifestHashEntryField.css('color', 'black');
	});
	manifestHashEntryField.blur(function(event) {
		if(manifestHashEntryField.val() == ""){
			manifestHashEntryField.val(defaultVal);
			manifestHashEntryField.css('color', 'gray');
		}
	});
}

function redirectToManifest()
{
	window.location.href = '/manifest/' + $('#manifestHashEntryField').val();
}

var file = $('#manifestUploadFile')[0];

function handleFileSelect(evt)
{
	file = evt.target.files[0];
	console.log(file);
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
		window.location.href = "/manifest/" + manifestJSON['hashOutputString'];
	}
	reader.readAsText(file);
}

$(document).ready(function()
{
	// $('#manifestHashEntryField').css('display', 'none');
	// $('#manifestHashEntryButton').css('display', 'none').click(redirectToManifest);
	$('#manifestEntry').hide().children().hide();
	$('#createNewButton').click(redirectToCreateNew);
	$('#processManifestButton').click(manifestEntry);

	if (window.File && window.FileReader && window.FileList && window.Blob) {}
	else {
		alert("File APIs not supported on this browser");
		return;
	}

	$('#manifestUploadFile').change(handleFileSelect);
	$('#submitManifestButton').click((function(file)
	{
		return function()
		{
			readFile(file);
		};
	}) (file) );

	// console.log(jStat.exponential.cdf(10, 1/10));
	// console.log(jStat.gamma.inv(.99, 1, 10));
	// console.log(jStat.gamma.cdf(20, 1, 10));
	// var totalDiff = 0;
	// for (var i = 0; i < 99; i++) {
	// 	var inv = jStat.gamma.inv(.99, i, 10)
	// 	console.log(inv);
	// 	totalDiff += inv - (10*i);
	// }
	// console.log("average difference: " + totalDiff / 100);
	// console.log(jStat.gamma.cdf(50, 5, 10));
	// console.log(jStat.gamma.cdf(100, 10, 10));
	// console.log(jStat.gamma.cdf(14024, 1430, 9.81));
});