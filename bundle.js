
//use js to laod required libraries here
function edgebundle(data) {
console.log(data)

  d3.select('svg').selectAll('.links').remove()
  var names = nodes.map(d => d.id);
  var node_data = nodes.map(function(d) {
    return {x:d.x, y:d.y};
  });

  links.forEach(
    function(d) {
      if (d.source.id != '')
      link_data.push({
        source: names.indexOf(d.source.id),
        target: names.indexOf(d.target.id),
        value:d.value
      });
    },
    link_data = []
  );

  //console.log(link_data,'fdf',node_data, names)

  var fbundling = ForceEdgeBundling()
  .step_size(1)
  .compatibility_threshold(.6)//0.3)
  .nodes(node_data)
  .edges(link_data);
  var results = fbundling();

  var d3line = d3
  .line()
  .x(function(d) {
    return d.x;
  })
  .y(function(d) {
    return d.y;
  })
  .curve(d3.curveLinear);
  //plot the data
  for (var i = 0; i < results.length; i++) {
    var svg = d3.select("svg");
    svg.style("width", width);
    svg.style("height", height);
    svg.style(      "transform",      "translate(" + window.innerWidth / 2 + "," + window.innerHeight / 2 + ")");


    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient = defs.append("linearGradient").attr("id", "lg" + i);

    var r = results[i];
    var end = r.length - 1;

    if (link_data[i].d < 0) {
      var start = end, end = 0;
    } else {
      var start = 0;
    }

    var x = r[start].x - r[end].x;
    var y = r[start].y - r[end].y;
    var max = d3.max([x, y]);

    linearGradient
    .attr("x1", "10%")
    .attr("y1", "10%")
    .attr("x2", x / max * 85 + "%")
    .attr("y2", y / max * 85 + "%");

    linearGradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", '#FF520D');

    //Set the color for the end (100%)
    linearGradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", '#FFAA0D');







    svg
    .append("g")
    .append("path")
    .attr("d", d3line(results[i]))
    .attr("id", "link" + i)
    .style("fill", "none")
    .attr("stroke-width",d=>parseFloat(link_data[i].value)/50)

  .style("stroke", "url(#lg" + i + ")")
    //.style('stroke',d=>'green')
    ///cscale(Math.sqrt((parseFloat(link_data[i].value)-range[0])/range[1])))

    .style('opacity',.8)
  }



}
