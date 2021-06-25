const d3 = require("d3"),
      fs = require("fs");

var areas = [
  ["Blue Mountains", "stay"],
  ["Blacktown", "stay"],
  ["Bayside", "stay"],
  ["Hornsby", "stay"],
  ["Georges River", "stay"],
  ["Hawkesbury", "watch"],
  ["Cumberland", "stay"],
  ["Burwood", "stay"],
  ["Hunters Hill", "stay"],
  ["Canterbury-Bankstown", "stay"],
  ["Central Coast", "watch"],
  ["Wollongong", "watch"],
  ["Shellharbour", "watch"],
  ["Penrith", "stay"],
  ["Parramatta", "stay"],
  ["Canada Bay", "stay"],
  ["Ku-ring-gai", "stay"],
  ["Sutherland Shire", "stay"],
  ["Camden", "stay"],
  ["The Hills Shire", "stay"],
  ["Inner West", "stay"],
  ["Lane Cove", "stay"],
  ["Campbelltown", "stay"],
  ["Randwick", "stay"],
  ["Northern Beaches", "stay"],
  ["Fairfield", "stay"],
  ["Strathfield", "stay"],
  ["Mosman", "stay"],
  ["Liverpool", "stay"],
  ["Woollahra", "stay"],
  ["Willoughby", "stay"],
  ["Wollondilly", "watch"],
  ["Waverley", "stay"],
  ["Ryde", "stay"],
  ["Sydney", "stay"],
  ["North Sydney", "stay"]
];

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

  fs.writeFile("lgaData.geojson", JSON.stringify(mapData), function(error) {
    console.log("lgaData.geojson written");
  });
});
