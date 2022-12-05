/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(appState) {

        this.data = appState.filteredData;
        this.filteredData = [...this.data];

        this.vizWidth = 300;
        this.vizHeight = 30;

        this.headerData = [
            {
                key: 'name',
                sorted: false,
                ascending: false
            },
            {
                key: 'type',
                sorted: false,
                ascending: false 
            },
            {
                key: 'challenge_rating',
                sorted: false,
                ascending: false 
            },
            {
                key: 'hit_points',
                sorted: false,
                ascending: false 
            },
            {
                key: 'armor_class',
                sorted: false,
                ascending: false 
            },
            {
                key: 'xp',
                sorted: false,
                ascending: false 
            }
        ]

        this.columnNames = ['Name', 'Type', 'Challenge Rating', 'Hit Points', 'Armor Class', 'XP Value', 'Stats'];

        this.table = d3.select('#dataTable');
        this.rows = this.table.select('tbody').selectAll('tr');

        // Define scales for svg elements
        this.statScale = d3.scaleLinear()
            .domain([0, 30])
            .range([this.vizHeight, 0]);
        
        this.xScale = d3.scaleLinear()
            .domain([0,6]).nice()
            .range([20, this.vizWidth - 20]);

        this.colorScale = d3.scaleOrdinal(d3.schemeSet3);

        this.attachSortHandlers();
        this.drawLegends();
        this.updateHeaders();
    }

    // Draw legends for the svg elements
    drawLegends() {

        let legendLabels = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
        let legendData = [1.5, 2.5, 3.5, 4.5, 5.5, 6.5];

        let xAxis = d3.axisBottom()
            .scale(this.xScale)
            .ticks(legendData.length)
            .tickFormat((d,i) => legendLabels[i]);

        d3.select('#statViz')
            .attr('width', this.vizWidth)
            .attr('height', this.vizHeight)
            .call(xAxis);

        d3.select('#columnHeaders').selectAll('line').remove();
        d3.select('#columnHeaders').selectAll('path').remove();

    }

    drawTable() {

        d3.select('#dataTableBody').selectAll('rect').remove();
        this.updateHeaders();



        // Append tooltip div
        this.tooltip = d3.select('#dataTable')
            .append('div')
            .classed('tooltip', true)
            .attr('id', 'table-tooltip')
            .style('opacity', 0);

        let rows = d3.select('#dataTableBody')
            .selectAll('tr')
            .data(this.filteredData)
            .join('tr')
            .attr('id', d => `row-${d.index}`)
            .on('click', function(){

                // Retrieve id of previous and current selection
                let prevID = appState.selected[0].index
                let newID = d3.select(this).attr('id').substring(4);

                if (prevID != newID) {
                    // Update selection styling
                    d3.select(`#${prevID}`).classed('selected', false);
                    d3.select(`#row-${prevID}`).classed('selected', false);

                    d3.select(`#${newID}`).classed('selected', true);
                    d3.select(this).classed('selected', true);

                    // Scroll table to selected row
                    document.querySelector(`#row-${newID}`)
                        .scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});

                    // Update appState selection
                    appState.selected = appState.monsterData.filter(monster => monster.index === newID);
                    appState.detailed.drawDetailed();


                }
            });

        let tds = rows.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td');

        tds.filter(d => d.type === 'text')
            .text(d => d.value);

        this.drawRects(tds);            
    }

    rowToCellDataTransform(d) {
        let nameInfo = {
            type: 'text',
            value: d.name
        };

        let typeInfo = {
            type: 'text',
            value: d.type
        };

        let crInfo = {
            type: 'text',
            value: d.challenge_rating
        };

        let hpInfo = {
            type: 'text',
            value: d.hit_points
        };

        let acInfo = {
            type: 'text',
            value: d.armor_class
        };

        let xpInfo = {
            type: 'text',
            value: d.xp
        };

        let statInfo = {
            type: 'viz',
            str: d.strength,
            dex: d.dexterity,
            con: d.constitution,
            int: d.intelligence,
            wis: d.wisdom,
            cha: d.charisma
        };

        let dataList = [nameInfo, typeInfo, crInfo, hpInfo, acInfo, xpInfo, statInfo];
        return dataList;
    }

    updateHeaders() {
        for (let x in this.headerData) {

            let key = `#${this.headerData[x].key}`
            let selection = d3.select(key)
                .classed('sorting', false);

            if (this.headerData[x].sorted === true) {
                selection
                    .classed('sorting', true);
            }
        }
    }

    drawRects(tds) {

        let statArr = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        let labelArr = ['Strength: ', 'Dexterity: ', 'Constitution: ', 'Intelligence: ', 'Wisdom: ', 'Charisma: ']
        
        let stats = tds.filter(d => d.type === 'viz')
            .classed('text-center', true)
            .selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.vizWidth)
            .attr('height', this.vizHeight)
            .classed('stats', true);
        
        statArr.forEach((e, i) => {

            stats.join('rect')
                .append('rect')
                .attr('x', d => this.xScale(i))
                .attr('y', d => this.statScale(d[e]))
                .attr('width', 20)
                .attr('height', d => 30 - this.statScale(d[e]))
                .on('mouseover', function(d) {

                    let pos = d3.select(this).node().getBoundingClientRect();
    
                    d3.select(this)
                        .style('stroke-width', 2);
    
                    let content = labelArr[i] + d.path[0].__data__[e];
                    
                    d3.select('#table-tooltip')
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
        });

    }

    attachSortHandlers()
    {
        /**
         * Attach click handlers to all the th elements inside the columnHeaders row.
         * The handler should sort based on that column and alternate between ascending/descending.
         */

        d3.selectAll('#columnHeaders th')
            .on('click', (d) => {

                let choice = d.path[0].id;

                if (choice === 'name') {
                    this.headerData[0].sorted = true;
                    this.headerData[1].sorted = false;
                    this.headerData[2].sorted = false;
                    this.headerData[3].sorted = false;
                    this.headerData[4].sorted = false;
                    this.headerData[5].sorted = false;
                    this.headerData[0].ascending = !this.headerData[0].ascending;

                    if (this.headerData[0].ascending) {
                        this.filteredData.sort((a,b) => d3.ascending(a.name, b.name));
                    }
                    else {
                        this.filteredData.sort((a,b) => d3.descending(a.name, b.name));
                    }
                }

                else if (choice === 'type') {
                    this.headerData[0].sorted = false;
                    this.headerData[1].sorted = true;
                    this.headerData[2].sorted = false;
                    this.headerData[3].sorted = false;
                    this.headerData[4].sorted = false;
                    this.headerData[5].sorted = false;
                    this.headerData[1].ascending = !this.headerData[1].ascending;

                    if (this.headerData[1].ascending) {
                        this.filteredData.sort((a,b) => d3.ascending(a.type, b.type));
                    }
                    else {
                        this.filteredData.sort((a,b) => d3.descending(a.type, b.type));
                    }
                }

                else if (choice === 'challenge_rating') {
                    this.headerData[0].sorted = false;
                    this.headerData[1].sorted = false;
                    this.headerData[2].sorted = true;
                    this.headerData[3].sorted = false;
                    this.headerData[4].sorted = false;
                    this.headerData[5].sorted = false;
                    this.headerData[2].ascending = !this.headerData[2].ascending;

                    if (this.headerData[2].ascending) {
                        this.filteredData.sort((a,b) => d3.ascending(+a.challenge_rating, +b.challenge_rating));
                    }
                    else {
                        this.filteredData.sort((a,b) => d3.descending(+a.challenge_rating, +b.challenge_rating));
                    }
                }

                else if (choice === 'hit_points') {
                    this.headerData[0].sorted = false;
                    this.headerData[1].sorted = false;
                    this.headerData[2].sorted = false;
                    this.headerData[3].sorted = true;
                    this.headerData[4].sorted = false;
                    this.headerData[5].sorted = false;
                    this.headerData[3].ascending = !this.headerData[3].ascending;

                    if (this.headerData[3].ascending) {
                        this.filteredData.sort((a,b) => d3.ascending(+a.hit_points, +b.hit_points));
                    }
                    else {
                        this.filteredData.sort((a,b) => d3.descending(+a.hit_points, +b.hit_points));
                    }
                }

                else if (choice === 'armor_class') {
                    this.headerData[0].sorted = false;
                    this.headerData[1].sorted = false;
                    this.headerData[2].sorted = false;
                    this.headerData[3].sorted = false;
                    this.headerData[4].sorted = true;
                    this.headerData[5].sorted = false;
                    this.headerData[3].ascending = !this.headerData[3].ascending;

                    if (this.headerData[3].ascending) {
                        this.filteredData.sort((a,b) => d3.ascending(+a.armor_class, +b.armor_class));
                    }
                    else {
                        this.filteredData.sort((a,b) => d3.descending(+a.armor_class, +b.armor_class));
                    }
                }

                else if (choice === 'xp') {
                    this.headerData[0].sorted = false;
                    this.headerData[1].sorted = false;
                    this.headerData[2].sorted = false;
                    this.headerData[3].sorted = false;
                    this.headerData[4].sorted = false;
                    this.headerData[5].sorted = true;
                    this.headerData[3].ascending = !this.headerData[3].ascending;

                    if (this.headerData[3].ascending) {
                        this.filteredData.sort((a,b) => d3.ascending(+a.xp, +b.xp));
                    }
                    else {
                        this.filteredData.sort((a,b) => d3.descending(+a.xp, +b.xp));
                    }
                }

                this.drawTable();

                // Retrieve id of previous and current selection
                let prevID = appState.selected[0].index;
                let newID = d3.select('tbody > tr').attr('id').substring(4);

                // Update selection styling
                d3.select(`#${prevID}`).classed('selected', false);
                d3.select(`#row-${prevID}`).classed('selected', false);

                d3.select(`#${newID}`).classed('selected', true);
                d3.select(`#row-${newID}`).classed('selected', true);

                // Update appState selection
                appState.selected = appState.monsterData.filter(monster => monster.index === newID);
            })

    }

}
