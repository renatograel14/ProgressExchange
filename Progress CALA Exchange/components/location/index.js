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
        positionDestiny: function () {
            return new google.maps.LatLng(-23.608895, -46.696253)
        },
        onNavigateHome: function () {
            var that = this;

            that._isLoading = true;
            that.toggleLoading();
            map.panTo(that.positionDestiny());
            that._putMarker(that.positionDestiny());

            that._isLoading = false;
            app.locationService.viewModel.getDirections();
            that.toggleLoading();

        },
        getDirections: function () {
            var that = this;

            var directionsService = new google.maps.DirectionsService();
            var start;
            var end = that.positionDestiny();
            var directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);


            navigator.geolocation.getCurrentPosition(
                function (position) {


                    start = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    var request = {
                        origin: start,
                        destination: end,
                        travelMode: google.maps.TravelMode.BICYCLING
                    };

                    directionsService.route(request, function (response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                        }
                    });
                },
                function (error) {
                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                        function () {}, "Location failed", 'OK');
                    return null;
                }, {
                    timeout: 30000,
                    enableHighAccuracy: true
                }
            );



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