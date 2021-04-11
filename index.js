Array.prototype.unique = function () {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        if (!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}

async function reverseGeoCode(lat, long) {
    return await (await fetch(`https://us1.locationiq.com/v1/reverse.php?key=bea4a9ec9a2ceb&lat=${lat}&lon=${long}&format=json`)).json();
}

async function getCoords() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
            L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
        });
    }
}

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var radlon1 = Math.PI * lon1 / 180
    var radlon2 = Math.PI * lon2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
}

var map = L.map('mapid').setView([19.075983, 72.877655], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

var opl = new L.OverPassLayer({
    endPoint: 'https://overpass-api.de/api/',
    'query': `(node["landuse"="farmland"]({{bbox}});way["landuse"="farmland"]({{bbox}});relation["landuse"="farmland"]({{bbox}}););out geom;`,
    onSuccess: function (data) {
        console.log(data);
        let elements = data.elements;

        let resp = [];

        elements.forEach(el => {
            if (typeof el.geometry !== "undefined") {
                let latlngs = el.geometry.map(el => [el.lat, el.lon]);
                var polygon = L.polygon(latlngs, { color: 'red' }).addTo(map);

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        let ll = el.geometry.map(el => [el.lat, el.lon]);
                        ll.forEach(async c => {
                            // console.log(c);
                            let dist = distance(c[0], c[1], position.coords.latitude, position.coords.longitude, "K");
                            if (dist < 5) {
                                setTimeout(async () => {
                                    let location = await reverseGeoCode(c[0], c[1]);
                                    if (typeof location.error === "undefined")
                                    resp.push(location);
                                }, 2000); 
                            }
                        })
                        // console.log("dist: ", dist);
                    });
                }
            }
        });

        console.log(resp);

        // areas = elements;
    },
});

map.addLayer(opl);
