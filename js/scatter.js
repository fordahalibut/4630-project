/** Class implementing the scatterplot */
class ScatterPlot{
    constructor(appState) {
        
        this.data = appState.monsterData;

        // Declare margins
        this.margin = {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
        };

        this.vizWidth = 600;
        this.vizHeight = 500;
    }

    /**TODO: 
            - split into initial draw and update functions
            - selectable axis - scales need to update
            - selectable categories for color
            - interaction with global filters
            - interaction with table - select row highlights graph result, brush on graph filters table
        */

    drawScatterplot(){

        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d=> d.challenge_rating)])
            .range([this.margin.left + this.margin.right, this.vizWidth]);

        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d=> d.hit_points)])
            .range([this.vizHeight, this.margin.top + this.margin.bottom]);
        
        let chartArea = d3.select('#scatter-area')
            .append('svg')
            .attr('width', this.vizWidth + this.margin.left + this.margin.right)
            .attr('height', this.vizHeight + this.margin.top + this.margin.bottom);

        chartArea.selectAll('circle')
            .data(this.data)
            .join('circle')
            .attr('cx', d=> this.xScale(d.challenge_rating))
            .attr('cy', d=> this.yScale(d.hit_points))
            .attr('r', 5);      

    }
}