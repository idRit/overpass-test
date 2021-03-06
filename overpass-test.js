const query_overpass = require("query-overpass");

query_overpass(
    `node(57.7,11.9,57.8,12.0)[amenity=bar];out;`,
    (err, data) => {
        if (err) console.log("err: ", err);
        else {
            console.log("data", data);
        }
    }
);