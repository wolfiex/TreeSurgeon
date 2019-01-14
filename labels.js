function sortmid(arr,middle=true) {
  arr.sort(function(a, b) {
    return a["%"] - b["%"];
  });
  if (middle){
  var right = arr.slice(arr.length / 2, arr.length).reverse();
  var left = arr.slice(0, arr.length / 2);
  arr = left.concat(right);
}
  return arr;
}

function doarcs() {
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

  dict.forEach(q => {
    svg
      .append("circle")
      .attr("r", d => q.r)
      .attr("cx", function(d) {
        return q.x;
      })
      .attr("cy", function(d) {
        return q.y;
      })
      .attr("fill", "#222");

    var counter = 0;

    q.data.forEach(s => {
      var arc = d3
        .arc()
        .innerRadius(q.r * 0.8)
        .outerRadius(q.r)
        .startAngle(Math.PI * 2 * counter)
        .endAngle(Math.PI * 2 * (counter + s["%"] / 100))
        .cornerRadius(15)
        .padAngle(Math.PI * 0.03);

      counter += s["%"] / 100;
      svg
        .append("path")
        .style("fill", window.groupcolours[s.feature])
        .attr("d", arc)
        .attr("transform", "translate(" + q.x + "," + q.fy + ")")
        .on("mouseover", function() {
          tooltip.text(s['feature']+'\n%:'+s['%']+'\nmean:'+s['mean']+'\nstd:'+s['std']);
          return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function() {
          return tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function() {
          return tooltip.style("visibility", "hidden");
        });

      //console.log(s['%'],'translate('+q.qx+','+q.fy+')')
    });
  });
}

function drawlinks(depth) {
  id = 0;
  var id2 = 0;
  d3.range(0, depth - 2).forEach(dh => {
    var values = Math.pow(2, dh);

    d3.range(0, values).forEach(e => {
      //try{

      [0, 1].forEach(c => {
        id2 += 1;
        var multiplier = .6
        var count = 0 //-dict[id]["r"]*multiplier* 0.4;
        var shift =(-dict[id]["r"]*multiplier/2 )//- (dict[id].data.length*4.)/2;
        //console.log(shift)
        dict[id2].data.forEach((q,i) => {

          var wd = dict[id]["r"]*multiplier*(parseFloat(q["%"]) / 100.);
          //console.log((parseFloat(q["%"]) / 100.))

          var w = wd/2+ count;
          count += wd
          //if (i===0){wd=dict[id]["r"]*.7 * 0.8}
          window.edgeproperties.push({ width: wd,depth:q.depth, w: w,shift:shift,b:c, name: q["feature"] , feature: q["feature"],to:id2, split: q['median']});
          window.annotations.push({
            note: {
              label: "",
              title: ""
            },
            ny: dict[id2]["y"],
            nx: dict[id2]["x"],
            x: dict[id]["x"],
            y: dict[id]["y"],
            color: window.groupcolours[q["feature"]],
            type: d3.annotationCustomType(d3.annotationCallout, {//Elbow
              className: "custom",
              connector: { type: "elbow" },
              note: { lineType: "vertical" }
            }),
            subject: {
              radius: 2 + dict[id]["r"],
              radiusPadding: -dict[id]["r"]
            }
          });
        });
      });
      //}catch(err){console.log(err)}
      id += 1;
    });
  });


/////
/// trunk
///
id = 0
var count = -dict[id]["r"] *2* 0.4;
dict[id].data.forEach(q => {
  var wd = dict[id]["r"]* 2* 0.4 * (parseFloat(q["%"]) / 100);
  var w = wd + count;

  window.edgeproperties.push({ width: wd,shift:0,depth:0, w: 0,b:0, name: q["feature"] });
  window.annotations.push({
    note: {
      label: "",
      title: ""
    },
    ny: dict[id]["y"]+2*dict[id]["r"],
    nx: dict[id]["x"],
    x: dict[id]["x"],
    y: dict[id]["y"],
    color: window.groupcolours[q["feature"]],
    type: d3.annotationCustomType(d3.annotationCalloutElbow, {
      className: "custom",
      connector: { type: "line" },
      note: {'align':'middle' }
    }),
    subject: {
      radius: 2 + dict[id]["r"],
      radiusPadding: -dict[id]["r"]
    }
  });

})












////
  window.makeAnnotations = d3.annotation().annotations(window.annotations);
  //.accessors({ x: d => d.x , y: d => d.y,nx:d => d.nx,ny:d=>d.ny})

  svg
    .append("g")
    .attr("class", "annotation-encircle")
    .call(makeAnnotations);

  [...document.querySelectorAll(".connector")].forEach((l, i) => {
    var dt = window.edgeproperties[i];
    l.style["stroke-width"] = dt.width;
    //console.log(dt)
    l.setAttribute("transform", "translate(" +
    (dt.w+dt.shift) +
     ","+
     (Math.pow(-1,dt.b)*-.45*(
       (dt.w+dt.shift)*Math.tan(Math.PI/4.)
     ))+")");//dt.wh as y to make them overlay
    l.setAttribute("stroke-linecap", "round");
    l.setAttribute("opacity", 1-0.05*dt.depth);
    l.setAttribute("class", "annotation-connector " + dt.name);
    //l.style["mix-blend-mode"]= "difference";
  });
}



/////////
function legend(){

  //var lineSize = d3.scaleLinear().domain([0,10]).range([2, 10]);

var svg = d3.select("svg");

svg.append("g")
  .attr("class", "legendSizeLine");


var g = [...window.groups]
console.log(g.map(d=>d.replace(/[_-]/g,' ')));
var legendSizeLine = d3.legendSize()
      //.scale(lineSize)
      .shape("line")
      .orient("horizontal")

      .labels(g.map(d=>d.replace(/[_-]/g,' ')))
      .labelWrap(Math.floor(width/(g.length*2)))
      .shapeWidth(width/(g.length+1))
      .labelAlign("middle")
      //.style('color','red')
      .shapePadding(10);

svg.select(".legendSizeLine")
  .call(legendSizeLine)
    //.attr("transform", "translate("+(height-(svg.select(".legendSizeLine").node().getBBox().height))+", 20)");
;


  [...document.getElementsByClassName("cell")].forEach((d,i)=>{
  //console.log(d,newh);
  if (g[i]===undefined){d.remove()}
  d.setAttribute('fill',window.groupcolours[g[i]])
}
)


var newh = svg.select(".legendSizeLine").node().getBBox();
svg.select(".legendSizeLine")
.attr("transform", "translate("+(width-newh.width)/2+","+(height - 5*newh.height)+")");


}



function savepdf(filename){

  var fs = require('fs'),
    PDFDocument = require('pdfkit'),
    SVGtoPDF = require('svg-to-pdfkit');
var file1 = './pdfs/'+filename.split('/')[2].split('.')[0]+'.pdf';
console.log('dsadsa',file1,filename);
var doc = new PDFDocument(),
    stream = fs.createWriteStream(file1),


    svg= document.getElementById('svg').innerHTML

    SVGtoPDF(doc, '<svg xmlns="https://www.w3.org/TR/2016/CR-SVG2-20160915/" xmlns:xlink="https://www.w3.org/TR/xlink11/" >'+ svg+'</svg>',0,0)
    stream.on('finish', function() {
  console.log(fs.readFileSync(file1))
});

doc.pipe(stream);
doc.end();

console.log('savedindocs')

}



function savepdf() {

  var fs = require('fs'),
      PDFDocument = require('pdfkit'),
      SVGtoPDF = require('svg-to-pdfkit');

  var doc = new PDFDocument(),
      stream = fs.createWriteStream('./pdfs/'+filename+'.pdf'),
      svg = document.getElementById('svg').innerHTML;

  PDFDocument.prototype.addSVG = function (svg, x, y, options) {
    return SVGtoPDF(this, svg, 0, 0, {width:width,height:height,precision:5,preserveAspectRatio:'1:1'}), this;
  };
  doc.addSVG('<svg xmlns="https://www.w3.org/TR/2016/CR-SVG2-20160915/" xmlns:xlink="https://www.w3.org/TR/xlink11/" >' + svg + '</svg>', 0, 0);

  //VGtoPDF(doc, '<svg xmlns="https://www.w3.org/TR/2016/CR-SVG2-20160915/" xmlns:xlink="https://www.w3.org/TR/xlink11/" >'+ svg+'</svg>',0,0)
  stream.on('finish', function () {
    console.log(fs.readFileSync('./pdfs/'+filename+'.pdf'));

    console.log('savedindocs');


//////

window.bg.attr('fill','none');
d3.selectAll('circle').attr('fill','whitesmoke')

        var doc = new PDFDocument(),
            stream = fs.createWriteStream('./pdfs/'+filename+'_white.pdf'),
            svg = document.getElementById('svg').innerHTML;

        PDFDocument.prototype.addSVG = function (svg, x, y, options) {
          return SVGtoPDF(this, svg, 0, 0, {width:width,height:height,precision:5,preserveAspectRatio:'1:1'}), this;
        };
        doc.addSVG('<svg xmlns="https://www.w3.org/TR/2016/CR-SVG2-20160915/" xmlns:xlink="https://www.w3.org/TR/xlink11/" >' + svg + '</svg>', 0, 0);

        //VGtoPDF(doc, '<svg xmlns="https://www.w3.org/TR/2016/CR-SVG2-20160915/" xmlns:xlink="https://www.w3.org/TR/xlink11/" >'+ svg+'</svg>',0,0)
        stream.on('finish', function () {
          console.log(fs.readFileSync('./pdfs/'+filename+'_white.pdf'));

          console.log('savedindocs');

          var remote = require('electron').remote
          remote.getCurrentWindow().close();
        });

        doc.pipe(stream);
        doc.end();




//////


    //remote.getCurrentWindow().close();
  });

  doc.pipe(stream);
  doc.end();

  console.log('endfile');
}
