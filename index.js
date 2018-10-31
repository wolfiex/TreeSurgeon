const globule = require("globule");
//cannot load d3 through require!!!
window.color = d3.scaleOrdinal(d3.schemeCategory20);

var files = globule.find(["./csv/*5.csv"]);
console.log(files);

var pause = 30;//seconds between changes
var ssize = 30;




var svg = d3.select("svg"),
  width = window.innerWidth,
  height = window.innerHeight,
  g = svg
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr(
      "transform",
      "translate(" + width / 2 + "," + height / 2 + ")rotate(-90)"
    );

svg.attr("transform", "matrix(1,0,0," + 0.95 + ",0,0)");
svg.append('rect')
  .attr("width", width)
  .attr("height", height)
  .attr('fill','#222')

//.style("background-color", "#222");
/*
d3
  .queue(2)
  .defer(d3.csv, f)
  .awaitAll(ready);
*/



var q  = d3.queue(files.length)

files.forEach(w=>q.defer(d3.csv,w));

q.awaitAll(multiple);
//////////
function multiple (err,w){
   window.w = w;
   window.allg = [];
   w.forEach(a=>a.forEach(b=>{allg.push(b.feature)}))
   allg=[...new Set(allg)];
   allg.forEach(e=>color(e));

   w.map((f,i)=>{setTimeout(function(){ ready(f,files[i]) }, i* pause * 1000);})



}
///////////

///////////
function ready(text,filename) {
  window.text = [];
  window.groups = [];
  window.annotations = [];
  window.edgeproperties = [];

d3.select('svg').selectAll('.legendSizeLine').remove()
d3.select('svg').selectAll('path').remove()
d3.select('svg').selectAll('circle').remove()
d3.select('svg').selectAll('.annotations').remove()

  window.t = text
  var start = 0;
  console.log("ready", filename);
  window.dict = {};
  text.forEach(d => {
    window.dict[d["node #"]] = { data: [] };
    window.groups.push(d.feature);
  });
  text.forEach(d => window.dict[d["node #"]].data.push(d));
  var nsample = parseFloat(text[0]["# of trees"]);
  var maxno;
  var depth = parseInt(d3.max(text.map(d => d["depth"]))) + 1;
  window.groups = new Set(window.groups);
  Object.keys(window.dict).forEach(w => {
    window.dict[w].data = sortmid(window.dict[w].data,true);
  });

legend();


  var id = 0;
  d3.range(0, depth).forEach(dh => {
    var values = Math.pow(2, dh);
    var x = width / (values + 1);
    var y =
      height *
      Math.pow(
        (height - height / (parseInt(depth) + 1) * (dh + 1)) / height,
        Math.E * 0.7
      );
    d3.range(0, values).forEach(e => {
      //console.log(id,dict[id],y)

      dict[id]["qy"] = y;
      dict[id]["qx"] = (1 + e) * x;
      dict[id]["fy"] = y;
      dict[id]["x"] = (1 + e) * x;
      dict[id]["depth"] = dh;
      dict[id]["r"] =
        d3.mean(dict[id].data.map(d => d["# samples (median)"])) /
        nsample *
        ssize;

      id += 1;
    });
  });

  ///////////
  dict = Object.keys(dict).map(q => dict[q]);

  window.simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3.forceLink().id(function(d) {
        return d.id;
      })
    )
    //.force("charge", d3.forceManyBody().strength(d=>d.r*-11))
    .force("posn", d3.forceX(d => d.qx).strength(2))
  //.force('collision', d3.forceCollide().radius(d=> 2*d.r))
  .force("center", d3.forceCenter(width / 2, height / 2));

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(dict)
    .enter()
    .append("circle")
    .attr("r", d => d.r);

  simulation.nodes(dict).on("tick", ticked);

  function ticked() {
    if (simulation.alpha() < 0.02) {
      console.log("stop");
      simulation.stop();

      drawlinks(depth);
      doarcs();
      //console.log('opreee',filename.split('.'))
      savepdf(filename);
    }
    node
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });
  }

  ///////////


}
