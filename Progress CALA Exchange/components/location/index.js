function id(element) {
	return document.getElementById(element);
}
 
document.addEventListener("deviceready", onDeviceReady, false);
 
function onDeviceReady() {
	navigator.splashscreen.hide();
    geolocationApp = new geolocationApp();
	geolocationApp.run();
    
}
 
function geolocationApp() {
}

geolocationApp.prototype = {
	_watchID:null,
    
	run:function() {
		var that = this;
		document.getElementById("watchButton").addEventListener("click", function() {
			that._handleWatch.apply(that, arguments);
		}, false);
		document.getElementById("refreshButton").addEventListener("click", function() {
			that._handleRefresh.apply(that, arguments);
		}, false);
	},
    
	_handleRefresh:function() {
        var options = {
            	enableHighAccuracy: true
            },
            that = this;
        
        that._setResults("Waiting for geolocation information...");
        
		navigator.geolocation.getCurrentPosition(function() {
			that._onSuccess.apply(that, arguments);
		}, function() {
			that._onError.apply(that, arguments);
		}, options);
	},
    
	_handleWatch:function() {
		var that = this,
		// If watch is running, clear it now. Otherwise, start it.
		button = document.getElementById("watchButton");
                     
		if (that._watchID != null) {
			that._setResults();
			navigator.geolocation.clearWatch(that._watchID);
			that._watchID = null;
                         
			button.innerHTML = "Start Geolocation Watch";
		}
		else {
			that._setResults("Waiting for geolocation information...");
			// Update the watch every second.
			var options = {
				frequency: 1000,
				enableHighAccuracy: true
			};
			that._watchID = navigator.geolocation.watchPosition(function() {
				that._onSuccess.apply(that, arguments);
			}, function() {
				that._onError.apply(that, arguments);
			}, options);
			button.innerHTML = "Clear Geolocation Watch";
            
		}
	},
    
	_onSuccess:function(position) {
		// Successfully retrieved the geolocation information. Display it all.
        
		this._setResults('Latitude: ' + position.coords.latitude + '<br />' +
						 'Longitude: ' + position.coords.longitude + '<br />' +
						 'Altitude: ' + position.coords.altitude + '<br />' +
						 'Accuracy: ' + position.coords.accuracy + '<br />' +
						 'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
						 'Heading: ' + position.coords.heading + '<br />' +
						 'Speed: ' + position.coords.speed + '<br />' +
						 'Timestamp: ' + new Date(position.timestamp).toLocaleTimeString().split(" ")[0] + '<br />');
	},
    
	_onError:function(error) {
		this._setResults('code: ' + error.code + '<br/>' +
						 'message: ' + error.message + '<br/>');
	},
    
	_setResults:function(value) {
		if (!value) {
			document.getElementById("results").innerHTML = "";
		}
		else {
			document.getElementById("results").innerHTML = value;
		}
	},
}

(function (global) {
    var map,
        geocoder,
        LocationViewModel,
        app = global.app = global.app || {};

    LocationViewModel = kendo.data.ObservableObject.extend({
        _lastMarker: null,
        _isLoading: false,

        address: "",
        isGoogleMapsInitialized: false,
        hideSearch: false,

        onNavigateHome: function () {
            var that = this,
                position;

            that._isLoading = true;
            that.toggleLoading();

            position = new google.maps.LatLng(-23.608895, -46.696253);
            map.panTo(position);
            that._putMarker(position);

            that._isLoading = false;
            that.toggleLoading();

        },

        toggleLoading: function () {
            if (this._isLoading) {
                kendo.mobile.application.showLoading();
            } else {
                kendo.mobile.application.hideLoading();
            }
        },

        _putMarker: function (position) {
            var that = this;

            if (that._lastMarker !== null && that._lastMarker !== undefined) {
                that._lastMarker.setMap(null);
            }

            that._lastMarker = new google.maps.Marker({
                map: map,
                position: position
            });
        },

    });

    app.locationService = {
        initLocation: function () {
            var mapOptions,
                streetView;

            if (typeof google === "undefined") {
                return;
            }

            app.locationService.viewModel.set("isGoogleMapsInitialized", true);

            mapOptions = {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },

                mapTypeControl: false,
                streetViewControl: false
            };

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            geocoder = new google.maps.Geocoder();
            app.locationService.viewModel.onNavigateHome.apply(app.locationService.viewModel, []);

            streetView = map.getStreetView();

            google.maps.event.addListener(streetView, 'visible_changed', function () {

                if (streetView.getVisible()) {
                    app.locationService.viewModel.set("hideSearch", true);
                } else {
                    app.locationService.viewModel.set("hideSearch", false);
                }

            });
        },

        show: function () {
            if (!app.locationService.viewModel.get("isGoogleMapsInitialized")) {
                return;
            }

            //resize the map in case the orientation has been changed while showing other tab
            google.maps.event.trigger(map, "resize");
            app.locationService.viewModel.onNavigateHome();
        },

        hide: function () {
            //hide loading mask if user changed the tab as it is only relevant to location tab
            kendo.mobile.application.hideLoading();
        },

        viewModel: new LocationViewModel()
    };
})(window);