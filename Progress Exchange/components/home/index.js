'use strict';

app.home = kendo.observable({
    onShow: function () {},
    afterShow: function () {}
});


// START_CUSTOM_CODE_home

(function (parent) {
    var map,
        initView = function () {
            function initialize() {
                var mapProp = {
                    center: new google.maps.LatLng(51.508742, -0.120850),
                    zoom: 5,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById("map-canvas"), mapProp);
            }
            google.maps.event.addDomListener(window, 'load', initialize);
        }
    parent.set('initView', initView);
})(app.home);

// END_CUSTOM_CODE_home