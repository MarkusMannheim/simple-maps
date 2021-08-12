const d3 = require("d3"),
      fs = require("fs");

postcodes = [ "2581", "2582", "2584", "2611", "2618", "2619", "2620", "2621", "2623", "2626" ];

fs.readFile("postcodes.geojson", "utf8", function(error, data) {
  if (error) throw error;

  geoData = JSON
    .parse(data)
    .features
    .filter(function(d) {
      d.properties.class = "postcode";
      return d;
    });

  mapData = {
    type: "FeatureCollection",
    features: []
  };

  postcodes.forEach(function(d) {
    let match = geoData
      .filter(function(e) {
        return e.properties.code == d;
      });
    if (match.length !== 1) console.log(d, match);
    mapData.features.push(match[0]);
  });

  fs.writeFile("bubble.geojson", JSON.stringify(mapData), function(error) {
    console.log("bobble.geojson written");
  });
});
