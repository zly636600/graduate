<template>
<div class='filter-chart-container'>
      <!-- <div class='chart-name chart-name-right'>{{name}}</div> -->
      <div v-bind:id='id' class='filter-container'>
   
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
    default: () => 'filter-chart-container',
  },
//   name:{
//     type: String,
//     default: () => '直方图',
//   },
  top:{
    type: Number,
    default: () => 50,
  },
  right:{
    type: Number,
    default: () => 10,
  },
  width:{
    type: Number,
    default: () => 500,
  },
  height:{
    type:Number,
    default: () => 400,
  }

};

export default {
    
    name:'filter-chart',
    props,
    mounted:function(){

        d3.select(d3.select('#' + this.id).node().parentNode)
                .style('top', this.top + 'px')
                .style('right', this.right + 'px')

        DataProvider.getbaseCsv().then( baseStationResponse =>{

                    let baseStationdata = dsv.csvParse(baseStationResponse.data);

                    this.base_data = baseStationdata;

        })

    },

    watch:{

    },

    methods:{

        chartInit(){

            var filter_container = d3.select('#' + this.id)		//matrix_container	
										.append("svg")		
										.attr("width", this.width)	
                    .attr("height", this.height);

             this.base_data.forEach(d => {
                d.count = parseInt(d.count);
                d.hour = parseInt(d.hour)
            });

            let result = {};
            let amount = 0;
            for(let i = 0;i < this.base_data.length;i++){
              if(this.base_data[i].lac)
             amount = amount + this.base_data.count;
             
            }
            let result = {};
            let finalResult = [];
            let positions = [];
            let dic_base_data = {};
            for(let i = 0;i<this.base_data.length;i++){
              result[this.base_data[i].name] = this.base_data[i];
              let key = this.base_data[i].name;
              if(dic_base_data[key]==undefined){
                dic_base_data[key] = [];
                dic_base_data[key].push({"hour":this.base_data[i].HOUR,"count":this.base_data[i].count})                
              }
              else{
                dic_base_data[key].push({"hour":this.base_data[i].HOUR,"count":this.base_data[i].count})
              }
            }
            for(let key in result){
              finalResult.push(result[key]);
            }

                   
            var rectNum = 24;      //刻度的数量     
            var rangeMin = 0;
            var rangeMax = 24;
                      
            var xAxisWidth = 500;
            
            var padding = {top:30, right:30, bottom:30, left:30};
            
            //定义x轴比例尺			
            let x = d3.scaleLinear()
                .domain([0,24])
                .range([0, xAxisWidth])

            var histogram = d3.histogram()  //直方图布局
                              .domain(x.domain())
                              .thresholds(x.ticks(24))
                                

            var xScale = d3.scaleBand()
                        .domain([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24])
                        .rangeRound([padding.left,xAxisWidth-padding.right])
                        .padding(0.1);

            var yAxisWidth = 400;
            var yScale = d3.scaleLinear()
                            .domain([0,d3.max(data,function(d){return d.count;}) ])
                            .range([yAxisWidth-padding.bottom,padding.top]);
            //绘制x轴					
            var xAxis = d3.axisBottom()
                        .scale(xScale)
                        .tickValues(xScale.domain())
                        //.tickFormat(d3.format(".0f"));
                        
            histogram_container.append("g")
                .attr("class","axis")
                .attr("transform","translate("+0+","+(yAxisWidth - padding.bottom)+")")
                .call(xAxis);
            //绘制y轴	
            var yAxis = d3.axisLeft()
                        .scale(yScale)
                        .tickFormat(d3.format(".0f"));
            
            histogram_container.append("g")
                .attr("class","axis")
                .attr("transform","translate("+padding.left+","+0+")")
                .call(yAxis)

            histogram_container.selectAll('.axis').selectAll('path').attr('stroke','white').attr('opacity','0.5')
			      histogram_container.selectAll('.axis').selectAll('line').attr('stroke','white').attr('opacity','0.5')
			      histogram_container.selectAll('.axis').selectAll('text').attr('fill','white').attr('opacity','0.5')
                
                
            var hisRect = histogram_container.append("g")
                            .style("opacity",0.5);
                            
            hisRect.selectAll("rect")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("class","rect")
                    .attr("x",function(d,i){
                        return xScale(d.hour);
                    })
                    .attr("y", d => yScale(d.count))
                    .attr("width",function(d,i){
                        return xScale.bandwidth();
                    })
                    .attr("height", d => yScale.range()[0]-yScale(d.count))
                    .attr("fill","steelblue")
        

        }

    },
}
</script>
<style lang="css">


.histogram-chart-container{
  
  position:absolute;
}


</style>