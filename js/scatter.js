/** Class implementing the scatterplot */
class ScatterPlot{
    constructor(appState) {
        
        this.data = appState.monsterData;
        this.fullData = appState.monsterData;

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

        this.xIndicator = 'hit_points';
        this.yIndicator = 'challenge_rating';
        this.categoryIndicator = 'type';
    }

    /**TODO: 
            - split into initial draw and update functions
            - selectable axis - scales need to update
            - selectable categories for color
            - interaction with global filters
            - interaction with table - select row highlights graph result, brush on graph filters table
        */

    drawScatterplot(){

        let chartArea = d3.select('#scatter-area')

        // Append tooltip div
        this.tooltip = chartArea
            .append('div')
            .classed('tooltip', true)
            .style('opacity', 0);

        // Append chart svg
        let svg = chartArea.append('svg')
            .attr('width', this.vizWidth + this.margin.left + this.margin.right)
            .attr('height', this.vizHeight + this.margin.top + this.margin.bottom)
            .attr('id', 'scatterplot');
        
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

        let xWrapper = dropdown.append('div')
            .classed('dropdown-panel', true);

        xWrapper.append('div')
            .classed('x-label', true)
            .append('text')
            .text('X Axis Data:');

        xWrapper.append('div')
            .attr('id', 'dropdown_x')
            .classed('dropdown', true)
            .append('div')
            .classed('dropdown-content', true)
            .append('select');

        let yWrapper = dropdown.append('div')
            .classed('dropdown-panel', true);

        yWrapper.append('div')
            .classed('y-label', true)
            .append('text')
            .text('Y Axis Data:');

        yWrapper.append('div')
            .attr('id', 'dropdown_y')
            .classed('dropdown', true)
            .append('div')
            .classed('dropdown-content', true)
            .append('select');

        let colorWrapper = dropdown.append('div')
            .classed('dropdown-panel', true);
        
        colorWrapper.append('div')
            .classed('c-label', true)
            .append('text')
            .text('Category Choice:');
        
        colorWrapper.append('div')
            .attr('id', 'colorWrapper')
            .classed('dropdown', true)
            .append('div')
            .classed('dropdown-content', true)
            .append('select');

        let colorLegend = chartArea.append('div')
            .classed('color-legend', true)
            .append('svg')
            .append('g')
            .attr('transform', 'translate(10, 0)');
            
        this.updateScatterplot(this.data, this.xIndicator, this.yIndicator, this.categoryIndicator);

    }

    updateScatterplot(data, xIndicator, yIndicator, colorIndicator){
        
        this.xIndicator = xIndicator;
        this.yIndicator = yIndicator;
        this.colorIndicator = colorIndicator;
        this.data = data;


        // Define scales
        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(this.fullData, d => d[xIndicator])])
            .range([this.margin.left + this.margin.right, this.vizWidth]);

        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.fullData, d => d[yIndicator])])
            .range([this.vizHeight, this.margin.top + this.margin.bottom]);

        this.colorScale = d3.scaleOrdinal(d3.schemeSet3);

        // Draw circles
        d3.select('#scatterplot')
            .selectAll('circle')
            .data(this.data)
            .join('circle')
            .attr('id', (d,i) => d.index)
            .attr('cx', d=> this.xScale(d[xIndicator]))
            .attr('cy', d=> this.yScale(d[yIndicator]))
            .attr('fill', d=> this.colorScale(d[colorIndicator]))
            .attr('r', 10)
            .on('mouseup', (d,i) => {

                // Update selections

            })
            .on('mouseover', function(d) {

                let pos = d3.select(this).node().getBoundingClientRect();

                d3.select(this)
                    .style('stroke-width', 2);

                let content = d.path[0].__data__.name;
                
                d3.select('.tooltip')
                    .style('opacity', 0.9)
                    .html(`<h4>${content}</h4`)
                    .style('left', `${pos['x'] + 5}px`)
                    .style('top', `${(window.pageYOffset  + pos['y'] - 15)}px`);
            })
            .on('mouseout', function(d) {
                d3.select(this).style('stroke-width', 1);
                d3.select('.tooltip')
                .attr('transform', 'translate(0,0)')
                .style('opacity', 0);
            });

        // Axis labels
        let xLabel = this.numericIndicators.filter(d => d.indicator === xIndicator)[0].label;
        let xAxis = d3.select('#x-axis')
            .call(d3.axisBottom(this.xScale).ticks(10))
            .select('text')
            .text(xLabel);

        let yLabel = this.numericIndicators.filter(d => d.indicator === yIndicator)[0].label;
        let yAxis = d3.select('#y-axis')
            .call(d3.axisLeft(this.yScale).ticks(10))
            .select('text')
            .text(yLabel);

        this.drawLegend(colorIndicator);
        this.drawDropdowns(xIndicator, yIndicator, colorIndicator);
            
    }

    drawLegend(colorIndicator){

    }

    drawDropdowns(xIndicator, yIndicator, colorIndicator){
        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper');

        /* X DROPDOWN */
        let dropX = dropDownWrapper.select('#dropdown_x').select('.dropdown-content').select('select');

        let optionsX = dropX.selectAll('option')
            .data(this.numericIndicators)
            .join("option")
            .attr('value', d=> d.indicator)

        optionsX.join("text")
            .text(d => d.label);
    
        let selectedX = optionsX.filter(d => d.indicator === xIndicator)
            .attr('selected', true);

        dropX.on('change', function (d, i) {
            let xValue = this.options[this.selectedIndex].value;
            let yValue = dropY.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.data, xValue, yValue, cValue);
        });

        /* Y DROPDOWN */
        let dropY = dropDownWrapper.select('#dropdown_y').select('.dropdown-content').select('select');

        let optionsY = dropY.selectAll('option')
            .data(this.numericIndicators)
            .join("option")
            .attr('value', d => d.indicator)
       
        optionsY.join('text')
            .text(d => d.label);

        let selectedY = optionsY.filter(d => d.indicator === yIndicator)
            .attr('selected', true);

        dropY.on('change', function (d, i) {
            let yValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.data, xValue, yValue, cValue);
        });

        /* COLOR DROPDOWN */
        let dropC = dropDownWrapper.select('#dropdown_c').select('.dropdown-content').select('select');
        let optionsC = dropC.selectAll('option')
            .data(this.indicators)
            .join("option")
            .attr('value', d => d.indicator)

        optionsC.join("text")
            .text(d => d.label);

        let selectedC = optionsC.filter(d => d.indicator === circleSizeIndicator)
            .attr('selected', true);

        dropC.on('change', function (d, is) {
            let cValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let yValue = dropY.node().value;
            that.updatePlot(that.data, xValue, yValue, cValue);
        });


    }
}