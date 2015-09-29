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
        homeModel = kendo.observable({
            initView: function () {}
        });

    parent.set('homeModel', homeModel);
    
})(app.home);

// START_CUSTOM_CODE_homeModel
// END_CUSTOM_CODE_homeModel