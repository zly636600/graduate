<template>
<div class='selectBase-chart-container'>
      <!-- <div class='chart-name chart-name-right'>{{name}}</div> -->
      <div v-bind:id='id' class='selectBase-container'>
   
      </div>
  </div>
</template>

<script>

const d3 = require('d3');

import * as dsv from 'd3-dsv'

import DataProvider from '../DataProvider';

const props = {
  id: {
    type: String,
    default: () => 'selectBase-chart-container',
  },
//   name:{
//     type: String,
//     default: () => '直方图',
//   },
  top:{
    type: Number,
    default: () => 600,
  },
  left:{
    type: Number,
    default: () => 50,
  },
  width:{
    type: Number,
    default: () => 800,
  },
  height:{
    type:Number,
    default: () => 400,
  }

};

export default {
    
    name:'selectBase-chart',
    props,
    mounted:function(){

        d3.select(d3.select('#' + this.id).node().parentNode)
                .style('top', this.top + 'px')
                .style('left', this.left + 'px')

       

        this.$root.$on('base_data',(basedata)=>{
           this.$root.$on('AreaData', (areadata) => {
             this.area_data = areadata	
             this.base_data = basedata 
             this.selectBaseChartInit(this.base_data,this.area_data);

            })                 
        })      
    },

    watch:{

    },

    methods:{

        selectBaseChartInit(){

            var selectBase_container = d3.select('#' + this.id)		//matrix_container	
										.append("svg")		
										.attr("width", this.width)	
                    .attr("height", this.height);

             this.base_data.forEach(d => {
                d.count = parseInt(d.count);
                d.hour = parseInt(d.hour)
            });

            let data = d3.nest()
            .key(function(d){return d.key})
            .rollup(function(v){return d3.sum(v,function(d){return d.count;})/48})
            .entries(this.base_data)  
            //console.log(data)

            let arr = [];
            for(var key in data){
              arr.push(data[key].value)
            }

            //console.log(arr)
                      
            var xAxisWidth = 800;
            
            var padding = {top:35, right:35, bottom:35, left:35};
            
            //定义x轴比例尺			
            let x = d3.scaleLinear()
                .domain(d3.extent(arr)).nice()
                .range([0, xAxisWidth])

            let ticks = [], step = 30

            for (let i =0;i<600;i+=step){

              ticks.push(i)
            }

            var histogram = d3.histogram()  //直方图布局
                              .domain(x.domain())
                              .thresholds(ticks)

            var hisData = histogram(arr)      
            
            //console.log(hisData)
            
            var xTicks = hisData.map(function(d){return d.x0})

            var xScale = d3.scaleBand()
                        .domain(xTicks)
                        .rangeRound([padding.left,xAxisWidth-padding.right])
                        .padding(0.1);

            var yAxisWidth = 400;
            var yScale = d3.scaleLinear()
                            .domain([d3.min(hisData,function(d){return d.length;}),d3.max(hisData,function(d){return d.length;}) ])
                            .range([yAxisWidth-padding.bottom,padding.top]);
            //绘制x轴					
            var xAxis = d3.axisBottom()
                        .scale(xScale)
                        .tickValues(xScale.domain())
                        //.tickFormat(d3.format(".0f"));
                        
            selectBase_container.append("g")
                .attr("class","axis")
                .attr("transform","translate("+0+","+(yAxisWidth - padding.bottom)+")")
                .call(xAxis);
            //绘制y轴	
            var yAxis = d3.axisLeft()
                        .scale(yScale)
                        .tickFormat(d3.format(".0f"));
            
            selectBase_container.append("g")
                .attr("class","axis")
                .attr("transform","translate("+padding.left+","+0+")")
                .call(yAxis)

            selectBase_container.selectAll('.axis').selectAll('path').attr('stroke','white')
			      selectBase_container.selectAll('.axis').selectAll('line').attr('stroke','white')
			      selectBase_container.selectAll('.axis').selectAll('text').attr('fill','white')
                
                
            var hisRect = selectBase_container.append("g")
                            .style("opacity",0.5);
                            
            hisRect.selectAll("rect")
                    .data(hisData)
                    .enter()
                    .append("rect")
                    .attr("class","rect")
                    .attr("x",function(d,i){
                        return xScale(d.x0);
                    })
                    .attr("y", d => yScale(d.length))
                    .attr("width",function(d,i){
                        return xScale.bandwidth();
                    })
                    .attr("height", d => yScale.range()[0]-yScale(d.length))
                    .attr("fill","steelblue")
        

        }

    },
}
</script>
<style lang="css">


.selectBase-chart-container{
  
  position:absolute;
}


</style>