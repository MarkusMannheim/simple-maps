const d3 = require("d3"),
      fs = require("fs");

var areas = [
  "Blue Mountains",
  "Blacktown",
  "Bayside",
  "Hornsby",
  "Georges River",
  "Hawkesbury",
  "Cumberland",
  "Burwood",
  "Hunters Hill",
  "Canterbury-Bankstown",
  "Central Coast",
  "Wollongong",
  "Shellharbour",
  "Penrith",
  "Parramatta",
  "Canada Bay",
  "Ku-ring-gai",
  "Sutherland Shire",
  "Camden",
  "The Hills Shire",
  "Inner West",
  "Lane Cove",
  "Campbelltown",
  "Randwick",
  "Northern Beaches",
  "Fairfield",
  "Strathfield",
  "Mosman",
  "Liverpool",
  "Woollahra",
  "Willoughby",
  "Wollondilly",
  "Waverley",
  "Ryde",
  "Sydney",
  "North Sydney"
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
        return e.properties.lga == d;
      });
    match[0].properties.class = "watch";
    mapData.features.push(match[0]);
  });

  affected.forEach(function(d) {
    let match = geoData
      .filter(function(e) {
        return e.properties.lga == d;
      });
    match[0].properties.class = "stay";
    mapData.features.push(match[0]);
  });

  fs.writeFile("lgaData.geojson", JSON.stringify(mapData), function(error) {
    console.log("lgaData.geojson written");
  });
});
