//Grlobal Variable To Get Data From JSON using ajax
var map;
var json = (function() {
	var json = null;
	$.ajax({
		'async' : false,
		'global' : false,
		'url' : "js/bank.json",
		'dataType' : "json",
		'success' : function(data) {
			json = data;
		}
	});
	return json;
})();

//Setting hight of Content for Map
$(function() {
	var $header = $('#head');
	var $content = $('#map-canvas');
	var $window = $(window).on('resize', function() {
		var height = $(window).height() - 145;
		$content.height(height);
	}).trigger('resize');
	//on page load

	var output = '';
	for (var i = 0, length = json.length; i < length; i++) {
		var data = json[i];
		output += '<li><a href="#home" onclick="newLocation(' + data.lat + ',' + data.lng + ')"><h1>' + data.unit + '</h1><p>' + data.address + '</p></a></li>';
	}
	$('#listview').append(output);
});

function newLocation(newLat, newLng) {
	map.setCenter({
		lat : newLat,
		lng : newLng
	});
	map.setZoom(18);
}

//Init MapGoogle
function initialize() {
	var latitude = -7.982557, longitude = 112.630814, radius = 8000, //how is this set up
	center = new google.maps.LatLng(latitude, longitude), mapOptions = {
		center : center,
		zoom : 12,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		scrollwheel : true,
		disableDefaultUI : true,
		zoomControl : true
	};
	//SetMap
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	//Setting Custom Icon
	var icon = {
		url : 'image/marker.png',
		// This marker is x pixels wide by y pixels high.
		size : new google.maps.Size(33, 51),
		// The origin for this image is (x, y).
		origin : new google.maps.Point(0, 0),
		// The anchor for this image is the base of the flagpole at (xx,yy).
		anchor : new google.maps.Point(0, 51)
	};

	setMarkers(center, radius, icon, map);
}

function setMarkers(center, radius, icon, map) {

	//loop between each of the json elements
	for (var i = 0, length = json.length; i < length; i++) {
		var data = json[i], latLng = new google.maps.LatLng(data.lat, data.lng);

		// Creating a marker and putting it on the map
		var marker = new google.maps.Marker({
			position : latLng,
			map : map,
			icon : icon,
			title : "BRI Unit " + data.unit
		});
		infoBox(map, marker, data);
	}
}

function infoBox(map, marker, data) {
	var infoWindow = new google.maps.InfoWindow();
	// Attaching a click event to the current marker
	google.maps.event.addListener(marker, "click", function(e) {
		infoWindow.setContent("<b>BRI Unit " + data.unit + "</b>");
		infoWindow.open(map, marker);
	});

	// Creating a closure to retain the correct data
	// Note how I pass the current data in the loop into the closure (marker, data)
	(function(marker, data) {
		// Attaching a click event to the current marker
		google.maps.event.addListener(marker, "click", function(e) {infoWindow.setContent("<p align='center'><img src='image/icon.png'/><br><b>BRI Unit " + data.unit + "</b><br>" + data.address + "<br>Telp : " + data.telp + "<br>fax : " + data.fax) + "</p>";
			infoWindow.open(map, marker);
		});
	})(marker, data);
}

google.maps.event.addDomListener(window, 'load', initialize);
