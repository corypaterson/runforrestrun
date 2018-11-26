$(document).ready(function () {

    var hearthttp = new XMLHttpRequest();
    hearthttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var heartrates = XML(this);
            var ticks = getTicks(heartrates);

            //PLOT GRAPH

            var hrChart = document.getElementById("heartrateChart");

                var newChart = new Chart(hrChart, {
                    type: 'line',
                    data: {
                        labels: ticks,
                        datasets: [{
                            label: "heart rate",
                            data: heartrates,
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
    var heartpath = "Activities/activity_2011170049.gpx";
    hearthttp.open("GET", heartpath, true);
    hearthttp.send();
});

function XML(xml) {
    doc = xml.responseXML;
    var elvs = heartrates(doc);
    return elvs;
}

function heartrates(xmlDoc) {

    var heartrate = xmlDoc.getElementsByTagName("ns3:hr");
    var hrs = [];

    for (i = 0; i < heartrate.length; i++) {
        hrs.push(parseInt(heartrate[i].childNodes[0].nodeValue));
    }
    console.log(hrs.length);   
    return hrs;

}
function getTicks(heartRates){
    
    var labels = [];
    for(i=0; i < heartRates.length; i++){
        labels.push(i);
    }
    console.log(labels.length);
    return labels;
}
