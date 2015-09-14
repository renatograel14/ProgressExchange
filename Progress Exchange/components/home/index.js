'use strict';

app.home = kendo.observable({
    onShow: function () {},
    afterShow: function () {}
});

// START_CUSTOM_CODE_home

(function (parent) {

})(app.home);

// END_CUSTOM_CODE_home
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
        },
        homeModel = kendo.observable({
            openLink: function (url) {
                window.open(url, '_system');
                if (window.event) {
                    window.event.preventDefault && window.event.preventDefault();
                    window.event.returnValue = false;
                }
                initView();
            }
        });

    parent.set('homeModel', homeModel);
})(app.home);

// START_CUSTOM_CODE_homeModel
// END_CUSTOM_CODE_homeModel