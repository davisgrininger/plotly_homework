function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then(function(sampleData) {
    console.log(sampleData);
    
    var PANEL = d3.select("#sample-metadata");
    
    PANEL.html("");
    
    Object.entries(sampleData).forEach(([key, value]) => {
      PANEL.append('h6').text(`${key}, ${value}`);
    })
    })
  }
  
  function buildCharts(sample) {
    

    d3.json(`/samples/${sample}`).then(function (sampleData) {
      console.log(sampleData);

      const otu_ids = sampleData.otu_ids;
      const otu_labels = sampleData.otu_labels;
      const sample_values = sampleData.sample_values;

      // Bubble chart
      var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'
        }
      }];      

      var bubbleLayout = {
        margin: { t: 0 },
        hovermode: 'closest',
        xaxis: {title: 'OTU ID'},
      };

      Plotly.plot('bubble', bubbleData, bubbleLayout);

      // Pie Chart
      var pieData = [{
        values: sample_values.slice(0,10),
        labels: otu_ids.slice(0,10),
        hovertext: otu_labels.slice(0,10,),
        hoverinfo: 'hovertext',
        type: 'pie'
      }];

      var pieLayout = {
        margin: {t: 0, l: 0}
      }

      Plotly.plot('pie', pieData, pieLayout);

      

    });
  }
  


function init() {
  var selector = d3.select("#selDataset");
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();