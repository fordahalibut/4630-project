class DetailedView{

    constructor(appState) {
        this.data = appState.selected;

        this.margin = {
            left: 30,
            right: 30,
            top: 30,
            bottom: 30
        };
        
        this.vizWidth = 300;
        this.vizHeight = 300;

        this.svg = d3.select('.detail-body').append('svg')
            .attr('height', this.vizHeight - this.margin.top - this.margin.bottom)
            .attr('width', this.vizWidth - this.margin.left - this.margin.right);

        this.radarSVG = d3.select('.detail-body').append('svg')
            .attr('height', this.vizHeight - this.margin.top - this.margin.bottom)
            .attr('width', this.vizWidth - this.margin.left - this.margin.right);

        this.strScale = d3.scaleLinear()
            .domain([0, 30])
            .range([0,100]).nice();
        
        this.dexScale = d3.scaleLinear()
            .domain([0, 30])
            .range([0,100]).nice();
        
        this.conScale = d3.scaleLinear()
            .domain([0, 30])
            .range([0,100]).nice();
        
        this.intScale = d3.scaleLinear()
            .domain([0, 30])
            .range([0,100]).nice();
            
        this.wisScale = d3.scaleLinear()
            .domain([0, 30])
            .range([0,100]).nice();
        
        this.chaScale = d3.scaleLinear()
            .domain([0, 30])
            .range([0,100]).nice();
    }

    drawDetailed() {

        this.svg.selectAll('image').remove();

        this.data = appState.selected;

        d3.select('.detail-header')
            .join('text')
            .data(this.data)
            .text(d => d.name);
        
       

        this.svg.append('image')
            .data(this.data)
            .attr('xlink:href', function(d) {
                if(d.image) {
                    return `https://www.dnd5eapi.co${d.image}`
                }
            })
            .attr('id', 'image')
            .attr('width', 240)
            .attr('height', 240);

        

        // let svg = d3.select('')

        // d3.select('#monsterImage')
            
    }
}