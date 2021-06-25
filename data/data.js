const d3 = require("d3"),
      fs = require("fs");

var areas = [
  ["Blue Mountains", "sydney"],
  ["Blacktown", "sydney"],
  ["Bayside", "sydney"],
  ["Hornsby", "sydney"],
  ["Georges River", "sydney"],
  ["Hawkesbury", "sydney"],
  ["Cumberland", "sydney"],
  ["Burwood", "sydney"],
  ["Hunters Hill", "sydney"],
  ["Canterbury-Bankstown", "sydney"],
  ["Central Coast", "area"],
  ["Wollongong", "area"],
  ["Shellharbour", "area"],
  ["Penrith", "sydney"],
  ["Parramatta", "sydney"],
  ["Canada Bay", "sydney"],
  ["Ku-ring-gai", "sydney"],
  ["Sutherland Shire", "sydney"],
  ["Camden", "sydney"],
  ["The Hills Shire", "sydney"],
  ["Inner West", "sydney"],
  ["Lane Cove", "sydney"],
  ["Campbelltown", "sydney"],
  ["Randwick", "sydney"],
  ["Northern Beaches", "sydney"],
  ["Fairfield", "sydney"],
  ["Strathfield", "sydney"],
  ["Mosman", "sydney"],
  ["Liverpool", "sydney"],
  ["Woollahra", "sydney"],
  ["Willoughby", "sydney"],
  ["Wollondilly", "sydney"],
  ["Waverley", "sydney"],
  ["Ryde", "sydney"],
  ["Sydney", "sydney"],
  ["North Sydney", "sydney"]
];

var affected = [
  "Sydney", "Waverley", "Randwick", "Canada Bay", "Inner West", "Bayside", "Woollahra"
];

for (i = 0; i < areas.length; i++) {
  if (affected.includes(areas[i])) areas.splice(i, 1);
}

fs.readFile("lgaBoundaries.geojson", "utf8", function(error, data) {
  if (error) throw error;

  var geoData = JSON
    .parse(data)
    .features
    .filter(function(d) {
      return d.properties.STE_CODE16 == "1";
    })
    .map(function(d) {
      d.properties = {
        lga: d.properties.LGA_NAME20.replace(" (A)", "").replace(" (C)", "").replace(" (NSW)", "")
      };
      return d;
    });

  mapData = {
    type: "FeatureCollection",
    features: []
  };

  areas.forEach(function(d) {
    let match = geoData
      .filter(function(e) {
        return e.properties.lga == d[0];
      });
    match[0].properties.class = d[1];
    mapData.features.push(match[0]);
  });

  affected.forEach(function(d) {
    let match = geoData
      .filter(function(e) {
        return e.properties.lga == d;
      });
    match[0].properties.class = "affected";
    mapData.features.push(match[0]);
  });

  fs.writeFile("lgaData.geojson", JSON.stringify(mapData), function(error) {
    console.log("lgaData.geojson written");
  });
});
