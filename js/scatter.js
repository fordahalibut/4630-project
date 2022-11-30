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

        this.numericIndicators = [{
            indicator: "hit_points",
            label: "HP"
        },
        {
            indicator: "armor_class",
            label: "Armor Class"
        },
        {
            indicator: "challenge_rating",
            label: "Challenge Rating"
        },    {
            indicator: "xp",
            label: "XP Value"
        }];

        this.categoryIndicators = [{
            indicator: "type",
            label: "Type"
        },
        {
            indicator: "alignment",
            label: "Alignment"
        },
        {
            indicator: "size",
            label: "Size"
        }];
    }

    /**TODO: 
            - split into initial draw and update functions
            - selectable axis - scales need to update
            - selectable categories for color
            - interaction with global filters
            - interaction with table - select row highlights graph result, brush on graph filters table
        */

    drawScatterplot(){

        // Append tooltip div
        let chartArea = d3.select('#scatter-area')

        let tooltip = chartArea
            .append('div')
            .classed('tooltip', true)
            .style('opacity', 0);

        // Append chart svg
        let svg = chartArea.append('svg')
            .attr('width', this.vizWidth + this.margin.left + this.margin.right)
            .attr('height', this.vizHeight + this.margin.top + this.margin.bottom);
        
        let chartGroup = svg.append('g').classed('wrapper-group', true);

        // Append axes
        let x = chartGroup.append('g')
            .classed('axis', true)
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${this.vizHeight})`)
            .append('text').text('')
            .classed('axis-label', true)
            .attr('transform', `translate(${this.vizWidth / 2}, 35)`)
            .attr('text-align', 'center');

        let y = chartGroup.append('g')
            .classed('axis', true)
            .attr('id', 'y-axis')
            .attr("transform", `translate(${this.margin.bottom * 2}, 0)`)
            .append("text").text('')
            .classed("axis-label", true)
            .attr("transform", `translate(-35, ${this.vizHeight/2}) rotate(270)`)
            .attr("text-align", "center");

        // Append dropdowns
        let dropdown = chartArea.append('div')
            .classed('dropdown-wrapper', true);





        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d=> d.challenge_rating)])
            .range([this.margin.left + this.margin.right, this.vizWidth]);

        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d=> d.hit_points)])
            .range([this.vizHeight, this.margin.top + this.margin.bottom]);
        


        svg.selectAll('circle')
            .data(this.data)
            .join('circle')
            .attr('cx', d=> this.xScale(d.challenge_rating))
            .attr('cy', d=> this.yScale(d.hit_points))
            .attr('r', 5);      

    }

    updateScatterplot(xAxis, yAxis, colorAxis){

    }
}