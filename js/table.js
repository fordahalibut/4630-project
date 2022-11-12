/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(appState) {

        this.data = appState.monsterData;
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
            }
        ]

        this.columnNames = ['Name', 'Type', 'Challenge Rating', 'Hit Points', 'Armor Class', 'Stats'];

        this.table = d3.select('#dataTable');
        this.rows = this.table.select('tbody').selectAll('tr');

       // Define scales for svg elements

        this.attachSortHandlers();
        //this.drawLegends();
        this.updateHeaders();
    }

    // Draw legends for the svg elements
    drawLegends() {
        // TODO: decide visual representation for stats

    }

    drawTable() {
        this.updateHeaders();

        let rowSelection = d3.select('#dataTableBody')
            .selectAll('tr')
            .data(this.filteredData)
            .join('tr');

        let selection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td');

        selection.filter(d => d.type === 'text')
            .text(d => d.value);
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

        let dataList = [nameInfo, typeInfo, crInfo, hpInfo, acInfo];
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
                    this.headerData[3].ascending = !this.headerData[3].ascending;

                    if (this.headerData[3].ascending) {
                        this.filteredData.sort((a,b) => d3.ascending(+a.armor_class, +b.armor_class));
                    }
                    else {
                        this.filteredData.sort((a,b) => d3.descending(+a.armor_class, +b.armor_class));
                    }
                }
                this.drawTable();
            })

    }

}
