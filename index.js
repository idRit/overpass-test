var map = L.map('mapid').setView([19.075983, 72.877655], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

var opl = new L.OverPassLayer({
    endPoint: 'https://overpass-api.de/api/',
    'query': `(node["landuse"="farmland"]({{bbox}});way["landuse"="farmland"]({{bbox}});relation["landuse"="farmland"]({{bbox}}););out geom;`,
    onSuccess: function (data) {
        console.log(data);
        let elements = data.elements;

        elements.forEach(el => {
            // console.log(el);
            if (typeof el.geometry !== "undefined") {
                let latlngs = el.geometry.map(el => [el.lat, el.lon]);
                var polygon = L.polygon(latlngs, { color: 'red' }).addTo(map);
            }
        });

        // create a red polygon from an array of LatLng points
        // var latlngs = [[37, -109.05], [41, -109.03], [41, -102.05], [37, -102.04]];
        // var polygon = L.polygon(latlngs, { color: 'red' }).addTo(map);
        // zoom the map to the polygon
        // map.fitBounds(polygon.getBounds());
    },
});

map.addLayer(opl);