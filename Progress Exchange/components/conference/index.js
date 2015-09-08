'use strict';

app.conference = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_conference
// END_CUSTOM_CODE_conference
(function(parent) {
    var dataProvider = app.data.defaultProvider,
        processImage = function(img) {
            if (!img) {
                var empty1x1png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
                img = 'data:image/png;base64,' + empty1x1png;
            } else if (img.slice(0, 4) !== 'http' &&
                img.slice(0, 2) !== '//' &&
                img.slice(0, 5) !== 'data:') {
                var setup = dataProvider.setup;
                img = setup.scheme + ':' + setup.url + setup.apiKey + '/Files/' + img + '/Download';
            }

            return img;
        },
        flattenLocationProperties = function(dataItem) {
            var propName, propValue,
                isLocation = function(value) {
                    return propValue && typeof propValue === 'object' &&
                        propValue.longitude && propValue.latitude;
                };

            for (propName in dataItem) {
                if (dataItem.hasOwnProperty(propName)) {
                    propValue = dataItem[propName];
                    if (isLocation(propValue)) {
                        // Location type property
                        dataItem[propName] =
                            kendo.format('Latitude: {0}, Longitude: {1}',
                                propValue.latitude, propValue.longitude);
                    }
                }
            }
        },
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'Conference',
                dataProvider: dataProvider
            },
            group: {
                field: 'date'
            },

            change: function(e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    flattenLocationProperties(dataItem);
                }
            },
            schema: {
                model: {
                    fields: {
                        'name': {
                            field: 'name',
                            defaultValue: ''
                        },
                        'date': {
                            field: 'date',
                            defaultValue: ''
                        },
                    },
                    icon: function() {
                        var i = 'globe';
                        return kendo.format('km-icon km-{0}', i);
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        conferenceModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function(e) {
                app.mobileApp.navigate('#components/conference/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = conferenceModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                itemModel.photoUrl = processImage(itemModel.photo);
                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }
                conferenceModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    parent.set('conferenceModel', conferenceModel);
})(app.conference);

// START_CUSTOM_CODE_conferenceModel
// END_CUSTOM_CODE_conferenceModel