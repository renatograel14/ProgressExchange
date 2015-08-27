'use strict';

(function() {
    var provider = app.data.defaultProvider = new Everlive({
            offlineStorage: true,
            apiKey: '7RdaQT8Mej77w11z',
            url: '//platform.telerik.com/bs-api/v1/',
            scheme: 'https'
        });

    document.addEventListener('online', function() {
        app.data.defaultProvider.offline(false);
        app.data.defaultProvider.sync();
    });

    document.addEventListener('offline', function() {
        app.data.defaultProvider.offline(true);
    });

}());

// START_CUSTOM_CODE_defaultProvider
// END_CUSTOM_CODE_defaultProvider