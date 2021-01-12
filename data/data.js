const d3 = require("d3"),
      fs = require("fs");

var councils = [
  "Northern Beaches",
  "Blacktown",
  "Burwood",
  "Canada Bay",
  "Canterbury-Bankstown",
  "Cumberland",
  "Fairfield",
  "Inner West",
  "Liverpool",
  "Parramatta",
  "Strathfield"  
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
    lgaData.features.push(matches[0]);
  });

  fs.writeFile("lgaData.geojson", JSON.stringify(lgaData), function(error) {
    console.log("lgaData.geojson written");
  });
});
