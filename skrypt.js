require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand"
], function(Map, SceneView, FeatureLayer, GraphicsLayer, BasemapGallery, Expand) {

    const fl = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    });

    let graphLayer = new GraphicsLayer();

    const map1 = new Map ({
        basemap: "topo-vector",
        layers: [fl, graphLayer]
    });

    const view = new SceneView({
        map: map1,
        container: "mapDiv",
        zoom: 5,
        center: [-100, 34]
    });

    const basemapGalleryWg = new BasemapGallery({
        view: view
    });

    const expWg = new Expand({
        view: view,
        content: basemapGalleryWg
    });

    view.ui.add(expWg, {
        position: "top-right"
    });

    let query = fl.createQuery();
        query.where = "MAGNITUDE > 4";
        query.outFields = ['*'];
        query.returnGeometry = true;

        fl.queryFeatures(query)
        .then(response => {
            console.log(response);
            getResults(response.features)
        });

        function getResults(features){
            const symbol = {
                type: 'simple-marker',
                color: "black",
                size: 10
            };

            features.map(elem => {
                elem.symbol = symbol
            });

            graphLayer.addMany(features);
    };

    let simpleRender = {
        type: "simple",
        symbol: {
            type: 'point-3d',
            symbolLayers: [
                {
                    type: "object",
                    resource: {
                        primitive: "cylinder"
                    },
                    width: 5000
                }
            ]
        },
        visualVariables: [
            {
                type: "color",
                field: "MAGNITUDE",
                stops: [
                    {
                        value: 0.50,
                        color: "green"
                    },
                    
                    {
                        value: 4.48,
                        color: "red"
                    },
                ]
            },
            {
                type: "size",
                field: "DEPTH",
                stops: [
                    {
                        value: -3.39,
                        size: 1
                    },
                    
                    {
                        value: 30.97,
                        size: 100000
                    },
                ],
                axis: "height"
            },
            {
                type: "size",
                axis: "width-and-depth",
                useSymbolValue: true 
            }
        ]
    };

    fl.renderer = simpleRender;

})