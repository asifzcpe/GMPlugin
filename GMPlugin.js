/*! GMPlugin v1.0.0 | (c) Md. Asif Rahman */
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
		this.infowindow = new google.maps.InfoWindow({

  		});
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
	GMPlugin.prototype.centerCurrentLocationWithMarker=function(title,icon,draggable,latTxt,lngTxt){
		centerMapWithMarker=this.map;
		centerMarker=this.markerArray;
		currentLocationMarker={};
		if (navigator.geolocation) {
		     navigator.geolocation.getCurrentPosition(function (position) {
		        latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		        centerMapWithMarker.setCenter(latLng);
		        currentLocationMarker=new google.maps.Marker({
		         	draggable:(typeof draggable=='undefined')?false:true,
		         	position:latLng,
		         	title: (title=='' || title=='undefined')?'Dummy Title':title,
		         	icon: (icon=="" || icon=='undefined')?google.maps.SymbolPath.CIRCLE:icon,
		        });
		        currentLocationMarker.setMap(centerMapWithMarker);
		        centerMarker.push(currentLocationMarker); 
		        //to drag event of marker
		        currentLocationMarker.addListener('dragend',function(event){
		     		if(typeof latTxt!='undefined' && typeof lngTxt!='undefined'){
		     			document.getElementById(latTxt).value=event.latLng.lat();
		     			document.getElementById(lngTxt).value=event.latLng.lng();
		     		}
		     		else{
		     			console.warn("Please provide latitude text field id and langitude text field id");
		     		}
		     	});
		     });


	 	}
		else{
			console.warn("Sorry, current location can not be centered because your browser does not support geolocation");
		}
	}

	GMPlugin.prototype.addressAutoComplete=function(txtControlId){
		if(typeof txtControlId!='undefined'){
			txtControlId=document.getElementById(txtControlId);
			return new google.maps.places.Autocomplete(txtControlId);
		}
		else{
			console.error("please provide txtbox id to wich you wnat to bind auto complete");
		}
	}

	GMPlugin.prototype.getZipCode=function(txtControlId){
		
		    var autoCompleteChangedControl=this.addressAutoComplete(txtControlId);
		    var that=this;
		    google.maps.event.addListener(autoCompleteChangedControl,"place_changed",function(){
				that.geocoder.geocode({'address':document.getElementById(txtControlId).value}, function(results, status) {
			        if (status == google.maps.GeocoderStatus.OK) {
			            if (results[0]) {
			                for (j = 0; j < results[0].address_components.length; j++) {
			                    if (results[0].address_components[j].types[0] == 'postal_code')
			                        return results[0].address_components[j].short_name;
			                }
			            }
			        } else {
			            console.warn("Geocoder failed due to: " + status);
			        }
		    	});
			});
	}
	GMPlugin.prototype.autocompleteMapMarker=function(txtControlId,latTxt,lngTxt){
		var autoCompleteChangedControl=this.addressAutoComplete(txtControlId);
		var thisGeocoder=this.geocoder;
		var thisMap=this.map;
		var address=document.getElementById(txtControlId);
		var that=this;
		google.maps.event.addListener(autoCompleteChangedControl,"place_changed",function(){
			that.makeSingleMarkerTextAddress(address.value,latTxt,lngTxt);
			that.mapZoomLevel(13);
		});
	}
	GMPlugin.prototype.makeSingleMarkerTextAddress=function(textAddress,icon,latTxt,lngTxt){
		thisGeocoder=this.geocoder;
		thisMap=this.map;
		singleMarker=this.markerArray;
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
					if(typeof latTxt!='undefined'){
						document.getElementById(latTxt).value=mapLat;
					}
					if(typeof lngTxt!='undefined'){
						document.getElementById(lngTxt).value=mapLng;
					}
					var latLng=new google.maps.LatLng(mapLat,mapLng);
					thisMap.setCenter(latLng);
					marker=new google.maps.Marker({
						position:latLng,
						draggable:true,
						title:textAddress,
						icon:(icon=='' || icon=='undefined' ||icon==null)?google.maps.SymbolPath.CIRCLE:icon
					});
					for (var i = 0; i < singleMarker.length; i++) {
          				singleMarker[i].setMap(null);
        			}
					marker.setMap(thisMap);
					singleMarker.push(marker);

					//to drag event of marker
			        marker.addListener('dragend',function(event){
			     		if(typeof latTxt!='undefined' && typeof lngTxt!='undefined'){
			     			document.getElementById(latTxt).value=event.latLng.lat();
			     			document.getElementById(lngTxt).value=event.latLng.lng();
			     		}
			     		else{
			     			console.warn("Please provide latitude text field id and langitude text field id");
			     		}
			     	});

				}
				else
				{
					console.warn('Sorry, address not found');
				}
			});
		}
	}

	GMPlugin.prototype.mapZoomLevel=function(zoomLevel){
		this.map.setZoom(zoomLevel);
	}

	GMPlugin.prototype.directionRoute=function(params){
		directionMap=this.map;
		infowindow=this.infowindow;
		var directionsDisplay = new google.maps.DirectionsRenderer({
    								suppressMarkers: (typeof params['pointer']=='undefined')?false:params['pointer'],
    								polylineOptions: {
								       strokeColor:(typeof params['routeColor']=='undefined')?'#19196F':params['routeColor'],
								       strokeWeight:(typeof params['routeWeight']=='undefined')?7:params['routeWeight'], 
								    },
								    preserveViewport: false
    							});
    	var directionsService = new google.maps.DirectionsService();

		var request = {
	      origin: (typeof params['origin']=='undefined')?'Dhaka':params['origin'],
	      destination:(typeof params['destination']=='undefined')?'Tangaile':params['destination'],
	      optimizeWaypoints: true,
	      travelMode:(typeof params['travelMode']=='undefined')?'DRIVING':params['travelMode'],
	      unitSystem: google.maps.UnitSystem.METRIC

	    };
	    directionsService.route(request, function(response, status) {
	      if (status == google.maps.DirectionsStatus.OK) 
	      {
	        directionsDisplay.setDirections(response);
	        directionsDisplay.setMap(directionMap);
	        //to set infowindow content
	          var step =10;
		      infowindow.setContent(response.routes[0].legs[0].distance.text + "<br>" + response.routes[0].legs[0].duration.text + " ");
		      infowindow.setPosition(response.routes[0].legs[0].steps[step].end_location);
		      infowindow.open(directionMap);
	      } 
	      else 
	      {
	        console.error("Directions Request from " + params['origin'] + " to " + params['destination']+ " failed: " + status);
	      }
	    });
	}
}());
