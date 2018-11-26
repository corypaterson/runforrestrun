$(document).ready(function () {

    var map = drawMap();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var routeCoords = parseXML(this);
            L.marker(routeCoords[0]).addTo(map).bindPopup('Start').openPopup();
            var last = routeCoords.length;
            var lastc = last - 1;
            L.marker(routeCoords[lastc]).addTo(map).bindPopup('Finish').openPopup();
            var route = L.polyline(routeCoords, {color: 'red'}).addTo(map);
            map.fitBounds(route.getBounds());
            map.setView(routeCoords[0]);
        }
    };
    var path = "Activities/activity_2011170049.gpx";
    xhttp.open("GET", path , true);
    xhttp.send();

});

function parseXML(xml)
{
    var xmlDoc = xml.responseXML;
    coords = getRoute(xmlDoc);
    return coords;
}


function getRoute(xmlDoc)
{
    var points = xmlDoc.getElementsByTagName("trkpt");
    var coords = [];

    for (i = 0; i < points.length; i++)
    {
        coords.push([points[i].getAttribute("lat"), points[i].getAttribute("lon")]);
    }
    return coords;
}

function drawMap ()
{
    var mymap = L.map('mapid').setView([55.8718687, -4.2697705], 15)

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiY29yeXBhdGVyc29uIiwiYSI6ImNqb3NzM2ZmNDA5eXMzcHMzdXIwd3ZhN2sifQ.gISfRqB_iA-JlXlUkCP-Tg'
    }).addTo(mymap);

    return mymap;
}



