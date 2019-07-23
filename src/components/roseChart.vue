<template>
<div class='roseChart-chart-container'>
      <!-- <div class='chart-name chart-name-right'>{{name}}</div> -->
      <div v-bind:id='id' class='roseChart-container'>
   
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
    default: () => 30,
  },
  left:{
    type: Number,
    default: () => 20,
  },
  width:{
    type: Number,
    default: () => 400,
  },
  height:{
    type:Number,
    default: () => 200,
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
            var roseChart_container = d3.select('#' + this.id)		//matrix_container	
										.append("svg")		
										.attr("width", this.width)	
                                        .attr("height", this.height);

            width = +svg.attr("width"),
            height = +svg.attr("height"),
            margin = {top: 40, right: 80, bottom: 40, left: 40},
            innerRadius = 20,
            chartWidth = width - margin.left - margin.right,
            chartHeight= height - margin.top - margin.bottom,
            outerRadius = (Math.min(chartWidth, chartHeight) / 2),
            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            var angle = d3.scaleLinear()
                .range([0, 2 * Math.PI]);

            var radius = d3.scaleLinear()
                .range([0, outerRadius]);

            var x = d3.scaleBand()
                .range([0, 2 * Math.PI])
                .align(0);

            var y = d3.scaleLinear() //you can try scaleRadial but it scales differently
                .range([innerRadius, outerRadius]);
        }

    },
}
</script>
<style lang="css">


.selectBase-chart-container{
  
  position:absolute;
}


</style>