# GMPlugin

GMPlugin is google map api plugin. This just simplifies the way of using google map api.You can do many things on google map just calling simple 
methods.

## Installation

Just add the script link in the header of the page like following
```sh
<script type="text/javascript" src="GMPlugin.js"></script>
```
Next, you must insert the script for google map api like following
```sh
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=YOURAPIKEY&libraries=places&callback=YOURINITMETHOD" async defer></script>
```
This link should have in the footer section
YOURAPIKEY=google map api key that you have registerd through your gmail account
YOURINITMETHOD=your initialized method under which you write GMPlugin code. In this case mine is initMap()

###Initialize map
```sh
<style type="text/css">
#map{
height: 100%;
}
</style>
```
```sh
<div id="map"></div>
```
```sh
<script>
function initMap() {
        // Create a map object and specify the DOM element for display.
        var obj={
        	'mapID'		:'map',
        	'lat'		:23.8103,
        	'lng'		:90.4125,
        	'zoomLevel'	:15,

        };
       var map=new GMPlugin(obj);
       map.changeMapCenter(22.8456, 89.5403);  
      }
</script>
```
###To change map center on the basis of latitude and longitude
```sh
map.changeMapCenter(22.8456, 89.5403);
```
###To change map center on the basis of your current location
```sh
map.centerCurrentLocation();
```
###Point the current location with marker and custom title
```sh
map.centerCurrentLocationWithMarker(yourTitle,yourIcon);//if no parameter passed; it will take the default icon and title
```

###To set a marker on the basis of textual address like Dhaka, Khulna etc..
```sh
map.makeSingleMarkerTextAddress("Dhaka",yourIcon);
```

###To change map zoom level
```sh
map.mapZoomLevel(8)//can be 10,11 etc...
```
###To draw direction route with custom settings
```sh
var directionRouteSettings={
        'pointer':true,
        'routeColor':'#19196F' //can be any color code
        'routeWeight':7//thickness of the route line
        'origin':'mirpur-11',
        'destination':'mirpur-12',
        'travelMode':'DRIVING'//must be in capitalcase and the options can be  DRIVING,WALKING,BICYCLING,TRANSIT
}
map.directionRoute(directionRouteSettings);//will draw a line between origin and destination address
```
