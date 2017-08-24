(function(){
	this.GMPlugin=function(params){
		this.map=new google.maps.Map(document.getElementById(params['mapID']),{
			center			:{lat: params['lat'], lng: params['lng']},
	        scrollwheel		:(typeof params['canScroll']=='undefined')?true:params['canScroll'],
	        zoom 			:(typeof params['zoomLevel']=='undefined')?8:params['zoomLevel'],
	        mapTypeControl	:(typeof params['mapSattelite']=='undefined')?true:params['mapSattelite'],
		});
		this.markerArray=[];
		this.geocoder=new google.maps.Geocoder();
	}
	GMPlugin.prototype.changeMapCenter=function(lat,lng){
		if(lat=="" || lat=='undefined'){
			console.error("You must provide latitude to changeMapCenter() function like changeMapCenter(23.8103,90.4125)");
		}
		if(lng=="" || lng=='undefined'){
			console.error("You must provide longitude to changeMapCenter() function like changeMapCenter(23.8103,90.4125)");
		}

		if(arguments.length!==2){
			console.error("You need to pass lat and lng parameter to changeMapCenter(lat,lng) function");
			return;
		}
		this.center=new google.maps.LatLng(lat,lng);
		this.map.panTo(this.center);
	}

	GMPlugin.prototype.centerCurrentLocation=function(){
		centerMap=this.map;
		if (navigator.geolocation) {
		     navigator.geolocation.getCurrentPosition(function (position) {
		         initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		         centerMap.setCenter(initialLocation);
		     });
	 	}
		else{
			console.warn("Sorry, current location can not be centered because your browser does not support geolocation");
		}
	}
	GMPlugin.prototype.centerCurrentLocationWithMarker=function(title,icon){
		centerMapWithMarker=this.map;
		centerMarker=this.markerArray;
		currentLocationMarker={};
		if (navigator.geolocation) {
		     navigator.geolocation.getCurrentPosition(function (position) {
		         latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		         centerMapWithMarker.setCenter(latLng);
		         currentLocationMarker=new google.maps.Marker({
		         	position:latLng,
		         	title: (title=='' || title=='undefined')?'Dummy Title':title,
		         	icon: (icon=="" || icon=='undefined')?google.maps.SymbolPath.CIRCLE:icon,
		         });
		         currentLocationMarker.setMap(centerMapWithMarker);
		         centerMarker.push(currentLocationMarker); 
		     });
	 	}
		else{
			console.warn("Sorry, current location can not be centered because your browser does not support geolocation");
		}
	}
	GMPlugin.prototype.makeSingleMarkerTextAddress=function(textAddress){
		thisGeocoder=this.geocoder;
		thisMap=this.map;
		var marker={};
		if(textAddress=='' || textAddress=='undefined')
		{
			console.error('Please, provide address');
		}
		else
		{
			thisGeocoder.geocode({'address':textAddress},function(results,status){
				if(status===google.maps.GeocoderStatus.OK)
				{
					var mapLat=results[0].geometry.location.lat();
					var mapLng=results[0].geometry.location.lng();
					var latLng=new google.maps.LatLng(mapLat,mapLng);
					thisMap.setCenter(latLng);
					marker=new google.maps.Marker({
						position:latLng,
						title:textAddress,
						icon:google.maps.SymbolPath.CIRCLE
					});
					marker.setMap(thisMap);

				}
				else
				{
					console.warn('Sorry, address not found');
				}
			});
		}
	}
}());