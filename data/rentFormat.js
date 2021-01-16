const fs = require("fs"),
      d3 = require("d3");

fs.readFile("rent.geojson", "utf8", function(error, data) {
  if (error) throw error;
  rentData = JSON.parse(data)
    .features
    .map(function(d) {
      return {
        type: "Feature",
        geometry: d.geometry,
        properties: {
          centroid: d3.geoCentroid(d),
          area: d.properties.area,
          type: d.properties.type,
          changes: (d.properties.dec2020 && d.properties.dec2019) ? (d.properties.dec2020 / d.properties.dec2019 - 1) : null,
          prices: d.properties.dec2020
        }
      };
    });
  rentGeo = {
    type: "FeatureCollection",
    features: rentData
  };
  fs.writeFile("rentGeo.geojson", JSON.stringify(rentGeo), function(error) {
    console.log("rentGeo.geojson written");
  });
});
