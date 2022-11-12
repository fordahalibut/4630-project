// Load data
async function loadData () {
    const monsterData = await d3.json('data/monsters.json');
    return { monsterData };
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

  });