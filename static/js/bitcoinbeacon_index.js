function redirectToCreateNew()
{
	window.location.href = '/createnew';
}

function processManifest()
{
	window.location.href = '/processmanifest';
}

$(document).ready(function()
{
	$('#createNewButton').click(redirectToCreateNew);
	$('#processManifestButton').click(processManifest);
});