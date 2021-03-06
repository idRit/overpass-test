var map = L.map('mapid').setView([19.075983, 72.877655], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

var opl = new L.OverPassLayer({
    endPoint: 'https://overpass-api.de/api/',
    'query': `(node["landuse"="farmland"]({{bbox}});way["landuse"="farmland"]({{bbox}});relation["landuse"="farmland"]({{bbox}}););out body;`,
    onSuccess: function(data) {
        console.log(data);
    },
});

map.addLayer(opl);