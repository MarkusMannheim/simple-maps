const d3 = require("d3"),
      fs = require("fs");

var councils = [
  "Northern Beaches",
  "Bayside",
  "Blacktown",
  "Blue Mountains",
  "Burwood",
  "Camden",
  "Campbelltown",
  "Canada Bay",
  "Canterbury-Bankstown",
  "Central Coast",
  "Cumberland",
  "Fairfield",
  "Georges River",
  "Hawkesbury",
  "Hornsby",
  "Hunters Hill",
  "Inner West",
  "Ku-ring-gai",
  "Liverpool",
  "Lane Cove",
  "Mosman",
  "North Sydney",
  "Parramatta",
  "Penrith",
  "Randwick",
  "Ryde",
  "Strathfield",
  "Sutherland",
  "Sydney",
  "The Hills",
  "Waverley",
  "Willoughby",
  "Wollondilly",
  "Wollongong",
  "Woollahra"
];

fs.readFile("lga.geojson", "utf8", function(error, data) {
  if (error) throw error;

  var geoData = JSON
    .parse(data)
    .features
    .filter(function(d) {
      return d.properties.STE_CODE16 == "1";
    })
    .map(function(d) {
      d.properties = {
        lga: d.properties.LGA_NAME20.replace(" (A)", "").replace(" (C)", "")
      };
      return d;
    });

  nbData = {
    type: "FeatureCollection",
    features: []
  };
  lgaData = {
    type: "FeatureCollection",
    features: []
  };
  councils.forEach(function(council) {
    let matches = geoData
      .filter(function(d) {
        return (council == "Sydney" || council == "Liverpool") ?
        d.properties.lga == council :
        d.properties.lga.includes(council);
      });
    console.log("Searching", council, "...", matches.length, "matches\n"
              + matches.map(function(d) { return d.properties.lga; }));
    if (council == "Northern Beaches") {
      nbData.features.push(matches[0]);
    } else {
      lgaData.features.push(matches[0]);
    }
  });

  fs.writeFile("nbData.geojson", JSON.stringify(nbData), function(error) {
    console.log("nbData.geojson written");
  });
  fs.writeFile("lgaData.geojson", JSON.stringify(lgaData), function(error) {
    console.log("lgaData.geojson written");
  });
});
