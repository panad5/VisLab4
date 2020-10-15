d3.csv("wealth-health-2014.csv", d3.autoType).then(data=>{
    console.log(data);

    let outerWidth = 700;
    let outerHeight = 500;

    let margin = {top:40, right:40, bottom: 40, left: 40}; //create margin between axis and outside of chart
    let width = outerWidth - margin.left - margin.right, height = outerHeight - margin.top - margin.bottom;
    let svg = d3.select('.chart').append('svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let extent = d3.extent(data, d=>d.Income);
    let incomeMax = d3.max(data, d=>d.Income);

    const xScale = d3.scaleLinear()
        .domain(extent)
        .range([0, width]);
    
    let lifeExtent = d3.extent(data, d=>d.LifeExpectancy);
    const yScale = d3.scaleLinear()
        .domain(lifeExtent)
        .range([height, 0]); //height goes first because the browser considers origin (0,0) to be upper left corner
    console.log(xScale(incomeMax));

    let popExtent = d3.extent(data, d=>d.Population);

    var colorRegion = d3.scaleOrdinal()
    .domain(["East Asia & Pacific", "South Asia", "America", "Sub-Saharan Africa", "Europe & Central Asia", "Middle East & North Africa"])
    .range(d3.schemeSet3);

    svg.selectAll('circles')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d=>xScale(d.Income))
    .attr('cy', d=>yScale(d.LifeExpectancy))
    .attr('r', d=>5+(d.Population*25)/popExtent[1])
    .attr('fill', function(d){return colorRegion(d.Region);}) //call on color scale to determine fill color
    .attr('opacity', .6) 
    .attr('stroke', "black")
    .on("mouseenter", function(d, i) {
var xPosition = 550+ parseFloat(d3.select(this).attr("cx"));
var yPosition = 150 + parseFloat(d3.select(this).attr("cy"));

d3.select(".tooltip")
  .style("left", xPosition + "px")
  .style("top", yPosition + "px")
  .html("Country: " + i.Country + "<br> Region: " + i.Region + "<br> Population: " + d3.format(",.4r")(i.Population) + "<br> Income: " + d3.format(",.3r")(i.Income) + "<br> Life Expectancy: " + i.LifeExpectancy)

d3.select(".tooltip").classed("show", false); //.classed() sets class value to true or false
})

  .on("mouseleave", function(){
    d3.select(".tooltip").classed("show", true);
});

    let xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(12, "s")
    
    let yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(12, "s")      

    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`)  

    svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis)

    svg.append("text")
        .attr("class", "xaxis")
		.attr('x', width-55)
		.attr('y', height - 10)
		// add attrs such as alignment-baseline and text-anchor as necessary
        .text("Income")
        
        svg.append("text")
        .attr("class", "yaxis")
		.attr('x', 15)
		.attr('y', -5)
		// add attrs such as alignment-baseline and text-anchor as necessary
        .text("Life Expectancy")

        var legend = svg.append("g")
	  .attr("class", "legend")
	  .attr("height", 100)
	  .attr("width", 100)
    .attr('transform', 'translate(-20,50)')    
      
    legend.selectAll('rect')
      .data(["East Asia & Pacific", "South Asia", "America", "Sub-Saharan Africa", "Europe & Central Asia", "Middle East & North Africa"])
      .enter()
      .append("rect")
	  .attr("x", width - 145)
      .attr("y", function(d, i){ return (i *  20) + 200;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .attr('fill', function(d){return colorRegion(d);}) 

      legend.selectAll('text')
      .data(["East Asia & Pacific", "South Asia", "America", "Sub-Saharan Africa", "Europe & Central Asia", "Middle East & North Africa"])
      .enter()
      .append("text")
	  .attr("x", width - 130)
      .attr("y", function(d, i){return (i *  20 + 9) + 200;})
      .attr("font-size", "12")
	  .text(function(d) {
        let text = d;
        return text;
});
});