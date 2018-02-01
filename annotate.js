function annotate() {

  window.maxsamples = parseFloat(d3.max(nodes.map(d=>d.samples)))
svg = d3.select('svg')

svg.selectAll('.links').remove()
//svg.selectAll('.nodes').remove()
svg.style('background-color','#222')

  annotations = links.map((d,i) => {
    var ann ={
      type: d3.annotationCalloutCircle,
      note: {
        label: "",
        title: "",
        wrap: 190
      },
      //settings for the subject, in this case the circle radius
      subject: {
        radius: d3.select("#n" + d.source.id).attr("r"),

      },

      connector: {},
      id: 'an'+i,
      x: d3.select("#n" + d.source.id).attr("cx"),
      y: d3.select("#n" + d.source.id).attr("cy"),
      dx:
        d3.select("#n" + d.target.id).attr("cx") -
        d3.select("#n" + d.source.id).attr("cx"),
      dy:
        d3.select("#n" + d.target.id).attr("cy") -
        d3.select("#n" + d.source.id).attr("cy"),
      color:color(d.source.type)

       //"#E8336D"
    };


    makeAnnotations = d3
      .annotation()
      .type(d3.annotationLabel)
      .annotations([ann]);

    makeAnnotations(
      d3
        .select("svg")
        .append("g")
        .attr('id','an'+i)
        .attr('stroke-width',Math.sqrt(parseFloat(nds.get(d.source.id).samples)-parseFloat(nds.get(d.target.id).samples)))
        .attr('opacity',parseFloat(0.3+ 2*Math.sqrt((nds.get(d.target.id).samples / maxsamples))/3 ))
        .on("dblclick", function() {
          makeAnnotations.editMode(!makeAnnotations.editMode()).update();
        })
    )


  });



  legend()


  //.map(function(d){ d.color = "#E8336D"; return d})
/*
  makeAnnotations = d3
    .annotation()
    .type(d3.annotationLabel)
    .annotations(annotations);

  makeAnnotations(
    d3
      .select("svg")
      .append("g")
      .attr('id','agr')
      .on("dblclick", function() {
        makeAnnotations.editMode(!makeAnnotations.editMode()).update();
      })
  )
*/
}


function legend()
{

var ordinal = d3.scaleOrdinal()
.domain(Object.keys(groups))
.range(Object.keys(groups).map(d=>color(d)))

    var svg = d3.select("svg");

    document.getElementById('svg').innerHTML =
    '<defs> <style type="text/css">@import url(https://fonts.googleapis.com/css?family=Open+Sans);tspan,text{ font: 1.0em Open Sans, sans-serif;}</style></defs>'
    + document.getElementById('svg').innerHTML

    svg.append("g")

  .attr("class", "legendOrdinal")
      .attr("transform",
      "translate("+(width-200) + ","+(height-200)+")")
      .style('fill','white')


    window.lg = d3.legendColor()

    //.useClass(true)
      //.attr('fill')
      .title("Random Forrest")
      .titleWidth(200)
      .scale(ordinal)
      .cellFilter(function(d){ return d.label !== "mse" })


    svg.select(".legendOrdinal")
      .call(lg);
}
