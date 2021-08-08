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
  "North Sydney",
  "Newcastle",
  "Cessnock",
  "Dungog",
  "Lake Macquarie",
  "Maitland",
  "Muswellbrook",
  "Port Stephens",
  "Singleton",
  "Cairns",
  "Yarrabah"
];

fs.readFile("lga.geojson", "utf8", function(error, data) {
  if (error) throw error;

  var geoData = JSON
    .parse(data)
    .features
    .filter(function(d) {
      return d.properties.AREASQKM20 > 0 &&
        (d.properties.STE_CODE16 == "3" ||
        d.properties.STE_CODE16 == "1");
    })
    .map(function(d) {
      let test = d.properties.LGA_NAME20.indexOf(" (");
      d.properties = {
        class: "lga",
        name: (
          test > -1 ?
          d.properties.LGA_NAME20.slice(0, test) :
          d.properties.LGA_NAME20
        )
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
        return e.properties.name == d;
      });
    if (match.length !== 1) console.log(d, match);
    mapData.features.push(match[0]);
  });

  fs.writeFile("lga-covid.geojson", JSON.stringify(mapData), function(error) {
    console.log("lga-covid.geojson written");
  });

  boundaryAreas = ["Cairns", "Dungog", "Shoalhaven"];

  console.log(d3.geoBounds({
    type: "FeatureCollection",
    features: geoData
      .filter(function(d) {
        return boundaryAreas.includes(d.properties.name);
      })
  }));
});
