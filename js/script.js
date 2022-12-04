// Load data
async function loadData () {
    const monsterData = await d3.json('data/monsters.json');
    return { monsterData };
}

// Application state variable
const appState = {
    monsterData: null,
    filteredData: null,
    table: null,
    scatterplot: null,
    detailed: null,
    selected: null
};

// Application mounting
loadData().then((loadedData) => {
    console.log('Imported Data:', loadedData.monsterData);
  
    // Store the loaded data into the application state
    appState.monsterData = loadedData.monsterData;
    appState.filteredData = appState.monsterData;
  

    // Create new view objects
    const table = new Table(appState);
    appState.table = table;
    table.drawTable();

    const scatter = new ScatterPlot(appState);
    scatter.drawScatterplot();

    const detailed = new DetailedView(appState);
  


    // Global filter behavior
    $(document).ready(function(){

        // Selection logic
        $('.table > tbody > tr').click(function() {
            $(this).toggleClass("selected");
        });

        $('circle').click(function() {
            $(this).toggleClass('selected');
        });

        // Filter collapse behavior
        $('.collapsible').click(function() {
            
            $(this).toggleClass('active');

            let content = $(this).next()

            if (content.css('display') === 'block') {
                content.css('display', 'none');
            }
            else {
                content.css('display', 'block');
            }
        });

        let types = [...new Set(appState.monsterData.map(d => d.type))];
        let alignments =  [...new Set(appState.monsterData.map(d => d.alignment))];
        let ranges = ['challenge_rating', 'hit_points', 'armor_class', 'xp'];
        let filterData = appState.monsterData;

        console.log(alignments);
        
        // Filter sliders
        for (label of ranges) {

            let minValue = d3.min(filterData, d => d[label]);
            let maxValue = d3.max(filterData, d => d[label]);

            d3.select('#' + label + '-label')
                .property('value', minValue + '-' + maxValue);

                console.log('#' + label + '-range');

            $('#' + label + '-range').slider({
                range: true,
                min: minValue,
                max: maxValue,
                values: [minValue, maxValue],
                slide: function(event, ui) {
                    let statKey = $(this).attr("id").split("-")[0];
                    d3.select("#" + statKey + "-label")
                        .property("value", ui.values[0] + " - " + ui.values[1]);
                }
            });
        }

        // Type filter
        d3.select('#type-selection')
            .selectAll('li')
            .data(types)
            .join('li')
            .text(d => d)
            .attr('id', d=> 't-' + d)
            .classed('ui-widget-content', true);
            
        $('#type-selection').selectable();


        // Apply filters
        $('#apply-button').click(function() {

            let minCr = d3.select('#challenge_rating-label').property('value').split('-')[0];
            let maxCr = d3.select('#challenge_rating-label').property('value').split('-')[1];

            let minHP = d3.select('#hit_points-label').property('value').split('-')[0];
            let maxHP = d3.select('#hit_points-label').property('value').split('-')[1];

            let minAC = d3.select('#armor_class-label').property('value').split('-')[0];
            let maxAC = d3.select('#armor_class-label').property('value').split('-')[1];

            let minXP = d3.select('#xp-label').property('value').split('-')[0];
            let maxXP = d3.select('#xp-label').property('value').split('-')[1];

            let filteredTypes = [];

            let filteredName = d3.select('#nameSearch').property('value').toLowerCase();

            for (t of types) {
                let li = d3.select(`#t-${t}`);

                if (!li.classed('ui-selected')) {
                    filteredTypes.push(t);
                }
            }

            const filtered = appState.monsterData.filter(monster =>
                (monster.challenge_rating >= minCr && monster.challenge_rating <= maxCr) &&
                (monster.hit_points >= minHP && monster.hit_points <= maxHP) &&
                (monster.armor_class >= minAC && monster.armor_class <= maxAC) &&
                (monster.xp >= minXP && monster.xp <= maxXP) &&
                (filteredTypes.includes(monster.type)) &&
                (monster.name.toLowerCase().includes(filteredName))
                )

            appState.filteredData = filtered;

            const table = new Table(appState);
            appState.table = table;
            table.drawTable();
            scatter.drawScatterplot();

        })

        // Clear filters
        $('#clear-button').click(function() {

            appState.filteredData = appState.monsterData;
            table.drawTable();
            scatter.drawScatterplot();

            for (t of types) {
                let li = d3.select(`#t-${t}`);

                li.classed('ui-selected', false);
            }

            for (label of ranges) {

                let minValue = d3.min(filterData, d => d[label]);
                let maxValue = d3.max(filterData, d => d[label]);
    
                d3.select('#' + label + '-label')
                    .property('value', minValue + '-' + maxValue);
    
                $('#' + label + '-range').slider({
                    range: true,
                    min: minValue,
                    max: maxValue,
                    values: [minValue, maxValue],
                    slide: function(event, ui) {
                        let statKey = $(this).attr("id").split("-")[0];
                        d3.select("#" + statKey + "-label")
                            .property("value", ui.values[0] + " - " + ui.values[1]);
                    }
                });
            }

            d3.select('#nameSearch').property('value', '');

        })
    
    })
});