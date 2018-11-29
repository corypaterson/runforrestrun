$(document).ready(function () {

    var map = drawMap();

    $("#fileinput").change(function () {
        $.ajax({
            type: "GET",
            url: "Activities/" + $('input[type=file]').val().split('\\').pop(),
            dataType: "xml",
            success: function (xml) {

                console.log(xml);

                $(xml).find('trk').each(function () {
                    console.log("Finding name and type...");
                    var name = $(this).find('name').text();
                    var type = $(this).find('type').text();
                    $('#filename').text(name + " - " + type);
                });

                //distance Stats]
                var maxHR = 0;
                var minHR = 0;
                var minElv = 0;
                var maxElv = 0;
                var meanElv = 0;
                var lats = [];
                var lons = [];
                var heartrates = [];
                var elevations = [];
                console.log("Aquiring Stats...");

                //Aquires the appropriate stats from each trkpt
                $(xml).find('trkpt').each(function () {
                    lats.push($(this).attr('lat'));
                    lons.push($(this).attr('lon'));


                    var hr = $(this).find('ns3\\:hr').text();
                    heartrates.push(parseInt(hr));

                    var elv = $(this).find('ele').text();
                    elevations.push(parseInt(elv));

                    //calculates maxHR
                    if (parseInt(hr) > maxHR) {
                        maxHR = parseInt(hr);
                    }

                    //calculates minHR
                    if ((parseInt(hr) < minHR) || minHR == 0) {
                        minHR = parseInt(hr);
                    }

                    //calculates minElv
                    if ((parseInt(elv) < minElv) || minElv == 0) {
                        minElv = parseInt(elv);
                    }
                    //calculates maxElv
                    if (parseInt(elv) > maxElv) {
                        maxElv = parseInt(elv);
                    }
                });


                //Pair coordinates
                var routeCoords = []
                for (i = 0; i < lats.length; i++) {
                    routeCoords.push([lats[i], lons[i]]);
                }

                //get mean HR
                //get labels for graphs
                var labels = [];
                var totalHR = 0;
                var meanHR = 0;
                for (i = 0; i < heartrates.length; i++) {
                    totalHR = totalHR + parseInt(heartrates[i]);
                    labels.push("track point: " + i);
                }

                var meanElv = 0;
                var totalElv = 0;
                for (i = 0; i < elevations.length; i++) {
                    totalElv = totalElv + parseInt(elevations[i]);
                }

                console.log(elevations);

                meanHR = totalHR / heartrates.length;
                meanElv = totalElv / elevations.length;


                L.marker(routeCoords[0]).addTo(map).bindPopup('Start').openPopup();
                var last = routeCoords.length;
                var lastc = last - 1;
                L.marker(routeCoords[lastc]).addTo(map).bindPopup('Finish').openPopup();
                var route = L.polyline(routeCoords, { color: 'red' }).addTo(map);
                map.fitBounds(route.getBounds());
                map.setView(routeCoords[0]);

                document.getElementById("heartrateChart").remove();
                document.getElementById("elevationChart").remove();

                document.getElementById("heartrate-div").innerHTML = '<canvas id="heartrateChart" width="400" height="200"></canvas>';
                document.getElementById("elevation-div").innerHTML = '<canvas id="elevationChart" width="400" height="200"></canvas>';
                heartRates(heartrates, minHR, maxHR, meanHR, labels);
                plotElevations(elevations, minElv, maxElv, meanElv, labels);

                $("#data").show();
                $("#info").hide();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("Error: Incorrect File type");
            },
        });
    });
});

function parseXML(xml) {
    var xmlDoc = xml.responseXML;
    coords = getRoute(xmlDoc);
    return coords;
}

function plotElevations(elvs, min, max, mean, labels) {
    //PLOT GRAPH
    console.log(elvs);
    console.log(labels.length);

    var chart = document.getElementById("elevationChart");

    var eleChart = new Chart(chart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "elevations",
                data: elvs,
            },
            ]
        },
        options: {
            elements: {
                point: {
                    radius: 0
                }
            },
            scales: {
                xAxes: [{
                    display: false //this will remove only the label
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Route Elevation'
                    }
                }]
            }

        }
    });
    //END GRAPH
    document.getElementById("lowestElv").innerHTML = min;
    document.getElementById("highestElv").innerHTML = max;
    document.getElementById("meanElv").innerHTML = mean;
}

function heartRates(rates, min, max, mean, labels) {
    //PLOT GRAPH

    var hrChart = document.getElementById("heartrateChart");
    
    var hrPlot = new Chart(hrChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "heart rate",
                data: rates,
                fill: false,
                borderColor: "#5ebebc",
                borderWidth: 1,
            }],
        },
        options: {
            elements: {
                point: {
                    radius: 0
                }
            },
            scales: {
                xAxes: [{
                    display: false //this will remove only the label
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Heart Rates'
                    }
                }]
            }

        }
    });
    //END GRAPH

    document.getElementById("lowestHR").innerHTML = min;
    document.getElementById("highestHR").innerHTML = max;
    document.getElementById("meanHR").innerHTML = mean;
}


function getRoute(xmlDoc) {

    var points = xmlDoc.getElementsByTagName("trkpt");
    var coords = [];

    for (i = 0; i < points.length; i++) {
        coords.push([points[i].getAttribute("lat"), points[i].getAttribute("lon")]);
    }
    return coords;
}

function drawMap() {
    var mymap = L.map('mapid').setView([55.8718687, -4.2697705], 15)

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiY29yeXBhdGVyc29uIiwiYSI6ImNqb3NzM2ZmNDA5eXMzcHMzdXIwd3ZhN2sifQ.gISfRqB_iA-JlXlUkCP-Tg'
    }).addTo(mymap);

    return mymap;
}