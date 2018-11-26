$(document).ready(function () {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var elevations = getXML(this);
            var labels = getLabels(elevations);
            console.log(Number(elevations[1]).type);

            //PLOT GRAPH

            var ctx = document.getElementById("elevationChart");

                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: "elevations",
                            data: elevations,
                        }]  
                    },
                    options: {
                        elements: {
                            point:{
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
            
        }

    }
    var elpath = "Activities/activity_2011170049.gpx";
    xmlhttp.open("GET", elpath, true);
    xmlhttp.send(); 
});


function getXML(xml) {
    doc = xml.responseXML;
    var elvs = getElevations(doc);
    return elvs;
}

function getElevations(xmlDoc) {

    var elevations = xmlDoc.getElementsByTagName("ele");
    var elvs = [];

    for (i = 0; i < elevations.length; i++) {
        elvs.push(parseInt(elevations[i].childNodes[0].nodeValue));
    }
    console.log(elvs.length);   
    return elvs;

}
function getLabels(elevations){
    
    var labels = [];
    for(i=0; i < elevations.length; i++){
        labels.push(i);
    }
    console.log(labels.length);
    return labels;
}
