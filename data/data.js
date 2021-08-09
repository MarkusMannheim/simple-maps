const d3 = require("d3"),
      fs = require("fs");

var areas = [
  // greater sydney
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
  "Lane Cove",
  "Liverpool",
  "Mosman",
  "North Sydney",
  "Northern Beaches",
  "Parramatta",
  "Penrith",
  "Randwick",
  "Ryde",
  "Shellharbour",
  "Strathfield",
  "Sutherland Shire",
  "Sydney",
  "The Hills Shire",
  "Waverley",
  "Willoughby",
  "Wollondilly",
  "Wollongong",
  "Woollahra",
  // nth qld
  "Cairns",
  "Yarrabah",
  // regional nsw
  "Armidale Regional",
  "Cessnock",
  "Coffs Harbour",
  "Dubbo Regional",
  "Dungog",
  "Lake Macquarie",
  "Maitland",
  "Mid-Western Regional",
  "Muswellbrook",
  "Newcastle",
  "Port Stephens",
  "Shoalhaven",
  "Singleton",
  "Wingecarribee"
];

fs.readFile("lga.geojson", "utf8", function(error, data) {
  if (error) throw error;

  var geoData = JSON
    .parse(data)
    .features
    .filter(function(d) {
      return d.properties.area > 0 &&
        (d.properties.state == "3" ||
        d.properties.state == "2" ||
        d.properties.state == "1");
    })
    .map(function(d) {
      let test = d.properties.name.indexOf(" (");
      d.properties = {
        class: "lga",
        state: d.properties.state,
        name: (
          test > -1 ?
          d.properties.name.slice(0, test) :
          d.properties.name
        )
      };
      return d;
    });

  mapData = {
    type: "FeatureCollection",
    features: []
  };

  // areas.forEach(function(d) {
  //   let match = geoData
  //     .filter(function(e) {
  //       return e.properties.name == d;
  //     });
  //   if (match.length !== 1) console.log(d, match);
  //   mapData.features.push({
  //     type: "Feature",
  //     geometry: match[0].geometry,
  //     properties: {
  //       class: "lga"
  //     }
  //   });
  // });

  geoData.forEach(function(d) {
    if (areas.includes(d.properties.name) || d.properties.state == "2") {
      mapData.features.push({
        type: "Feature",
        geometry: d.geometry,
        properties: {
          class: "lga"
        }
      });
    } else if (d.properties.state == "1" && !areas.includes(d.properties.name)) {
      console.log(d.properties);
    }
  });

  fs.writeFile("lga-covid.geojson", JSON.stringify(mapData), function(error) {
    console.log("lga-covid.geojson written");
  });

  boundaryAreas = [];

  console.log(d3.geoBounds({
    type: "FeatureCollection",
    features: geoData
      .filter(function(d) {
        return d.properties.name == "Cairns" ||
          d.properties.name == "Port Stephens" ||
          d.properties.state == "2";
      })
  }));
});
