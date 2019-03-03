function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([k,v]) => {
      var item = panel.append("p");
      item.text(`${k}: ${v}`);
    })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(d) {
    // Variable definition for both charts
    var x = d.otu_ids;
    var y = d.sample_values;
    var markerSize = d.sample_values;
    var markerColor = d.otu_ids;
    var text = d.otu_labels;
    console.log(x)

    // @TODO: Build a Bubble Chart using the sample data
    var bub_trace = [{
      x: x,
      y: y,
      mode: 'markers',
      marker: {
        size: markerSize,
        color: markerColor
      },
      text: text
    }];

    var layout = {
      xaxis: {title: "OTU ID"},
      title: "Bacteria Analysis" 
  };

  Plotly.newPlot('bubble', bub_trace, layout);  


    // @TODO: Build a Pie Chart
    var pie_trace = [{
      values: y.slice(0,10),
      labels: x.slice(0,10),
      text: text.slice(0,10),
      type: "pie"
    }];


   var layout = {
    height: 600,
    width: 800,
    title: "Top 10 samples"
  };

  Plotly.newPlot('pie',pie_trace, layout)
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
