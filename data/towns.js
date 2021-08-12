const d3 = require("d3"),
      fs = require("fs");

towns = [
  "Gunning",
  "Murrumbateman",
  "Yass",
  "Binalong",
  "Wallaroo",
  "Queanbeyan",
  "Googong",
  "Sutton",
  "Gundaroo",
  "Bungendore",
  "Captains Flat"
]

fs.readFile("ucl.geojson", "utf8", function(error, data) {
  if (error) throw error;

  geoData = JSON
    .parse(data)
    .features
    .map(function(d) {
      let test = d.properties.UCL_NAME16.indexOf(" (");
      if (test > -1) d.properties.UCL_NAME16 = d.properties.UCL_NAME16.slice(0, test);
      return d;
    });

  townData = [];

  towns.forEach(function(d) {
    let match = geoData
      .filter(function(e) {
        if (d == "Queanbeyan") {
          return e.properties.UCL_NAME16 == "Canberra - Queanbeyan";
        } else {
          return e.properties.UCL_NAME16 == d;
        }
      });
    if (match.length !== 1) console.log(d, match);
    townData.push({
      town: match[0].properties.UCL_NAME16,
      lng: d3.geoCentroid(match[0])[0],
      lat: d3.geoCentroid(match[0])[1]
    });
  });

  fs.writeFile("towns.csv", d3.csvFormat(townData), function(error) {
    console.log("towns.csv written");
  });
});
