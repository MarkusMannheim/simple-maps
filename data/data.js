const d3 = require("d3"),
      fs = require("fs");

var areas = [
  // greater sydney
  ["Bayside", "1"],
  ["Blacktown", "1"],
  ["Blue Mountains", "1"],
  ["Burwood", "1"],
  ["Camden", "1"],
  ["Campbelltown", "1"],
  ["Canada Bay", "1"],
  ["Canterbury-Bankstown", "1"],
  ["Central Coast", "1"],
  ["Cumberland", "1"],
  ["Fairfield", "1"],
  ["Georges River", "1"],
  ["Hawkesbury", "1"],
  ["Hornsby", "1"],
  ["Hunters Hill", "1"],
  ["Inner West", "1"],
  ["Ku-ring-gai", "1"],
  ["Lane Cove", "1"],
  ["Liverpool", "1"],
  ["Mosman", "1"],
  ["North Sydney", "1"],
  ["Northern Beaches", "1"],
  ["Parramatta", "1"],
  ["Penrith", "1"],
  ["Randwick", "1"],
  ["Ryde", "1"],
  ["Shellharbour", "1"],
  ["Strathfield", "1"],
  ["Sutherland Shire", "1"],
  ["Sydney", "1"],
  ["The Hills Shire", "1"],
  ["Waverley", "1"],
  ["Willoughby", "1"],
  ["Wollondilly", "1"],
  ["Wollongong", "1"],
  ["Woollahra", "1"],
  // nth qld
  // ["Cairns", "3"],
  // ["Yarrabah", "3"],
  // regional nsw
  ["Armidale Regional", "1"],
  ["Ballina", "1"],
  ["Byron", "1"],
  ["Lismore", "1"],
  ["Richmond Valley", "1"],
  ["Cessnock", "1"],
  ["Coffs Harbour", "1"],
  ["Dubbo Regional", "1"],
  ["Dungog", "1"],
  ["Lake Macquarie", "1"],
  ["Maitland", "1"],
  ["Mid-Western Regional", "1"],
  ["Muswellbrook", "1"],
  ["Newcastle", "1"],
  ["Port Stephens", "1"],
  ["Shoalhaven", "1"],
  ["Singleton", "1"],
  ["Tamworth Regional", "1"],
  ["Wingecarribee", "1"],
  ["Bogan", "1"],
  ["Bourke", "1"],
  ["Brewarrina", "1"],
  ["Coonamble", "1"],
  ["Gilgandra", "1"],
  ["Narromine", "1"],
  ["Walgett", "1"],
  ["Warren", "1"],
  // greater melbourne
  ["Banyule", "2"],
  ["Bayside", "2"],
  ["Boroondara", "2"],
  ["Brimbank", "2"],
  ["Cardinia", "2"],
  ["Casey", "2"],
  ["Darebin", "2"],
  ["Frankston", "2"],
  ["Glen Eira", "2"],
  ["Greater Dandenong", "2"],
  ["Hobsons Bay", "2"],
  ["Hume", "2"],
  ["Kingston", "2"],
  ["Knox", "2"],
  ["Manningham", "2"],
  ["Maribyrnong", "2"],
  ["Maroondah", "2"],
  ["Melbourne", "2"],
  ["Melton", "2"],
  ["Monash", "2"],
  ["Moonee Valley", "2"],
  ["Moreland", "2"],
  ["Mornington Peninsula", "2"],
  ["Nillumbik", "2"],
  ["Port Phillip", "2"],
  ["Stonnington", "2"],
  ["Whitehorse", "2"],
  ["Whittlesea", "2"],
  ["Wyndham", "2"],
  ["Yarra", "2"],
  ["Yarra Ranges", "2"]
];

fs.readFile("lga.geojson", "utf8", function(error, data) {
  if (error) throw error;

  geoData = JSON
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

  areas.forEach(function(d) {
    let match = geoData
      .filter(function(e) {
        return e.properties.name == d[0] &&
          e.properties.state == d[1];
      });
    if (match.length !== 1) console.log(d, match);
    mapData.features.push({
      type: "Feature",
      geometry: match[0].geometry,
      properties: {
        class: "lga"
      }
    });
  });

  // geoData.forEach(function(d) {
  //   if (areas.includes(d.properties.name) || d.properties.state == "2") {
  //     mapData.features.push({
  //       type: "Feature",
  //       geometry: d.geometry,
  //       properties: {
  //         class: "lga"
  //       }
  //     });
  //   } else if (d.properties.state == "1" && !areas.includes(d.properties.name)) {
  //     console.log(d.properties);
  //   }
  // });

  fs.writeFile("lga-covid.geojson", JSON.stringify(mapData), function(error) {
    console.log("lga-covid.geojson written");
  });

  boundaryAreas = [];

  console.log(d3.geoBounds({
    type: "FeatureCollection",
    features: geoData
      .filter(function(d) {
        return d.properties.name == "Bourke" ||
          d.properties.name == "Mornington Peninsular" ||
          d.properties.name == "Port Stephens" ||
          d.properties.name == "Byron";
      })
  }));
});
