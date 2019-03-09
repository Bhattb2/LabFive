window.onload = function(){
	alert('Click on the map to select your start and end points.');
}

var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmhhdHRiMiIsImEiOiJjam82azdmNjIwYjk3M2tvYThuNzQxMXM0In0.-DsIcDsDaHJkJoCqDnTnhg';

var street   = L.tileLayer(mbUrl, {id: 'mapbox.streets', maxZoom:18, attribution: mbAttr}),
satellite  = L.tileLayer(mbUrl, {id: 'mapbox.streets-satellite', maxZoom:18, attribution: mbAttr});

var map = L.map('map', {
	layers:[street]}).fitWorld().setView([47.25, -122.44], 11);

var baseLayers = {
	"Street": street,
	"Satellite": satellite
};
L.control.layers(baseLayers).addTo(map);

var control = L.Routing.control({
          waypoints: [
              //L.latLng(47.246587, -122.438830),
              //L.latLng(47.258024, -122.444725),
              //L.latLng(47.318017, -122.542970)
          ],
          routeWhileDragging: true,
          units: 'imperial',
          router: L.Routing.mapbox('pk.eyJ1IjoiYmhhdHRiMiIsImEiOiJjam82azdmNjIwYjk3M2tvYThuNzQxMXM0In0.-DsIcDsDaHJkJoCqDnTnhg'),
          geocoder: L.Control.Geocoder.nominatim(),
      }).addTo(map);

function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

map.on('click', function(e) {
    var container = L.DomUtil.create('div'),
        startBtn = createButton('Start from this location', container),
        destBtn = createButton('Go to this location', container);

        L.DomEvent.on(startBtn, 'click', function() {
              control.spliceWaypoints(0, 1, e.latlng);
              map.closePopup();
          });

        L.DomEvent.on(destBtn, 'click', function() {
        control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
        map.closePopup();
    });


    L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(map);
});



function onLocationFound(e) {

	var radius = e.accuracy / 2;

	var latlong = e.latlng

	L.marker(e.latlng).addTo(map)
	.bindPopup("You are within " + radius + "m of this point.<br>" + latlong).Popup();

	//L.circle(e.latlng, radius).addTo(map);

}

function onLocationError(e) {
	alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

//This specifies that the locate method should run
map.locate({
  setView: false, //this option centers the map on location and zooms
  maxZoom: 16, // this option prevents the map from zooming further than 16, maintaining some spatial context even if the accuracy of the location reading allows for closer zoom
  timeout: 15000, // Changed this to 15000.
  watch: false, // you can set this option from false to true to track a user's movement over time instead of just once. For our purposes, however, leave this option as is.
});
