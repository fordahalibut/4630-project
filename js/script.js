// Load data
async function loadData () {
    const monsterData = await d3.json('data/monsters.json');
    return { monsterData };
}

// 
class Filter {
    constructor(label, value) {
        this.label = label;
        this.value = value;
    }
}

// Application state variable
const appState = {
    monsterData: null,
    table: null,
    scatterplot: null,
    detailed: null
};

// Application mounting
loadData().then((loadedData) => {
    console.log('Imported Data:', loadedData.monsterData);
  
    // Store the loaded data into the application state
    appState.monsterData = loadedData.monsterData;
  

    // Create new view objects

    // Creates the view objects with the global state passed in 
    const table = new Table(appState);
    appState.table = table;
    table.drawTable();

    const scatter = new ScatterPlot(appState);
    scatter.drawScatterplot();

    const detailed = new DetailedView(appState);
  

    /** TODO: Global filter behavior
            - Text box input control
            - slider control with text input min/max
            - multi-select creature types and alignment

    */

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

        // Filter sliders
        let types = [...new Set(appState.monsterData.map(d => d.type))];
        let ranges = ['challenge_rating', 'hit_points', 'armor_class', 'xp'];
        let filterData = appState.monsterData;
        
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
    
    })
});