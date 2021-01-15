const fs = require("fs"),
      d3 = require("d3");
fs.readFile("rentData.csv", "utf8", function(error, data) {
  if (error) throw error;
  rentData = d3.csvParse(data)
    .map(function(d) {
      return {
        // type: (),
        area: d[Object.keys(d)[2]].slice(0, d[Object.keys(d)[2]].indexOf("(") - 1),
        type: (d[Object.keys(d)[2]].includes("Houses") ?  "houses" : "units"),
        dec2020: +d["2020"],
        dec2019: +d["2019"]
      };
    });
  fs.readFile("sa2s.geojson", "utf8", function(error, data) {
    if (error) throw error;
    geoData = JSON.parse(data)
      .features
      .filter(function(d) {
        return d.properties.STE_CODE16 == "8";
      })
      .map(function(d) {
        d.properties = {
          area: d.properties.SA2_NAME16
        };
        return d;
      });
    finalData = {
      type: "FeatureCollection",
      features: []
    };
    rentData.forEach(function(d) {
      let matches = geoData.filter(function(e) { return e.properties.area.includes(d.area); });
      if (matches.length == 1) {
        finalData.features.push({
          type: "Feature",
          geometry: matches[0].geometry,
          properties: d
        });
      } else {
        finalData.features.push({
          type: "Feature",
          geometry: (matches.filter(function(e) { return d.area == e.properties.area; }))[0].geometry,
          properties: d
        });
      }
    });
    fs.writeFile("rent.geojson", JSON.stringify(finalData), function(error) {
      console.log("rent.geojson written");
      bounds = d3.geoBounds(finalData);
      bounds[0][0] = bounds[0][0] - (bounds[1][0] - bounds[0][0]);
      bounds[1][0] = bounds[1][0] + (bounds[1][0] - bounds[0][0]);
      bounds[0][1] = bounds[0][1] - (bounds[1][1] - bounds[0][1]);
      bounds[1][1] = bounds[1][1] + (bounds[1][1] - bounds[0][1]);
      fs.readFile("states.geojson", "utf8", function(error, data) {
        if (error) throw error;
        border = JSON.parse(data)
        .features
        .filter(function(d) {
          return d.properties.STE_CODE16 == "8";
        })
        .map(function(d) {
          d.properties = {
            class: "border"
          };
          return d;
        });
        border = {
          type: "FeatureCollection",
          features: border
        };
        fs.writeFile("border.geojson", JSON.stringify(border), function(error) {
          console.log("border.geojson written");
          fs.readFile("actMesh.geojson", "utf8", function(error, data) {
            if (error) throw error;
            actWater = JSON.parse(data)
            .features
            .filter(function(d) {
              return d.properties.MB_CAT16 == "Water";
            })
            .map(function(d) {
              d.properties = {
                class: "water"
              };
              return d;
            });
            actWater = {
              type: "FeatureCollection",
              features: actWater
            };
            fs.writeFile("actWater.geojson", JSON.stringify(actWater), function(error) {
              console.log("actWater.geojson written");
              fs.readFile("nswMesh.geojson", "utf8", function(error, data) {
                if (error) throw error;
                nswWater = JSON.parse(data)
                .features
                .filter(function(d) {
                  let near = false;
                  let centroid = d3.geoCentroid(d);
                  if ((centroid[0] > bounds[0][0]) && (centroid[0] < bounds[1][0]) && (centroid[1] < bounds[1][1]) && (centroid[1] < bounds[1][1])) near = true;
                  return d.properties.MB_CAT16 == "Water" && near;
                })
                .map(function(d) {
                  d.properties = {
                    class: "water"
                  };
                  return d;
                });
                nswWater = {
                  type: "FeatureCollection",
                  features: nswWater
                };
                fs.writeFile("nswWater.geojson", JSON.stringify(nswWater), function(error) {
                  console.log("nswWater.geojson written");
                });
              });
            });
          });
        });
      });
    });
  });
});
