// carica una risorsa testo da un file sulla rete
var loadTextResource = function (url, callback) {
	var request = new XMLHttpRequest();
	//valore random per cambiare la chiamata, questo per non far usare la cache dei file al browser
	request.open('GET',url + '?please-dont-cache=' + Math.random(),true);
	request.onload = function() {
		if (request.status < 200 || request.status > 299) {
			callback('Error: HTTP Status' + request.status + 'on resource' + url);
		} else {
			//primo valore nullo perchè rappresenta se c'è stato un errore
			callback(null, request.responseText);
		}
	};
	request.send();
};

// carica una risorsa immagine da un file sulla rete
var loadImage = function(url, callback){
	var image = new Image();
	image.onload = function () {
		callback(null,image);
	};
	image.src = url;
};

// carica una risorsa obj da un file sulla rete
var loadOBJResource = function (url, callback){
	loadTextResource(url, function(err, result) {
		if(err) {
			callback(err);
		} else {
			callback(null,result);
		}
	});
};

//prendo parametor dal'url della chiamata al browser
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// carica una risorsa audio da un file sulla rete
var loadAudio = function(url, callback){
	var audio = new Audio(url);
	audio.onloadstart = function () {
		callback(null,audio);
	};
};